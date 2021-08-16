import { Module } from '@nestjs/common';
import { FinderService } from './finder.service';
import { FinderController } from './finder.controller';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FolderEntity } from './folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, FolderEntity])],
  providers: [
    FinderService,
    AuthGuard],
  controllers: [FinderController],
  exports: [FinderService]
})
export class FinderModule { }
