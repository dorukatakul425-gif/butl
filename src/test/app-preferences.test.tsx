import { describe, expect, it } from 'vitest';
import { languages, parsePreferences, PREFERENCE_KEY, setPreferences } from '@/lib/app-preferences';
describe('app preferences',()=>{
 it('defaults to Azerbaijani',()=>{expect(parsePreferences(null).language).toBe('az');});
 it('offers the four requested languages',()=>{expect(languages.map(l=>l.code)).toEqual(['az','tr','ru','en']);});
 it.each(['az','tr','ru','en'] as const)('keeps %s after a fresh storage read',language=>{setPreferences({language});expect(parsePreferences(localStorage.getItem(PREFERENCE_KEY)).language).toBe(language);});
 it.each(['dark','light'] as const)('keeps %s appearance after a fresh storage read',theme=>{setPreferences({theme});expect(parsePreferences(localStorage.getItem(PREFERENCE_KEY)).theme).toBe(theme);});
 it('falls back safely on invalid settings',()=>{expect(parsePreferences('{broken')).toEqual({language:'az',theme:'light'});});
});
