import { WsResponse } from '@nestjs/websockets';
import { ParseUnitEvents } from '../constants';
import { iParseOptions } from '../types';

export class StopEventResDto implements WsResponse {
  event: ParseUnitEvents.stop;
  data: iParseOptions;
}
