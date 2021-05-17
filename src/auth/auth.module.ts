import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheService } from '../services/cache/cache.service';
import { CoreModule } from '../core/core.module';
import { UserModule } from '../user/user.module';
import { HashService } from '../services/hash/hash.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [CoreModule, UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, CacheService, HashService],
  exports: [AuthService],
})
export class AuthModule {}
