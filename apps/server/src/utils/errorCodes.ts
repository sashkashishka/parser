export enum ERROR_CODES {
  INVALID_TOKEN = 0,
  MAX_CONSECUTIVE_ERROR = 1,
  PARSE_FETCH_ERROR = 2,
  EMPTY_PARSE_UNIT_LIST = 3,

  // get ad list query params
  NO_AD_LIST_QUERY_PARAMS = 4,
  FAILED_GET_AD_LIST_QUERY_PARAMS_REQ = 5,

  // get ad list
  NO_AD_LIST = 6,
  FAILED_GET_AD_LIST_REQ = 7,
};

export function stringifyErrorCode(code: ERROR_CODES) {
  return `N-${code}` as const;
}
