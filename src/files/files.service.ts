import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { RemovefileDto } from './dto';

@Injectable()
export class FilesService {
  private readonly folder: string;

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });

    this.folder = this.configService.get('CLOUDINARY_API_FOLDER') ?? '';
  }

  async uploadServiceImage(files: Array<Express.Multer.File>) {
    const uploadPromise = files.map(async (file) => {
      try {
        const buffer = await file.buffer;
        const base64Image = Buffer.from(buffer).toString('base64');

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`, {
            folder: this.folder,
          })
          .then((res) => res.url);
      } catch (error) {
        console.log(error);
        throw new BadRequestException(`Server error. checks the logs`);
      }
    });

    const uploadedPromise = await Promise.all(uploadPromise);

    return uploadedPromise;
  }

  async remove(removefileDto: RemovefileDto) {
    try {
      const { urlImage } = removefileDto;

      const imageName = urlImage.split('/').pop()?.split('.')[0];
      await cloudinary.uploader.destroy(`${this.folder}/${imageName}`);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal error. Checks the logs');
    }
  }
}
