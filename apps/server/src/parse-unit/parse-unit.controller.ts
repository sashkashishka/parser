import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Param,
  Body,
  Patch,
  Request,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthGuard } from 'src/guards/auth.guard';
import { ParseUnitDto } from './dto/ParseUnit.dto';
import { ParseUnitService } from './parse-unit.service';

@Controller('parse-unit')
@UseGuards(AuthGuard)
export class ParseUnitController {
  constructor(private parseUnitService: ParseUnitService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getParseUnits(@Request() req: FastifyRequest) {
    const user = req.user;

    return this.parseUnitService.getParseUnits(user.id);
  }

  @Post('add')
  @HttpCode(HttpStatus.OK)
  addParseUnit(
    @Request() req: FastifyRequest,
    @Body() parseUnit: ParseUnitDto,
  ) {
    const user = req.user;
    return this.parseUnitService.addParseUnit((user.id), parseUnit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getParseUnit(@Param('id') id: string) {
    return this.parseUnitService.getParseUnitById(Number(id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateParseUnit(@Param('id') id: string, @Body() parseUnit: ParseUnitDto) {
    return this.parseUnitService.updateParseUnit({
      ...parseUnit,
      id: Number(id),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  removeParseUnit(@Param('id') id: string) {
    return this.parseUnitService.removeParseUnit(Number(id));
  }
}
