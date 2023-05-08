import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParseGateway } from './parse.gateway';
import { ParseUnitService } from './parse-unit.service';
import { ParseService } from './parse.service';
import { ParseUnitController } from './parse-unit.controller';

@Module({
  exports: [ParseUnitService],
  imports: [PrismaModule],
  providers: [ParseGateway, ParseUnitService, ParseService],
  controllers: [ParseUnitController],
})
export class ParseUnitModule {}
