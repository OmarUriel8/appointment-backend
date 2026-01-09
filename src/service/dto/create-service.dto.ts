import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ToBoolean } from '../../common/decorators/to-boolean.decorator';

export class CreateServiceDto {
  @ApiProperty({
    required: true,
    type: String,
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  description: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    required: true,
    type: Number,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    required: true,
    type: Number,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  durationMinutes: number;

  @ApiProperty({
    required: true,
    isArray: true,
    items: {
      type: 'string',
      minLength: 1,
    },
  })
  @IsString({
    each: true,
  })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    required: false,
    nullable: true,
    isArray: true,
    items: {
      type: 'string',
      format: 'url',
    },
  })
  @IsString({
    each: true,
  })
  @IsArray()
  images?: string[];

  @ApiProperty({
    required: true,
    type: Boolean,
  })
  @ToBoolean()
  @IsBoolean()
  isActive: boolean;
}
