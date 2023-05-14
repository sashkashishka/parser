export enum ERROR_CODES {
  INVALID_TOKEN = 0,
  MAX_CONSECUTIVE_ERROR = 1,
  PARSE_FETCH_ERROR = 2,
  EMPTY_PARSE_UNIT_LIST = 3,
};

export function stringifyErrorCode(code: ERROR_CODES) {
  return `N-${code}` as const;
}
