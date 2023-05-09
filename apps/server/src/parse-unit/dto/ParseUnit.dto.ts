import { IsInt, IsString, IsUrl } from 'class-validator';
import { iParseUnit } from 'src/types';

export class ParseUnitDto implements iParseUnit {
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsUrl()
  siteUrl: string;

  @IsInt()
  frequency: number;
}
