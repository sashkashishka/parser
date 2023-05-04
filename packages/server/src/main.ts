import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: process.env.NODE_ENV !== 'development',
  });
  await app.listen(3000);
}
bootstrap();
