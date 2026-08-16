import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '../../../siteConfig';

interface ChatRequestBody {
  message?: unknown;
  history?: unknown;
  config?: { model?: string; systemPrompt?: string };
}

interface GlmChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY = 10;
const DEFAULT_MODEL = 'glm-5.3';
const DEFAULT_BASE_URL = 'https://glm.llm.autos';

function isSameOrigin(request: NextRequest) {
  const candidate = request.headers.get('origin') || request.headers.get('referer');
  if (!candidate) return true;
  try {
    const candidateHost = new URL(candidate).host.toLowerCase();
    const allowedHosts = [
      request.nextUrl.host,
      request.headers.get('host'),
      request.headers.get('x-forwarded-host')?.split(',')[0],
    ]
      .filter((host): host is string => Boolean(host))
      .map((host) => host.trim().toLowerCase());
    return allowedHosts.includes(candidateHost);
  } catch {
    return false;
  }
}

function resolveGlmModel(requested?: string) {
  const candidate = requested?.trim() || process.env.GLM_MODEL || siteConfig.aiConfig.modelId || DEFAULT_MODEL;
  return /^glm-[a-z0-9.-]+$/i.test(candidate) ? candidate : DEFAULT_MODEL;
}

function resolveGlmEndpoint() {
  const configured = (process.env.GLM_BASE_URL || DEFAULT_BASE_URL).trim();
  const url = new URL(configured);
  if (url.protocol !== 'https:') throw new Error('GLM_BASE_URL must use HTTPS');
  return `${url.toString().replace(/\/$/, '')}/v1/chat/completions`;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ reply: '请求来源无效。' }, { status: 403 });
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: '没有收到有效消息。' }, { status: 400 });
  }

  if (typeof body.message !== 'string' || !body.message.trim()) {
    return NextResponse.json({ reply: '请输入想聊的内容。' }, { status: 400 });
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ reply: '消息太长了，请精简后再试。' }, { status: 400 });
  }

  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (item): item is { role?: unknown; content: string } =>
            Boolean(item) &&
            typeof item === 'object' &&
            typeof (item as { content?: unknown }).content === 'string',
        )
        .slice(-MAX_HISTORY)
        .map((item) => ({
          role: item.role === 'assistant' ? 'assistant' : 'user',
          content: item.content.slice(0, MAX_MESSAGE_LENGTH),
        }))
    : [];

  const apiKey = process.env.GLM_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ reply: 'GLM 助手尚未完成配置。' }, { status: 503 });
  }

  const model = resolveGlmModel(body.config?.model);
  const system = (body.config?.systemPrompt || siteConfig.petConfig.systemPrompt).slice(0, MAX_MESSAGE_LENGTH);

  try {
    const response = await fetch(resolveGlmEndpoint(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          ...history,
          { role: 'user', content: body.message.trim() },
        ],
        reasoning_effort: 'low',
        max_tokens: siteConfig.aiConfig.maxOutputTokens,
        temperature: siteConfig.aiConfig.temperature,
        stream: false,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(30_000),
    });

    const result = (await response.json().catch(() => ({}))) as GlmChatResponse;
    if (!response.ok) {
      console.error('GLM request failed:', response.status, result.error?.message || 'Unknown provider error');
      if (response.status === 429) {
        return NextResponse.json({ reply: '聊天请求有点多，请稍后再试。' }, { status: 429 });
      }
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ reply: 'GLM 助手认证失败，请联系站长。' }, { status: 503 });
      }
      return NextResponse.json({ reply: 'GLM 服务暂时不可用，请稍后再试。' }, { status: 502 });
    }

    const reply = result.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ reply: reply || '暂时没有生成有效回复。' });
  } catch (error) {
    console.error('GLM request failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ reply: '连接 GLM 失败，请稍后再试。' }, { status: 502 });
  }
}
