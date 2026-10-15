export const INSPECTOR_NOTICE = "Mənim s*m bildiyini sənin başın bilmir ;)\n\nboş yerə kod axtarma ogurlamaq uvun";

let displayed = false;

// A notice only: never detect DevTools, pause execution, or block input.
export function showInspectorNotice() {
  if (displayed) return;
  try {
    console.info(INSPECTOR_NOTICE);
    displayed = true;
  } catch {
    // Console overrides must never prevent the application from mounting.
  }
}