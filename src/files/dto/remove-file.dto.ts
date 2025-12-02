import { IsString } from 'class-validator';

export class RemovefileDto {
  @IsString()
  id: string;

  @IsString()
  url: string;
}
