-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('model', 'director');
CREATE TYPE public.role_type AS ENUM ('commercial', 'editorial', 'bollywood', 'ramp');
CREATE TYPE public.application_status AS ENUM ('pending', 'shortlisted', 'rejected', 'selected');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT,
  height_cm INT,
  age INT,
  city TEXT,
  portfolio_url TEXT,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE POLICY "Anyone can view roles"
  ON public.user_roles FOR SELECT USING (true);

-- ============ ROLES (casting calls) ============
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  director_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  pay_rate INT NOT NULL DEFAULT 0,
  location TEXT NOT NULL DEFAULT '',
  type role_type NOT NULL DEFAULT 'commercial',
  deadline DATE,
  requirements JSONB DEFAULT '[]'::jsonb,
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roles are public"
  ON public.roles FOR SELECT USING (true);
CREATE POLICY "Directors can post roles"
  ON public.roles FOR INSERT WITH CHECK (
    auth.uid() = director_id AND public.has_role(auth.uid(), 'director')
  );
CREATE POLICY "Directors can update own roles"
  ON public.roles FOR UPDATE USING (auth.uid() = director_id);
CREATE POLICY "Directors can delete own roles"
  ON public.roles FOR DELETE USING (auth.uid() = director_id);

-- ============ APPLICATIONS ============
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_url TEXT,
  cover_note TEXT DEFAULT '',
  portfolio_link TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(role_id, model_id)
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Models view own applications"
  ON public.applications FOR SELECT USING (auth.uid() = model_id);
CREATE POLICY "Directors view apps for their roles"
  ON public.applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.roles r WHERE r.id = role_id AND r.director_id = auth.uid())
  );
CREATE POLICY "Models create own applications"
  ON public.applications FOR INSERT WITH CHECK (
    auth.uid() = model_id AND public.has_role(auth.uid(), 'model')
  );
CREATE POLICY "Directors update applications for their roles"
  ON public.applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.roles r WHERE r.id = role_id AND r.director_id = auth.uid())
  );

-- ============ TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER roles_updated_at BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ NEW USER HANDLER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
  _name TEXT;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'model'::app_role);
  _name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, _name);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('auditions', 'auditions', false);

-- avatars: public read, owner write
CREATE POLICY "Avatars are public"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- auditions: private; model owner + director of related role
CREATE POLICY "Models upload own auditions"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'auditions' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Models view own auditions"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'auditions' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Models delete own auditions"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'auditions' AND auth.uid()::text = (storage.foldername(name))[1]
  );