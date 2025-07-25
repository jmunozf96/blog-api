import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { CustomError } from '../errors/custom.error';

export function multerErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            next(new CustomError('Image is too large. Max size is 2MB.'));
        }
    }
    if (err && err.message === 'Unsupported image format. Use JPEG, PNG or WEBP.') {
        next(new CustomError(err.message));
    }
    next(err);
}
