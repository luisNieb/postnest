import { Injectable } from '@nestjs/common';

import {v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './upload-image.response';

const streamifier = require('streamifier')


@Injectable()
export class UploadImageService {

    uploadfile( file:Express.Multer.File ):Promise<CloudinaryResponse>{

        cloudinary.image(file.filename, {transformation: [
        {width: 1000, crop: "scale"},
        {quality: "auto"},
        {fetch_format: "auto"}
        ]})

        return new Promise<CloudinaryResponse>((resolve ,reject)=>{
            const uploadStream= cloudinary.uploader.upload_stream(
                (error,result) =>{
                    if(error)return reject(error)
                    resolve(result!)
                }
            )
            streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
    }
}
