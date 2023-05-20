import * as path from 'path';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
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
    ServeStaticModule.forRoot({
      rootPath:
        envVariables.getVariable('NODE_ENV') === 'development'
          ? path.join(__dirname, '../static')
          : path.join(__dirname, 'static'),
    }),
    ParseUnitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
