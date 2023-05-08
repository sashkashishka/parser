import { WsResponse } from '@nestjs/websockets';
import { stringifyErrorCode } from 'src/utils/errorCodes';
import { ParseUnitEvents } from '../constants';

export class ErrorEventResDto implements WsResponse {
  event: ParseUnitEvents.error;
  data: {
    code: ReturnType<typeof stringifyErrorCode>; 
    message: string;
  };
}
