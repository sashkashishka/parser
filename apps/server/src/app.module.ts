import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { envVariables } from './constants';
import { UsersModule } from './users/users.module';
import { ParseUnitModule } from './parse-unit/parse-unit.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: envVariables.getVariable('JWT_SECRET'),
      signOptions: {
        expiresIn: '1h',
      },
    }),
    ParseUnitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
