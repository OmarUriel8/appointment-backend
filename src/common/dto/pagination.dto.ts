import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  offset?: number;
}
