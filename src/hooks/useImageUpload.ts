import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MAX_FILE_SIZE = 5; //MB

export const useImageUpload = () => {
  const { user } = useAuth();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileName = `${user.id}/${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

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
    const oversized = files.filter(file => file.size > MAX_FILE_SIZE * 1024 * 1024);
    if (oversized.length > 0) {
      const fileNames = oversized.map(file => `"${file.name}"`).join(', ');
      throw new Error(`The following file(s) exceed the 5MB limit: ${fileNames}`);
    }

    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  return {
    uploadImage,
    uploadMultipleImages
  };
};
