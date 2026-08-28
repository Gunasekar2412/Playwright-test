export type DxpPersona = 'guest' | 'agent';

export function getDxpBaseUrl(): string | undefined {
  const raw = process.env.DXP_API_BASE_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/$/, '');
}

/** Exported for diagnostics in tests (do not log passwords). */
export function getDxpBasicAuth(persona: DxpPersona): { user: string; password: string } | undefined {
  if (persona === 'guest') {
    const user =
      process.env.DXP_GUEST_BASIC_USER?.trim() ||
      process.env.DXP_GUEST_USER?.trim();
    const password =
      process.env.DXP_GUEST_BASIC_PASSWORD?.trim() ||
      process.env.DXP_GUEST_PASSWORD?.trim();
    if (user && password) return { user, password };
    return undefined;
  }
  const user =
    process.env.DXP_AGENT_BASIC_USER?.trim() || process.env.EIS_USERNAME?.trim();
  const password =
    process.env.DXP_AGENT_BASIC_PASSWORD?.trim() || process.env.EIS_PASSWORD?.trim();
  if (user && password) return { user, password };
  return undefined;
}

/** True when guest + agent credentials and API base URL are present (pilot / issuance). */
export function isDxpIssuanceConfigured(): boolean {
  return Boolean(
    getDxpBaseUrl() && getDxpBasicAuth('guest') && getDxpBasicAuth('agent')
  );
}
