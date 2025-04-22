import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log(process.env.DATABASE_HOST);
  console.log(process.env.DATABASE_PORT);
  console.log(process.env.DATABASE_USER);
  console.log(process.env.DATABASE_PASSWORD);
  console.log(process.env.DATABASE_NAME);
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Users API')
  .setDescription('API for managin users')
  .setVersion('1.0')
  .addTag('Users')
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
