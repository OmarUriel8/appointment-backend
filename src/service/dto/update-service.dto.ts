import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
