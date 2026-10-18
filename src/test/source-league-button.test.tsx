import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SourceLeagueButton } from '@/components/table/source-league-button';
import { attachSourceFeatureSession, type SourceFeatureSnapshot } from '@/lib/source-feature-session';

afterEach(() => { cleanup(); attachSourceFeatureSession(null); });
function host(leagueHeader: NonNullable<SourceFeatureSnapshot['leagueHeader']>) {
  const snapshot = { viewerId: 'me', leagueHeader, leagueState: leagueHeader.type };
  attachSourceFeatureSession({ getSnapshot: () => snapshot, subscribe: () => () => {}, execute: vi.fn() });
}
it('keeps the cup and never invents a rank or countdown without host state', () => {
  render(<SourceLeagueButton onClick={vi.fn()} />);
  expect(document.querySelector('.original-button-icon')).not.toBeNull();
  expect(document.querySelector('.original-league-position')).toBeNull();
  expect(document.querySelector('.original-league-info')).toBeNull();
});
it('replaces the cup with the exact running position and timer and opens league', () => {
  host({ type: 'running', positionText: '#10', leftTimeShortText: '5&nbsp;d.' });
  const open = vi.fn(); render(<SourceLeagueButton onClick={open} />);
  expect(document.querySelector('.original-button-icon')).toBeNull();
  expect(screen.getByText('#10')).toBeVisible();
  expect(document.querySelector('.original-league-info')).toHaveTextContent('5 d.');
  fireEvent.click(screen.getByRole('button', { name: 'Lig' })); expect(open).toHaveBeenCalledOnce();
});
it('restores the cup and displays the result when finished', () => {
  host({ type: 'finished', positionText: '#3' }); render(<SourceLeagueButton onClick={vi.fn()} />);
  expect(document.querySelector('.original-button-icon')).not.toBeNull();
  expect(screen.getByText('#3')).toBeVisible();
});
it('shows the original welcome indicator without a fictional rank', () => {
  host({ type: 'welcome' }); render(<SourceLeagueButton onClick={vi.fn()} />);
  expect(screen.getByText('!')).toBeVisible();
  expect(document.querySelector('.original-league-position')).toBeNull();
});
it('does not open the league popup for a player who has not begun competition', () => {
  const snapshot = { viewerId: 'me', leagueState: 'undefined' };
  attachSourceFeatureSession({ getSnapshot: () => snapshot, subscribe: () => () => {}, execute: vi.fn() });
  const open = vi.fn(); render(<SourceLeagueButton onClick={open} />);
  fireEvent.click(screen.getByRole('button', { name: 'Lig' }));
  expect(open).not.toHaveBeenCalled();
});