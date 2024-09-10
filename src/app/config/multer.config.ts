import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';

// Helper function to remove the file extension from the filename
const removeExtension = (filename: string) => {
  return filename.split('.').slice(0, -1).join('.');
};

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload, // Cloudinary instance from the configuration
  params: {
    // Define the public ID format for the uploaded file
    public_id: (_req, file) =>
      Math.random().toString(36).substring(2) + // Generate a random string
      '-' +
      Date.now() + // Append the current timestamp
      '-' +
      file.fieldname + // Append the field name
      '-' +
      removeExtension(file.originalname), // Remove file extension and append the original name
  },
});

// Export the configured multer upload function
export const multerUpload = multer({ storage: storage });
