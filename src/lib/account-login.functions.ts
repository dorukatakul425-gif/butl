import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Never return a resolved account address or reveal whether an identity exists.
export const loginWithIdentity = createServerFn({ method: 'POST' })
  .inputValidator(input => z.object({ identity: z.string().trim().toLowerCase().min(3).max(40).regex(/^[a-z0-9_-]+$/), password: z.string().min(8).max(128) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const query = supabaseAdmin.from('profiles').select('id');
    const result = /^\d+$/.test(data.identity)
      ? await query.eq('player_id', Number(data.identity)).maybeSingle()
      : /^[0-9a-f]{8}-[0-9a-f-]{27}$/.test(data.identity)
        ? await query.eq('id', data.identity).maybeSingle()
        : await query.eq('username', data.identity).maybeSingle();
    const account = result.data ? await supabaseAdmin.auth.admin.getUserById(result.data.id) : null;
    const email = account?.data.user?.email ?? `${data.identity.replace(/-/g, '_')}@players.sise.local`;
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const auth = createClient(process.env['SUPABASE_URL']!, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey', key); return fetch(input, { ...init, headers }); } } });
    const { data: signed, error } = await auth.auth.signInWithPassword({ email, password: data.password });
    if (error || !signed.session || !result.data) throw new Error('Kullanıcı adı / ID veya şifre yanlış.');
    return { access_token: signed.session.access_token, refresh_token: signed.session.refresh_token };
  });