import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Types } from 'mongoose'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Determina el puerto real de tu frontend.
  // Es común que el servidor de desarrollo de Next.js (frontend) se ejecute en 3000 o 3001.
  // Si tu frontend está en http://localhost:3001, el 'origin' debe ser 3001.
  const FRONTEND_ORIGIN = 'http://localhost:3001'; // <--- VERIFICA ESTO EN LA BARRA DE DIRECCIONES DE TU NAVEGADOR AL EJECUTAR EL FRONTEND

  app.enableCors({
    origin: FRONTEND_ORIGIN,
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
  const BACKEND_PORT = 3000; // <--- PUERTO DONDE TU BACKEND REALMENTE ESCUCHARÁ

  await app.listen(BACKEND_PORT, () => {
    console.log(`Aplicación ejecutándose en: http://localhost:${BACKEND_PORT}/api`);
    console.log(`Documentación de la API disponible en: http://localhost:${BACKEND_PORT}/api/docs`);
  });
}
bootstrap();