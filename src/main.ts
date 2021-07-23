import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppClusterService } from './app_cluster.service';
import { AppModule } from './app.module';
import MyLogger from './logger';


async function bootstrap() {
  // const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(['log', 'error', 'warn', 'debug', 'verbose']),
  });

  // const app = await NestFactory.create(AppModule);

  const port = process.env.PORT;
  await app.listen(port);
  // logger.log(`Application is running on port ${port}`)
}
// bootstrap();

AppClusterService.clusterize(bootstrap);

