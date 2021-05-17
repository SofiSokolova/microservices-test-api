import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class UserCreateDto extends ProfileDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 16,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
