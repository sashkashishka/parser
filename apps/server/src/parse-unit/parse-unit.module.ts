import { Module } from '@nestjs/common';
import { ParseUnitGateway } from './parse-unit.gateway';
import { ParseUnitService } from './parse-unit.service';

@Module({
  exports: [ParseUnitService],
  providers: [ParseUnitGateway, ParseUnitService],
})
export class ParseUnitModule {}
