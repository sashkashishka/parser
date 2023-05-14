import { stringifyErrorCode } from 'src/utils/errorCodes';

export interface iParseOptions {
  endTime: Date;
}

export interface iSocketError {
  code: ReturnType<typeof stringifyErrorCode>; 
  name?: string;
  message: string;
}
