import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly users = [
    {
      id: 1,
      username: 'Jon',
      password: 'snow',
    }
  ];


  public async findUser(username: string) {
    return this.users.find(v => v.username === username);
  }

  public async createUser({ username, password }: CreateUserDto) {
    console.log({ username, password })
    // return this.prisma.user.create({
    //   data: {
    //     name: username,
    //     password,
    //   },
    // });
    //
    return { username, password, time: new Date() };
  }
}
