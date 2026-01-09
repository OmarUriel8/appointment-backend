import {
  Controller,
  Post,
  Logger,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Delete,
  Body,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { RemovefileDto } from './dto';
import { Auth } from '@/auth/decorators';
import { UserRole } from '@/user/enums/user-role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private readonly filesService: FilesService) {}

  @Post('service')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: fileFilter,
      limits: { fileSize: 3_000_000 },
    }),
  )
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  async uploadServiceImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (files.length === 0) {
      throw new BadRequestException('Make sure that the file is a image');
    }
    const urlFiles = await this.filesService.uploadServiceImage(files);

    return urlFiles;
  }

  @Delete('service')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  remove(@Body() removefileDto: RemovefileDto) {
    return this.filesService.remove(removefileDto);
  }
}
