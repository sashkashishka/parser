import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ParseUnitService } from './parse-unit.service';

@Controller('parse-unit')
@UseGuards(AuthGuard)
export class ParseUnitController {
  constructor(private parseUnitService: ParseUnitService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getParseUnits() {}

  @Post('add')
  @HttpCode(HttpStatus.OK)
  addParseUnit() {}

  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  removeParseUnit() {}
}
