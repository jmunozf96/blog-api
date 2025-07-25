import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const CloudinaryService = {
  async uploadImage(filePath: string) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'publications',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  },
  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
};