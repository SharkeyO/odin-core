import { NestFactory } from '@nestjs/core';
import { AdminModule } from './_core/admin/admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
  await app.listen(3000);
}
bootstrap();
