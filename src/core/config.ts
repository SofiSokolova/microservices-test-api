import 'dotenv/config';
import { Dialect } from 'sequelize';
import { SQLDialects } from './types';
import { DAY } from './constants';
import { getTokenMask } from './helper';

export interface AuthTokensInterface {
  expiresIn: number;
  secret: string;
  cacheMask: string;
  getCacheKey: (id: number) => string;
}

export class Config {
  port: number;
  redis: {
    host: string;
    port: number;
  };
  email: {
    service: string;
    host: string;
    auth: {
      user: string;
      pass: string;
    };
  };
  hash: {
    saltRound: number;
  };
  auth: {
    accessToken: AuthTokensInterface;
    refreshToken: AuthTokensInterface;
  };
  seed: {
    UserPassword: string;
  };
  unprotectedRoutes: string[];
  db: {
    host: string;
    dbName: string;
    password: string;
    user: string;
    port: number;
    dialect: Dialect;
  };
}

export const configInstance: Config = {
  port: parseInt(process.env.API_PORT || '3001', 10),
  email: {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT_EXT || '6379', 10),
  },
  seed: {
    UserPassword: process.env.USER_PASSWORD,
  },
  hash: {
    saltRound: parseInt(process.env.SALT_ROUNDS || '11', 10),
  },
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    dialect: SQLDialects.POSTGRES,
    dbName: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
  },
  auth: {
    accessToken: {
      expiresIn:
        parseInt(process.env.AUTH_ACCESS_TOKEN_LIVE_DAYS || '5', 10) * DAY,
      secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
      cacheMask: 'auth:access:token:user:id:',
      getCacheKey: (id: number): string =>
        getTokenMask(id, configInstance.auth.accessToken.cacheMask),
    },
    refreshToken: {
      expiresIn:
        parseInt(process.env.AUTH_REFRESH_TOKEN_LIVE_DAYS || '15', 10) * DAY,
      secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
      cacheMask: 'auth:refresh:token:user:id:',
      getCacheKey: (id: number): string =>
        getTokenMask(id, configInstance.auth.refreshToken.cacheMask),
    },
  },
  unprotectedRoutes: [
    '/auth/login',
    '/auth/signup',
    '/auth/refresh',
    '/auth/test',
  ],
};
