import { pbkdf2Sync } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async findUser(username: string) {
    return this.prisma.user.findUnique({
      where: {
        name: username,
      } 
    });
  }

  public async createUser({ username, password }: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: username,
        hash: this.encryptPassword(password),
      },
    });
  }

  private encryptPassword(password: string) {
    return pbkdf2Sync(password, this.salt, 5, 40, 'sha256').toString('hex');
  }

  public isPasswordValid(hash: string, password: string) {
    return hash === this.encryptPassword(password); 
  }

  private get salt() {
    if (!process.env.HASH_SALT) {
      throw new Error('Provide HASH_SALT env variable!');
    }

    return process.env.HASH_SALT;
  }
}
