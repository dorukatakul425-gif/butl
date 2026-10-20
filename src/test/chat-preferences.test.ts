import { describe, expect, it } from 'vitest';
import { defaults, parsePreferences, setChatPreferences, getChatPreferences } from '../lib/chat-preferences';
describe('chat preferences', () => {
  it('uses safe defaults for malformed and unknown values', () => {
    for (const raw of [null, '{', 'null', '{"font":"url(evil)","background":"red","premium":0}']) expect(parsePreferences(raw)).toEqual(defaults);
  });
  it('retains explicit disabled toggles and allowed appearance choices', () => {
    expect(parsePreferences('{"premium":false,"smileys":false,"font":"monospace","background":"#edf5e5"}')).toEqual({ premium: false, smileys: false, font: 'monospace', background: '#edf5e5' });
  });
  it('publishes partial updates without resetting other settings', () => {
    setChatPreferences({ premium: false }); setChatPreferences({ font: 'monospace' });
    expect(getChatPreferences()).toMatchObject({ premium: false, font: 'monospace', smileys: true });
    setChatPreferences(defaults);
  });
});
