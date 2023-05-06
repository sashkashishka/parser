import type { IncomingHttpHeaders } from 'http';

export function getAuthToken(headers: IncomingHttpHeaders) {
  const [type, token] = headers.authorization?.split(' ') ?? [];

  return type === 'Token' ? token : undefined;
}
