CREATE TABLE IF NOT EXISTS public.telegram_bot_settings (
  id integer PRIMARY KEY CHECK (id = 1),
  ciphertext text NOT NULL,
  iv text NOT NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.telegram_bot_settings FROM anon, authenticated;
GRANT ALL ON public.telegram_bot_settings TO service_role;
ALTER TABLE public.telegram_bot_settings ENABLE ROW LEVEL SECURITY;