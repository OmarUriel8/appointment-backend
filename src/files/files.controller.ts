import {
  Controller,
  Post,
  Logger,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { RemovefileDto } from './dto/remove-file.dto';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/user/enums/user-role.enum';

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
  async uploadServiceImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (files.length === 0) {
      throw new BadRequestException('Make sure that the file is a image');
    }
    const urlFiles = await this.filesService.uploadServiceImage(files);

    return urlFiles;
  }

  @Delete('service/:url')
  @Auth(UserRole.ADMIN)
  remove(@Body() removeFileDto: RemovefileDto) {
    return this.filesService.remove(removeFileDto);
  }
}
