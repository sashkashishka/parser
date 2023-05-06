import { WsResponse } from '@nestjs/websockets';
import { ParseUnitEvents } from '../constants';
import { CommonDto } from './Common.dto';

export class InitEventReqDto extends CommonDto {
  payload: unknown;
}

export class InitEventResDto implements WsResponse {
  event: ParseUnitEvents.init;
  data: unknown;
}
