import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { IsDev } from './guards/isDev.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private authService: UsersService) { }

  @HttpCode(HttpStatus.OK)
  @Post('create')
  @UseGuards(IsDev)
  async createUser(@Body() signInDto: CreateUserDto) {
    return this.authService.createUser(signInDto);
  }
}
