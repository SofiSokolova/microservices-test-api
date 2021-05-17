import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { HashService } from '../services/hash/hash.service';
import { CoreModule } from '../core/core.module';
import { EmailService } from '../services/email/email.service';

@Module({
  imports: [CoreModule, SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService, HashService, EmailService],
  exports: [UserService],
})
export class UserModule {}
