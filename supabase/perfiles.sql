-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nombre TEXT,
  avatar_url TEXT,
  tienda_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuarios pueden ver su propio perfil" ON perfiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON perfiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar su propio perfil" ON perfiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Crear bucket de avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas del bucket
CREATE POLICY "Cualquiera puede ver avatares" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Usuarios autenticados pueden subir avatares" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden actualizar sus avatares" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Trigger para crear perfil automáticamente al registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
