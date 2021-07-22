import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppClusterService } from './app-cluster.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`)
}
// bootstrap();

AppClusterService.clusterize(bootstrap);

