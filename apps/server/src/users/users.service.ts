import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
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

  public async createUser(username: string, pass: string) {

  }
}
