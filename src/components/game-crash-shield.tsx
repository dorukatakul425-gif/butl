import { Component, type ReactNode } from "react";
import { reportClientError } from "@/lib/client-error-report";

/**
 * Self-healing boundary for one part of the table. A failure inside seats, chat or the header
 * is reported and that part alone is rebuilt shortly after, so the player never leaves the table.
 */
export class GameCrashShield extends Component<{ name: string; children: ReactNode }, { failed: boolean; gen: number }> {
  override state = { failed: false, gen: 0 };
  private hits: number[] = [];
  private timer = 0;

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: unknown) {
    reportClientError(error, `shield:${this.props.name}`);
    const now = Date.now();
    this.hits = this.hits.filter((t) => now - t < 30000);
    this.hits.push(now);
    // Fast retry first; back off when the same part keeps failing.
    const delay = this.hits.length <= 3 ? 250 : 3000;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.setState((s) => ({ failed: false, gen: s.gen + 1 })), delay);
  }

  override componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  override render() {
    if (this.state.failed) return null;
    return <ShieldGen key={this.state.gen}>{this.props.children}</ShieldGen>;
  }
}

function ShieldGen({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
