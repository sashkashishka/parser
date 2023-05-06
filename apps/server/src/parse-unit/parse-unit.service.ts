import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { iParseUnit } from 'src/types';

@Injectable()
export class ParseUnitService {
  public parseUnits: Record<number, iParseUnit>;

  constructor(private prisma: PrismaService) {}

  getAllParseUnits() {
    // return this.prisma
  }

  setEndTime(endTime: Date | null) {

  }


}
