import type { IncomingHttpHeaders } from 'http';

export function getAuthToken(headers: IncomingHttpHeaders) {
  const [type, token] = headers.authorization?.split(' ') ?? [];

  if (!type) {
    const [, v] =
      headers.cookie
        ?.split?.('; ')
        ?.map?.((c) => c.split('='))
        ?.find?.(([name]) => name === 'token') || [];

    return v;
  }

  return type === 'Token' ? token : undefined;
}
