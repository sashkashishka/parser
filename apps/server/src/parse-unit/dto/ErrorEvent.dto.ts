import { WsResponse } from '@nestjs/websockets';
import { ParseUnitEvents } from '../constants';
import { iSocketError } from '../types';

export class ErrorEventResDto implements WsResponse {
  event: ParseUnitEvents.error;
  data: iSocketError;
}
