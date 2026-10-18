export function encryptBotToken(token: string, key: string): Promise<{ ciphertext: string; iv: string }>;
export function decryptBotToken(value: { ciphertext: string; iv: string }, key: string): Promise<string>;
export function loadBotToken(config: { url?: string; key?: string; fallback?: string }): Promise<string>;