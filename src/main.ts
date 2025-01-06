import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('V-Market examples')
    .setDescription('V-Market API description')
    .setVersion('1.0')
    .addBasicAuth(
      {
        name: 'Authorization',
        bearerFormat: 'Basic', // I`ve tested not to use this field, but the result was the same
        scheme: 'Basic',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
      },
      'basicauth',
    )
    .addBearerAuth(
      {
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Headers',
      },
      'authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3080);
}
bootstrap();
