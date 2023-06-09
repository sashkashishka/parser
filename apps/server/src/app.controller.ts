import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  pong() {
    return {
      pong: new Date(),
    };
  }

  @Get('auth-ping')
  @UseGuards(AuthGuard)
  authPong() {
    return {
      pong: new Date(),
      auth: true,
    };
  }

  @Get('healthcheck')
  healthcheck() {
    return { health: 'good' };
  }
}
