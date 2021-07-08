import { Module } from '@nestjs/common';
import { FinderService } from './finder.service';
import { FinderController } from './finder.controller';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@Module({
  providers: [FinderService, AuthGuard],
  controllers: [FinderController],
  exports: [FinderService]
})
export class FinderModule { }
