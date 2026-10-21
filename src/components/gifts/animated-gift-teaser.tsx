import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { animatedGiftCountdownLabel } from "@/lib/animated-gift-countdown";
import "@/styles/animated-gift.css";

export function AnimatedGiftTeaser() {
  const [now, setNow] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", update); };
  }, []);

  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>
      <Button variant="ghost" className="animated-gift-trigger animated-gift-theme" aria-label="Animasiyalı hədiyyə">
        <span className="animated-gift-timer">{now === null ? "—" : animatedGiftCountdownLabel(now)}</span>
        <span className="animated-gift-label"><Sparkles aria-hidden="true" />Animasiyalı hədiyyə</span>
      </Button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="animated-gift-overlay animated-gift-theme" />
      <Dialog.Content className="animated-gift-notice animated-gift-theme" onEscapeKeyDown={event => event.stopPropagation()}>
        <Gift className="animated-gift-notice-icon" aria-hidden="true" />
        <Dialog.Title className="animated-gift-notice-title">Animasiyalı hədiyyə</Dialog.Title>
        <Dialog.Description className="animated-gift-notice-description">Bu funksiya tezliklə aktiv olacaqdır.</Dialog.Description>
        <Dialog.Close asChild><Button className="animated-gift-notice-close">Bağla</Button></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}