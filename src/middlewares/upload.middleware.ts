import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB limit
    },
    fileFilter: (_, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Unsupported image format. Use JPEG, PNG or WEBP.');
            return cb(error);
        }
        cb(null, true);
    }
});