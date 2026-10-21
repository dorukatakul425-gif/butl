// @ts-nocheck
// Orijinal dialogları oyun ekranına bağlayan fabrika.
// ctx, bundle'daki DialogContext'in最小 karşılığıdır; dialoglar orijinal koduyla çalışır.
import { animationManager } from './runtime';
import { TopsDialog } from './tops-dialog';
import { MiscMenuDialog } from './misc-menu-dialog';

export function createDialogContext(htmlRoot: HTMLElement) {
  const openDialogs = new Set<any>();
  const ctx = {
    htmlRoot,
    animationManager,
    layout: {
      isHeaderUp: true,
      safeArea: { top: 0, left: 0, bottom: 0, right: 0 },
      header: { height: 44, width: 44 },
      unsafeFrame: { width: () => htmlRoot.clientWidth, height: () => htmlRoot.clientHeight }
    },
    photoLoader: {
      tryLoadBG(el: HTMLElement, url: string) {
        if (url) el.style.backgroundImage = `url("${url}")`;
      },
      dlgUpdate() {}
    },
    imageLoader: null,
    open(dlg: any) {
      openDialogs.add(dlg);
      htmlRoot.appendChild(dlg.el);
    },
    close(dlg: any) {
      openDialogs.delete(dlg);
      dlg.el.remove();
    }
  };
  // unsafeFrame nesne değil boyut verir; orijinal kod .width/.height okur:
  Object.defineProperty(ctx.layout, 'unsafeFrame', {
    get: () => ({ width: htmlRoot.clientWidth, height: htmlRoot.clientHeight })
  });
  return ctx;
}

export function openTopsDialog(htmlRoot: HTMLElement, params: any) {
  const ctx = createDialogContext(htmlRoot);
  const dlg = new TopsDialog(ctx, params);
  dlg.open();
  return dlg;
}

export function openMiscMenu(htmlRoot: HTMLElement, params: any) {
  const ctx = createDialogContext(htmlRoot);
  const dlg = new MiscMenuDialog(ctx, params);
  dlg.open();
  return dlg;
}
