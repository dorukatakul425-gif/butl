// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
const mock = vi.hoisted(() => ({ admin: false }));
vi.mock('@/lib/room-session', () => ({ useIsChatAdmin: () => mock.admin }));
import { TableIdChip } from '@/components/table/table-id-chip';
afterEach(() => { cleanup(); mock.admin = false; });
describe('table id chip is admin-only', () => {
  it('hides the table id from normal users', () => {
    const { container } = render(<TableIdChip roomId={12} label="Stol №" />);
    expect(container.textContent).not.toContain('12');
    expect(container.querySelector('.original-header-table')).toBeNull();
  });
  it('shows the table id to admins', () => {
    mock.admin = true;
    const { container } = render(<TableIdChip roomId={12} label="Stol №" />);
    expect(container.querySelector('.original-header-table-id')?.textContent).toBe('12');
  });
});
