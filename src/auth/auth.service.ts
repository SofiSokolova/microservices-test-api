import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { CacheService } from '../services/cache/cache.service';
import { Config } from '../core/config';
import { HashService } from '../services/hash/hash.service';
import { TokenPair, TokenPayload } from './types';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { UserScopesEnum } from '../user/types';
import { UserCreateDto } from '../user/dto/user-create.dto';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private cacheService: CacheService,
    private config: Config,
    private hashService: HashService,
    private userService: UserService,
  ) {}

  async isAuthenticated(token: string): Promise<TokenPayload> {
    return this.tokenService.verifyAccessToken(token);
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const { id } = await this.tokenService.verifyRefreshToken(refreshToken);

    const { email, role } = await this.userService.findById(
      id,
      UserScopesEnum.LOGIN,
    );

    return this.tokenService.signTokenPair({ id, email, role });
  }

  async login({ email, password }: LoginDto): Promise<TokenPair> {
    const user = await this.userService.findByEmail(
      email,
      UserScopesEnum.LOGIN,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { id, password: dbPassword, role } = user;

    const passwordsMatch = await this.hashService.compareHashes(
      password,
      dbPassword,
    );

    if (!passwordsMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    return this.tokenService.signTokenPair({
      id,
      email,
      role,
    });
  }

  async signup(user: UserCreateDto): Promise<TokenPair> {
    const { id, role, email } = await this.userService.createUser(user);

    return this.tokenService.signTokenPair({
      id,
      email,
      role,
    });
  }
}
