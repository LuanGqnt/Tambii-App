
-- Add multiple images column to spots table (replace single image)
ALTER TABLE public.spots ADD COLUMN images TEXT[] DEFAULT '{}';

-- Copy existing single image to images array and then remove old column
UPDATE public.spots SET images = ARRAY[image] WHERE image IS NOT NULL AND image != '';
ALTER TABLE public.spots DROP COLUMN image;

-- Add media attachments column to reviews table for images and videos
ALTER TABLE public.reviews ADD COLUMN media_attachments JSONB DEFAULT '[]';

-- Add a comment to clarify the media_attachments structure
COMMENT ON COLUMN public.reviews.media_attachments IS 'Array of media objects with structure: [{"url": "...", "type": "image|video"}]';
