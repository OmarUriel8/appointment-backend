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
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';

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

  @ToBoolean()
  @IsBoolean()
  isActive: boolean;
}
