import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("admin dashboard reads live counts and uses the same pending-message scope as moderation", async () => {
  const [dashboard, messagesPage, revalidation] = await Promise.all([
    readFile("app/admin/page.tsx", "utf8"),
    readFile("app/admin/messages/page.tsx", "utf8"),
    readFile("lib/admin/revalidate.ts", "utf8"),
  ]);

  assert.match(dashboard, /export const dynamic\s*=\s*['"]force-dynamic['"]/);
  assert.match(dashboard, /FROM messages WHERE status = ['"]pending['"] AND deleted_at IS NULL/i);
  assert.match(dashboard, /pending_message_count/);
  assert.match(dashboard, /label:\s*['"]留言待审['"]/);
  assert.equal((dashboard.match(/db\.execute/g) || []).length, 1);
  assert.match(messagesPage, /m\.status === filter/);
  assert.match(revalidation, /revalidateAfterMessage\(\)[\s\S]*?revalidatePath\(['"]\/admin['"]\)/);
});

test("friend links are managed directly without an approval workflow", async () => {
  const [dashboard, repository, publicPage, adminPage, newPage, editPage, validators, schema] = await Promise.all([
    readFile("app/admin/page.tsx", "utf8"),
    readFile("lib/db/friends.ts", "utf8"),
    readFile("app/friends/page.tsx", "utf8"),
    readFile("app/admin/friends/page.tsx", "utf8"),
    readFile("app/admin/friends/new/page.tsx", "utf8"),
    readFile("app/admin/friends/[id]/edit/page.tsx", "utf8"),
    readFile("lib/admin/validators.ts", "utf8"),
    readFile("lib/schema.sql", "utf8"),
  ]);

  assert.match(dashboard, /label:\s*['"]友链总数['"]/);
  assert.match(dashboard, /FROM friends WHERE deleted_at IS NULL/i);
  assert.doesNotMatch(dashboard, /友链待审|FROM friends WHERE status = ['"]pending['"]/i);

  assert.match(repository, /getPublicFriends/);
  assert.match(repository, /SELECT \* FROM friends WHERE deleted_at IS NULL ORDER BY sort_order/i);
  assert.doesNotMatch(repository, /approveFriend|rejectFriend/);
  assert.match(publicPage, /getPublicFriends/);

  for (const source of [adminPage, newPage, editPage]) {
    assert.doesNotMatch(source, /待审核|已通过|已拒绝|handleStatus/);
  }
  const friendValidator = validators.match(/export const createFriendSchema[\s\S]*?export const updateFriendSchema/)?.[0] || "";
  assert.doesNotMatch(friendValidator, /status/);
  assert.match(schema, /CREATE TABLE IF NOT EXISTS friends[\s\S]*?status TEXT NOT NULL DEFAULT ['"]approved['"]/);

  await assert.rejects(access("app/api/admin/friends/[id]/approve/route.ts"), { code: "ENOENT" });
  await assert.rejects(access("app/api/admin/friends/[id]/reject/route.ts"), { code: "ENOENT" });
});
