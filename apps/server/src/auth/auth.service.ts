import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInUserDto } from './dto/SignInUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  public async signIn({ username, password }: SignInUserDto) {
    const user = await this.usersService.findUser(username);

    if (!user || !this.usersService.isPasswordValid(user.hash, password)) {
      throw new UnauthorizedException('Username or password incorrect');
    }

    const payload = { username: user.name, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
