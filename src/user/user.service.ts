import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { UserRolesEnum, UserScopesEnum } from './types';
import { HashService } from '../services/hash/hash.service';
import { UserCreateDto } from './dto/user-create.dto';
import { EmailService } from '../services/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    private hashService: HashService,
    private emailService: EmailService,
  ) {}

  async findById(id: number, scope?: string): Promise<Partial<UserModel>> {
    return this.userModel.scope(scope || UserScopesEnum.DEFAULT).findByPk(id);
  }

  async changePassword(userId: number, password: string): Promise<void> {
    const user = await this.userModel.findByPk(userId);

    const { role, email } = user;

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (role === UserRolesEnum.ADMIN) {
      throw new BadRequestException(`You can not change other admin password`);
    }

    user.password = await this.hashService.generateHash(password);

    await this.emailService.sendInfoPasswordChanged(email, password);

    await user.save();
  }

  async findByEmail(
    email: string,
    scope?: string,
  ): Promise<Partial<UserModel>> {
    return this.userModel.scope(scope || UserScopesEnum.DEFAULT).findOne({
      where: {
        email,
      },
    });
  }

  async createUser(
    user: UserCreateDto,
    sendEmail = true,
  ): Promise<Partial<UserModel>> {
    const hashedPassword = await this.hashService.generateHash(user.password);

    const {
      id,
      role,
      email,
      firstName,
      lastName,
      updatedAt,
      createdAt,
      deletedAt,
    } = await this.userModel.create({
      ...user,
      password: hashedPassword,
    });

    if (sendEmail) {
      await this.emailService.sendInfoUserCreated(email);
    }

    return {
      id,
      role,
      email,
      firstName,
      lastName,
      updatedAt,
      createdAt,
      deletedAt,
    };
  }
}
