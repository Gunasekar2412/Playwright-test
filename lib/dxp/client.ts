import type { DxpPersona } from './config';
import { getDxpBaseUrl, getDxpBasicAuth } from './config';

export class DxpHttpError extends Error {
  readonly status: number;
  readonly path: string;
  readonly bodyText?: string;

  constructor(message: string, init: { status: number; path: string; bodyText?: string }) {
    super(message);
    this.name = 'DxpHttpError';
    this.status = init.status;
    this.path = init.path;
    this.bodyText = init.bodyText;
  }
}

function basicHeader(user: string, password: string): string {
  const token = Buffer.from(`${user}:${password}`, 'utf8').toString('base64');
  return `Basic ${token}`;
}

export interface DxpRequestInit {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  persona: DxpPersona;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

export interface DxpClient {
  requestJson<T>(init: DxpRequestInit): Promise<T>;
  requestRaw(init: DxpRequestInit): Promise<Response>;
}

export function createDxpClient(): DxpClient {
  const baseUrl = getDxpBaseUrl();
  if (!baseUrl) {
    throw new Error('DXP_API_BASE_URL is not set');
  }

  function buildUrl(path: string, query?: DxpRequestInit['query']): string {
    const url = new URL(path.startsWith('http') ? path : `${baseUrl}${path}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined) continue;
        url.searchParams.append(k, String(v));
      }
    }
    return url.toString();
  }

  async function requestRaw(init: DxpRequestInit): Promise<Response> {
    const creds = getDxpBasicAuth(init.persona);
    if (!creds) {
      throw new Error(
        init.persona === 'guest'
          ? 'DXP guest Basic auth not configured (DXP_GUEST_BASIC_USER / DXP_GUEST_BASIC_PASSWORD)'
          : 'DXP agent Basic auth not configured (DXP_AGENT_BASIC_USER / DXP_AGENT_BASIC_PASSWORD or EIS_USERNAME / EIS_PASSWORD)'
      );
    }
    const url = buildUrl(init.path, init.query);
    const headers: Record<string, string> = {
      Authorization: basicHeader(creds.user, creds.password),
      Accept: 'application/json',
    };
    const body =
      init.body !== undefined ? JSON.stringify(init.body) : undefined;
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    return fetch(url, { method: init.method, headers, body });
  }

  async function requestJson<T>(init: DxpRequestInit): Promise<T> {
    const res = await requestRaw(init);
    const text = await res.text();
    if (!res.ok) {
      const bodySnippet = text ? ` | body: ${text.slice(0, 600)}` : '';
      throw new DxpHttpError(`DXP ${init.method} ${init.path} failed: ${res.status}${bodySnippet}`, {
        status: res.status,
        path: init.path,
        bodyText: text.slice(0, 4000),
      });
    }
    if (!text) return {} as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new DxpHttpError(`DXP ${init.path} returned non-JSON`, {
        status: res.status,
        path: init.path,
        bodyText: text.slice(0, 4000),
      });
    }
  }

  return { requestJson, requestRaw };
}
