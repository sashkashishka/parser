import { iParseUnit } from "src/types";
import { stringifyErrorCode } from 'src/utils/errorCodes';

export interface iParseOptions {
  parseUnits: iParseUnit[];
  endTime: Date;
}

export interface iParseError {
  code: ReturnType<typeof stringifyErrorCode>; 
  name?: string;
  message: string;
}
