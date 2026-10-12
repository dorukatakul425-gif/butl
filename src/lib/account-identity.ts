import { z } from 'zod';

export const usernameSchema = z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,30}$/, 'Kullanıcı adı 3–30 harf, rakam veya alt çizgi olmalı.');
export const usernameEmail = (username: string) => `${usernameSchema.parse(username)}@players.sise.local`;