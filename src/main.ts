import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Importa Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir conexiones desde el frontend
  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend (Vite usa el puerto 5173 por defecto)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Configuración global de validación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      transform: true,  // Transforma los datos recibidos al tipo del DTO
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Usuarios y Pagos') // Título de tu API
    .setDescription('Documentación de la API para la gestión de usuarios y métodos de pago') // Descripción
    .setVersion('1.0') // Versión de la API
    .addBearerAuth() // Añade soporte para JWT (si usas JwtAuthGuard)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' es la ruta donde se servirá la documentación (ej. http://localhost:3000/api)

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicación ejecutándose en: http://localhost:${port}/api`);
}
bootstrap();