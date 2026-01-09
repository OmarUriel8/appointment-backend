import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto, PaginationServDto } from './dto';

import { Auth } from '@/auth/decorators';
import { UserRole } from '@/user/enums/user-role.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('access-token')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  findAll(@Query() paginationServDto: PaginationServDto) {
    return this.serviceService.findAll(paginationServDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.serviceService.findOne(term);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.remove(id);
  }
}
