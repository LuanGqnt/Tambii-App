
-- Create a reviews table. Each user can leave 1 review per spot.
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  spot_id UUID NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, spot_id)
);

-- Add RLS policies for proper access.
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own reviews
CREATE POLICY "Users can view their reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own reviews
CREATE POLICY "Users can create a review" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Users can update their review" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete their review" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Optionally, add average_rating and review_count to spots for display/performance
ALTER TABLE public.spots ADD COLUMN average_rating NUMERIC(2,1) DEFAULT 0;
ALTER TABLE public.spots ADD COLUMN review_count INT DEFAULT 0;

-- NOTE: You will want application logic to keep these aggregates updated when new reviews are added/updated/deleted.

