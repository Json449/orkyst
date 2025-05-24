import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import axios from 'axios';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  /**
   * Uploads an image from a URL to Cloudinary
   * @param imageUrl The temporary URL of the image (e.g., from DALL-E)
   * @param folder (Optional) The folder to store the image in Cloudinary
   * @param publicId (Optional) A custom public ID for the image
   * @returns The secure URL of the uploaded image
   */
  async uploadImageFromUrl(
    imageUrl: string, // This expects a URL string, not a Buffer
    folder?: string,
    publicId?: string,
  ): Promise<string> {
    try {
      // Download the image as a stream
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      // Convert to a buffer
      const buffer = Buffer.from(response.data, 'binary');

      // Upload to Cloudinary using a Promise wrapper
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder || 'dalle-images',
            public_id: publicId || `dalle-${Date.now()}`,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        // Create a readable stream from the buffer
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null); // Signals end of stream
        readableStream.pipe(uploadStream);
      });

      return (result as any).secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Deletes an image from Cloudinary
   * @param publicId The public ID of the image (or full URL)
   * @returns Deletion result
   */
  async deleteImage(publicId: any): Promise<any> {
    try {
      // Extract public ID from URL if a full URL is provided
      const actualPublicId = publicId.includes('http')
        ? publicId.split('/').pop().split('.')[0]
        : publicId;

      return await cloudinary.uploader.destroy(actualPublicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }

  /**
   * Gets image details from Cloudinary
   * @param publicId The public ID of the image (or full URL)
   * @returns Image details
   */
  async getImageInfo(publicId: any): Promise<any> {
    try {
      // Extract public ID from URL if a full URL is provided
      const actualPublicId = publicId.includes('http')
        ? publicId.split('/').pop().split('.')[0]
        : publicId;

      return await cloudinary.api.resource(actualPublicId);
    } catch (error) {
      console.error('Cloudinary get info error:', error);
      throw new Error('Failed to get image info from Cloudinary');
    }
  }
}
