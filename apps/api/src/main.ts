import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

const port = Number(process.env.PORT ?? 9249);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:9248'],
    credentials: true
  });
  await app.listen(port, '127.0.0.1');
  console.log(`Total Soccer API is running at http://127.0.0.1:${port}`);
}

void bootstrap();
