import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoreModule } from './core/core.module';
import { configInstance } from './core/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { AuthGuard } from './core/guards/auth.guard';
import { EmailService } from './services/email/email.service';
import { CustomExceptionFilter } from './core/filters/exception.filter';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UserModule,
    SequelizeModule.forRoot({
      dialect: configInstance.db.dialect,
      host: configInstance.db.host,
      port: configInstance.db.port,
      username: configInstance.db.user,
      password: configInstance.db.password,
      database: configInstance.db.dbName,
      autoLoadModels: true,
      logging: false,
    }),
    TokenModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    EmailService,
  ],
})
export class AppModule {}
