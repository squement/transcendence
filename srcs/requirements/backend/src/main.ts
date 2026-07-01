import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { static as serveStatic } from 'express';
import { join } from 'path';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use('/uploads', serveStatic(join(process.cwd(), 'uploads')));

  app.enableCors({
	origin: "http://localhost:5173",
	credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
