
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import heic2any from 'heic2any';

const MAX_FILE_SIZE = 5; //MB

export const useImageUpload = () => {
  const { user } = useAuth();

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        console.log('Converting HEIC file to JPEG:', file.name);
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        }) as Blob;
        
        // Create a new file with JPEG extension
        const newFileName = file.name.replace(/\.heic$/i, '.jpeg');
        return new File([convertedBlob], newFileName, { type: 'image/jpeg' });
      } catch (error) {
        console.error('Error converting HEIC file:', error);
        throw new Error('Failed to convert HEIC image. Please try a different format.');
      }
    }
    return file;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      // Convert HEIC to JPEG if needed
      const processedFile = await convertHeicToJpeg(file);
      
      const fileName = `${user.id}/${Date.now()}_${processedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, processedFile);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    // Convert HEIC files first
    const processedFiles = await Promise.all(
      files.map(file => convertHeicToJpeg(file))
    );

    const oversized = processedFiles.filter(file => file.size > MAX_FILE_SIZE * 1024 * 1024);
    if (oversized.length > 0) {
      const fileNames = oversized.map(file => `"${file.name}"`).join(', ');
      throw new Error(`The following file(s) exceed the 5MB limit: ${fileNames}`);
    }

    const uploadPromises = processedFiles.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  return {
    uploadImage,
    uploadMultipleImages,
    convertHeicToJpeg
  };
};
