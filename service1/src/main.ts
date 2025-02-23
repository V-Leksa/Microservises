import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env.DATABASE_HOST);
  console.log(process.env.DATABASE_PORT);
  console.log(process.env.DATABASE_USER);
  console.log(process.env.DATABASE_PASSWORD);
  console.log(process.env.DATABASE_NAME);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
