import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'the password must have a Upercase, Lowercase letter and a number',
  })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ToBoolean()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
