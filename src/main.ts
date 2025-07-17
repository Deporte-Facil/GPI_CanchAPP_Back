import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Types } from 'mongoose'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración temporal para permitir cualquier origen durante desarrollo
  app.enableCors({
    origin: true, // Permite cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('API de Recintos Deportivos')
    .setDescription('Documentación de la API para la gestión de recintos y reservas.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Define el puerto donde el BACKEND escuchará.
  // Debe ser el puerto al que tu frontend (en apiClient.baseURL) intenta conectar.
  // Tu frontend está configurado para llamar a http://localhost:3000/api,
  // así que el backend debe escuchar en el puerto 3000.
  const BACKEND_PORT = 4000; // <--- PUERTO DONDE TU BACKEND REALMENTE ESCUCHARÁ

  await app.listen(BACKEND_PORT, () => {
    console.log(`Aplicación ejecutándose en: http://localhost:${BACKEND_PORT}/api`);
    console.log(`Documentación de la API disponible en: http://localhost:${BACKEND_PORT}/api/docs`);
  });
}
bootstrap();