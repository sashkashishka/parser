import { WsResponse } from '@nestjs/websockets';
import { ParseUnitEvents } from '../constants';
import { iParseOptions } from '../types';

export class InitEventResDto implements WsResponse {
  event: ParseUnitEvents.init;
  data: iParseOptions;
}
