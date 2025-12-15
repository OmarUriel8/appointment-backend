import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
