import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class PaginationServDto extends PaginationDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
  })
  @IsString()
  @IsOptional()
  serviceName?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Boolean,
  })
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
