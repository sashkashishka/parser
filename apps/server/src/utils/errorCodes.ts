export enum ERROR_CODES {
  INVALID_TOKEN = 0,
};

export function stringifyErrorCode(code: ERROR_CODES) {
  return `N-${code}`;
}
