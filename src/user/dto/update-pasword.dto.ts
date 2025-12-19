import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
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
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
