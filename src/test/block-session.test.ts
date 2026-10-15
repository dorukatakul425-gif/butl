import { afterEach, describe, expect, it, vi } from 'vitest';

const mock = vi.hoisted(() => ({ reads: [] as Array<(value: unknown) => void>, rpc: vi.fn(), callback: undefined as undefined | (() => void) }));
vi.mock('@/lib/supabase', () => ({ getSupabase: () => ({
  from: () => ({ select: () => ({ eq: () => new Promise(resolve => mock.reads.push(resolve)) }) }),
  rpc: mock.rpc,
  channel: () => ({ on: (_type: string, _filter: unknown, cb: () => void) => {
    mock.callback = cb;
    return { subscribe: () => ({}) };
  } }),
  removeChannel: vi.fn(),
}) }));
import { isUserBlocked, setUserBlocked, startCloudBlocks } from '@/lib/block-session';

let stop: (() => void) | undefined;
afterEach(() => { stop?.(); mock.reads.length = 0; mock.rpc.mockReset(); });

describe('confirmed live ignore', () => {
  it('does not let a stale read undo a confirmed block', async () => {
    stop = startCloudBlocks('viewer');
    const stale = mock.reads.shift();
    mock.rpc.mockResolvedValue({ error: null });
    await setUserBlocked('other', true);
    stale?.({ data: [], error: null });
    await Promise.resolve();
    expect(isUserBlocked('other')).toBe(true);
  });
  it('serializes block and unblock instead of allowing server writes to race', async () => {
    stop = startCloudBlocks('viewer');
    let finish: ((value: unknown) => void) | undefined;
    mock.rpc.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValue({ error: null });
    const block = setUserBlocked('other', true);
    const unblock = setUserBlocked('other', false);
    await Promise.resolve();
    expect(mock.rpc).toHaveBeenCalledTimes(1);
    finish?.({ error: null });
    await Promise.all([block, unblock]);
    expect(mock.rpc).toHaveBeenCalledTimes(2);
    expect(isUserBlocked('other')).toBe(false);
  });
  it('refreshes owner state on a realtime deletion and clears state at teardown', async () => {
    stop = startCloudBlocks('viewer');
    mock.reads.shift()?.({ data: [{ blocked: 'other' }], error: null });
    await Promise.resolve();
    expect(isUserBlocked('other')).toBe(true);
    mock.callback?.();
    mock.reads.shift()?.({ data: [], error: null });
    await Promise.resolve();
    expect(isUserBlocked('other')).toBe(false);
  });
});