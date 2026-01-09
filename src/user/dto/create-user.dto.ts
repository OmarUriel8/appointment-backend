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
import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    type: String,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    format: 'email',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    format: 'phone',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 50,
    type: String,
    example: 'Password123',
    description: `
    The password must meet the following requirements:
    - Minimum 6 characters
    - Maximum 50 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number or special character
    `,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'the password must have a Upercase, Lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Boolean,
  })
  @ToBoolean()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
