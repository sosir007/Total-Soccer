import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

const port = Number(process.env.PORT ?? 9249);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`Total Soccer API is running at http://localhost:${port}`);
}

void bootstrap();
