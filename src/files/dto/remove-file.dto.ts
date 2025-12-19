import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class RemovefileDto {
  // @IsString()
  // @IsUUID()
  // idImage: string;

  @ApiProperty({
    required: true,
    type: String,
    format: 'url',
  })
  @IsString()
  @IsUrl()
  urlImage: string;
}
