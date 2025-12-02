import { IsString, IsUrl, IsUUID } from 'class-validator';

export class RemovefileDto {
  @IsString()
  @IsUUID()
  idImage: string;

  @IsString()
  @IsUrl()
  urlImage: string;
}
