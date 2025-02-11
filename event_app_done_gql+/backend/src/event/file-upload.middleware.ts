import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { resolve, posix } from 'path';
import * as fs from 'fs';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = resolve(__dirname, '..', '..','assets');
    console.log(uploadPath);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueName = `${file.originalname}`;
    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('Multer fileFilter - File:', file);
    cb(null, true);
  }
}).single('image');

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  use(req: MulterRequest, res: Response, next: NextFunction) {
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).send({ error: 'File upload failed' });
      }

      if (req.file) {
        req.body.image = posix.join('/assets', req.file.filename);
      }

      next();
    });
  }
}
