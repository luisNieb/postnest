import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageProvider } from './upload-image';

@Module({
  providers: [UploadImageService, UploadImageProvider],
  exports:[UploadImageService, UploadImageProvider]//importamos service y provider
})
export class UploadImageModule {}
