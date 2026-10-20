import { render, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { RemoteAudio } from "@/components/live/remote-audio";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it("retries blocked audio on a user gesture and respects speaker mute", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValueOnce(new Error("blocked")).mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  const stream = new EventTarget() as MediaStream;
  const blocked = vi.fn();
  const view = render(<RemoteAudio id="listener" stream={stream} muted={false} onBlocked={blocked} />);
  await waitFor(() => expect(blocked).toHaveBeenCalledWith("listener", true));
  fireEvent.pointerDown(window);
  await waitFor(() => expect(blocked).toHaveBeenLastCalledWith("listener", false));
  view.rerender(<RemoteAudio id="listener" stream={stream} muted onBlocked={blocked} />);
  const count = play.mock.calls.length;
  fireEvent.pointerDown(window);
  expect(play).toHaveBeenCalledTimes(count);
  view.rerender(<RemoteAudio id="listener" stream={stream} muted={false} onBlocked={blocked} />);
  await waitFor(() => expect(play.mock.calls.length).toBeGreaterThan(count));
});