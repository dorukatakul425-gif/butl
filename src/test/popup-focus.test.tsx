import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { SourceFeaturePopup } from '@/components/table/source-feature-popup';
afterEach(cleanup);
it('keeps birthday focus when parent callbacks change after a profile update', () => {
  const oldClose = vi.fn(), latestClose = vi.fn();
  const content = <input aria-label="Birthday" type="date" defaultValue="2000-01-01"/>;
  const {rerender} = render(<SourceFeaturePopup title="Profile" onClose={oldClose}>{content}</SourceFeaturePopup>);
  screen.getByLabelText('Birthday').focus();
  rerender(<SourceFeaturePopup title="Profile" onClose={latestClose}>{content}</SourceFeaturePopup>);
  expect(screen.getByLabelText('Birthday')).toHaveFocus();
  fireEvent.keyDown(document,{key:'Escape'}); expect(latestClose).toHaveBeenCalledOnce(); expect(oldClose).not.toHaveBeenCalled();
});