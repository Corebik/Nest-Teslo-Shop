import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application running on port ${process.env.PORT}`);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
