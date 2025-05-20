import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Smart Financial Tracking Application')
  .setDescription('API description')
  .setVersion('1.0')
  .build();
