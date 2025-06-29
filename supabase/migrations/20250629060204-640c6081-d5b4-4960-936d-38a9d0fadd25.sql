
-- Create subscription tracking table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  xendit_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, cancelled, expired
  plan_name TEXT NOT NULL DEFAULT 'premium',
  amount DECIMAL(10,2) NOT NULL DEFAULT 69.99,
  currency TEXT NOT NULL DEFAULT 'PHP',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  next_billing_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create payment history table
CREATE TABLE public.payment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  xendit_invoice_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PHP',
  status TEXT NOT NULL, -- pending, paid, failed, expired
  payment_method TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subscription tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for payment history
CREATE POLICY "Users can view their payment history" 
  ON public.payment_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Function to update user tier based on subscription status
CREATE OR REPLACE FUNCTION public.update_user_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile tier based on subscription status
  IF NEW.status = 'active' THEN
    UPDATE public.profiles 
    SET tier = 'premium' 
    WHERE id = NEW.user_id;
  ELSE
    UPDATE public.profiles 
    SET tier = 'free' 
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update user tier when subscription status changes
CREATE TRIGGER on_subscription_status_change
  AFTER INSERT OR UPDATE OF status ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_user_tier();
