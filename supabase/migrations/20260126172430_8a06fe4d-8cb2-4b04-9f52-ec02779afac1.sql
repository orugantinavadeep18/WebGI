-- Create property types enum
CREATE TYPE public.property_type AS ENUM ('hostel', 'pg', 'rental_room', 'flat');

-- Create gender preference enum
CREATE TYPE public.gender_preference AS ENUM ('male', 'female', 'any');

-- Create verification status enum
CREATE TYPE public.verification_status AS ENUM ('unverified', 'pending', 'verified');

-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'owner', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Create properties table
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    property_type property_type NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    pincode TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    price_per_month INTEGER NOT NULL,
    security_deposit INTEGER DEFAULT 0,
    gender_preference gender_preference DEFAULT 'any',
    amenities TEXT[] DEFAULT '{}',
    rules TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    total_beds INTEGER DEFAULT 1,
    available_beds INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create property_verifications table (Trust System)
CREATE TABLE public.property_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    document_verified BOOLEAN DEFAULT false,
    document_verified_at TIMESTAMP WITH TIME ZONE,
    owner_verified BOOLEAN DEFAULT false,
    owner_verified_at TIMESTAMP WITH TIME ZONE,
    property_inspected BOOLEAN DEFAULT false,
    property_inspected_at TIMESTAMP WITH TIME ZONE,
    safety_certified BOOLEAN DEFAULT false,
    safety_certified_at TIMESTAMP WITH TIME ZONE,
    trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
    verification_notes TEXT,
    last_verified_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(property_id)
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    total_amount INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create saved_properties table (wishlist)
CREATE TABLE public.saved_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, property_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Create has_role function for secure role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
    ON public.properties FOR SELECT
    USING (is_active = true);

CREATE POLICY "Owners can view their own properties"
    ON public.properties FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own properties"
    ON public.properties FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own properties"
    ON public.properties FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own properties"
    ON public.properties FOR DELETE
    USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all properties"
    ON public.properties FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Property verifications policies
CREATE POLICY "Verifications are viewable by everyone"
    ON public.property_verifications FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage verifications"
    ON public.property_verifications FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Property owners can view bookings for their properties"
    ON public.bookings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.properties 
        WHERE properties.id = bookings.property_id 
        AND properties.owner_id = auth.uid()
    ));

CREATE POLICY "Users can create their own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- Saved properties policies
CREATE POLICY "Users can view their saved properties"
    ON public.saved_properties FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save properties"
    ON public.saved_properties FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave properties"
    ON public.saved_properties FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to calculate trust score
CREATE OR REPLACE FUNCTION public.calculate_trust_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.trust_score := 0;
    
    IF NEW.document_verified THEN
        NEW.trust_score := NEW.trust_score + 25;
    END IF;
    
    IF NEW.owner_verified THEN
        NEW.trust_score := NEW.trust_score + 25;
    END IF;
    
    IF NEW.property_inspected THEN
        NEW.trust_score := NEW.trust_score + 30;
    END IF;
    
    IF NEW.safety_certified THEN
        NEW.trust_score := NEW.trust_score + 20;
    END IF;
    
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for trust score calculation
CREATE TRIGGER calculate_trust_score_trigger
    BEFORE INSERT OR UPDATE ON public.property_verifications
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_trust_score();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_price ON public.properties(price_per_month);
CREATE INDEX idx_properties_active ON public.properties(is_active);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_property ON public.bookings(property_id);
CREATE INDEX idx_verifications_property ON public.property_verifications(property_id);