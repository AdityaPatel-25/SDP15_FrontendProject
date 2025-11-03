-- Create homestays table
CREATE TABLE public.homestays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price_per_night NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  host_name TEXT NOT NULL,
  host_id UUID REFERENCES public.profiles(id),
  max_guests INTEGER NOT NULL DEFAULT 1,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.homestays ENABLE ROW LEVEL SECURITY;

-- Public can view all homestays
CREATE POLICY "Anyone can view homestays" 
ON public.homestays 
FOR SELECT 
USING (true);

-- Hosts can create their own homestays
CREATE POLICY "Hosts can create their own homestays" 
ON public.homestays 
FOR INSERT 
WITH CHECK (auth.uid() = host_id);

-- Hosts can update their own homestays
CREATE POLICY "Hosts can update their own homestays" 
ON public.homestays 
FOR UPDATE 
USING (auth.uid() = host_id);

-- Hosts can delete their own homestays
CREATE POLICY "Hosts can delete their own homestays" 
ON public.homestays 
FOR DELETE 
USING (auth.uid() = host_id);

-- Create index for better search performance on location
CREATE INDEX idx_homestays_location ON public.homestays USING gin(to_tsvector('english', location));
CREATE INDEX idx_homestays_title ON public.homestays USING gin(to_tsvector('english', title));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_homestays_updated_at
BEFORE UPDATE ON public.homestays
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();