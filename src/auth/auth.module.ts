import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guards';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
