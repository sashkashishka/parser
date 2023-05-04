import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      abortOnError: process.env.NODE_ENV !== 'development',
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8000, '0.0.0.0');
}
bootstrap();
