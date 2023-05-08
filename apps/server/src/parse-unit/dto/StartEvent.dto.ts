import { iParseUnit } from 'src/types';
import { CommonDto } from './Common.dto';

export class StartEventReqDto extends CommonDto {
  payload: {
    parseUnits: iParseUnit[];
    endTime: Date;
  };
}
