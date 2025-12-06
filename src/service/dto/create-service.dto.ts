import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  description: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  durationMinutes: number;

  @IsString({
    each: true,
  })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString({
    each: true,
  })
  @IsArray()
  images?: string[];
}
