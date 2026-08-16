import { createClient as createLibsqlClient, type InArgs, type InStatement } from '@libsql/client';
import postgres, { type ReservedSql } from 'postgres';

type Statement = string | InStatement;
type QueryResult = { rows: Record<string, unknown>[]; rowsAffected: number };

export interface DatabaseClient {
  execute(statement: Statement): Promise<QueryResult>;
  transaction(mode?: 'read' | 'write'): Promise<DatabaseTransaction>;
  close(): void | Promise<void>;
}

export interface DatabaseTransaction {
  execute(statement: Statement): Promise<QueryResult>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  close(): void | Promise<void>;
}

function normalizeStatement(statement: Statement) {
  return typeof statement === 'string'
    ? { sql: statement, args: [] as InArgs }
    : { sql: statement.sql, args: statement.args || [] };
}

export function translatePostgresSql(source: string) {
  let index = 0;
  let sql = source.trim().replace(/;$/, '');
  const ignoreConflict = /^INSERT\s+OR\s+IGNORE\s+/i.test(sql);
  sql = sql.replace(/^INSERT\s+OR\s+IGNORE\s+/i, 'INSERT ');
  sql = sql.replace(/json_group_array\(([^)]+)\)/gi, 'json_agg($1)');
  sql = sql.replace(/([A-Za-z0-9_.]+)\s*=\s*\?\s+COLLATE\s+NOCASE/gi, 'LOWER($1) = LOWER(?)');
  sql = sql.replace(/\?/g, () => `$${++index}`);
  const tables = [
    'admin_users', 'admin_login_failures', 'public_users', 'public_auth_events',
    'categories', 'tags', 'posts', 'post_tags', 'post_comments', 'comment_likes',
    'moments', 'projects', 'friends', 'messages', 'albums', 'photos', 'songs',
  ];
  for (const table of tables) {
    sql = sql.replace(
      new RegExp(`\\b(FROM|JOIN|INTO|UPDATE|DELETE\\s+FROM)\\s+${table}\\b`, 'gi'),
      `$1 mblog.${table}`,
    );
  }
  if (ignoreConflict && !/\bON\s+CONFLICT\b/i.test(sql)) sql += ' ON CONFLICT DO NOTHING';
  return sql;
}

function normalizePostgresRows(rows: Record<string, unknown>[]) {
  return rows.map((row) => {
    if (Array.isArray(row.tags_json)) return { ...row, tags_json: JSON.stringify(row.tags_json) };
    return row;
  });
}

async function executePostgres(client: ReservedSql | ReturnType<typeof postgres>, statement: Statement): Promise<QueryResult> {
  const { sql, args } = normalizeStatement(statement);
  const parameters = Array.isArray(args) ? args : Object.values(args);
  const result = await client.unsafe(translatePostgresSql(sql), parameters as never[]);
  return {
    rows: normalizePostgresRows(Array.from(result) as Record<string, unknown>[]),
    rowsAffected: result.count || 0,
  };
}

function createPostgresClient(connectionString: string): DatabaseClient {
  const sql = postgres(connectionString, {
    max: Number(process.env.DATABASE_POOL_SIZE || 5),
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
    ssl: 'require',
    connection: {
      application_name: 'messere-blog',
      search_path: 'mblog,public',
    },
  });

  return {
    execute: (statement) => executePostgres(sql, statement),
    async transaction() {
      const reserved = await sql.reserve();
      let finished = false;
      let released = false;
      await reserved.unsafe('BEGIN');

      const release = () => {
        if (released) return;
        released = true;
        reserved.release();
      };

      return {
        execute: (statement) => executePostgres(reserved, statement),
        async commit() {
          if (finished) return;
          await reserved.unsafe('COMMIT');
          finished = true;
          release();
        },
        async rollback() {
          if (finished) return;
          await reserved.unsafe('ROLLBACK');
          finished = true;
          release();
        },
        close() {
          if (finished) return;
          void reserved.unsafe('ROLLBACK').finally(() => {
            finished = true;
            release();
          });
        },
      };
    },
    close() {
      return sql.end({ timeout: 5 });
    },
  };
}

function createLocalClient(): DatabaseClient {
  const client = createLibsqlClient({
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });
  return client as unknown as DatabaseClient;
}

let database: DatabaseClient | null = null;

export function getDb(): DatabaseClient {
  if (database) return database;
  const postgresUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  database = postgresUrl ? createPostgresClient(postgresUrl) : createLocalClient();
  return database;
}

export const db = new Proxy({} as DatabaseClient, {
  get(_, prop) {
    const client = getDb();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
