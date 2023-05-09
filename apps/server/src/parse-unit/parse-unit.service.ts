import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { iParseUnit } from 'src/types';

@Injectable()
export class ParseUnitService {
  constructor(private prisma: PrismaService) {}

  getParseUnits(userId: number) {
    return this.prisma.parseUnit.findMany({
      where: {
        userId,
      },
    });
  }

  getParseUnitById(id: number) {
    return this.prisma.parseUnit.findMany({
      where: {
        id,
      },
    });
  }

  addParseUnit(userId: number, parseUnit: Omit<iParseUnit, 'id'>) {
    return this.prisma.parseUnit.create({
      data: {
        ...parseUnit,
        userId,
      },
    });
  }

  updateParseUnit(parseUnit: iParseUnit) {
    return this.prisma.parseUnit.update({
      data: parseUnit,
      where: {
        id: parseUnit.id,
      },
    });
  }

  removeParseUnit(id: number) {
    return this.prisma.parseUnit.delete({
      where: {
        id,
      },
    });
  }
}
