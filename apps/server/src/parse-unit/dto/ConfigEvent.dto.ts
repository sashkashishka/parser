import { WsResponse } from '@nestjs/websockets';
import { iParseUnit } from 'src/types';
import { ParseUnitEvents } from '../constants';
import { iParseOptions } from '../types';
import { CommonDto } from './Common.dto';

export class ConfigEventReqDto extends CommonDto {
  payload: {
    parseUnits: iParseUnit[];
    endTime: Date;
  };
}

export class ConfigEventResDto implements WsResponse {
  event: ParseUnitEvents.config;
  data: iParseOptions;
}
