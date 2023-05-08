import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { iParseUnit } from 'src/types';

@Injectable()
export class ParseUnitService {
  constructor(private prisma: PrismaService) {}

  getParseUnits() {}

  getParseUnitsById(ids: number[]) {
    // return this.prisma
  }

  addParseUnit() {}

  removeParseUnit() {}
}
