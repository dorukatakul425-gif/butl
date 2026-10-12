import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type Ref } from "react";
import { createPortal } from "react-dom";
import { dialogImage, type CilizAssets } from "@/lib/ciliz-assets";
import type { DecorItem } from "@/lib/decor-selection";

// Markup, class names and timings ported from DecorSelectionDialog.tsx, DecorPreview.tsx and Dialog.tsx.
const bem = (block: string) => (element?: string, mods: Array<string | false | undefined> = [], modsOnly = false) => {
  const base = element ? `${block}__${element}` : block;
  return [modsOnly ? "" : base, ...mods.filter(Boolean).map((mod) => `${base}--${mod}`)].join(" ").trim();
};
const cls = bem("decor-selection");
const previewCls = bem("decor-preview");

interface DecorUser {
  name: string;
  age: number;
  photoUrl: string;
}

export interface DecorSelectionDialogProps {
  open: boolean;
  assets: CilizAssets;
  items: DecorItem[];
  activeItem: DecorItem;
  user: DecorUser;
  onApply: (item: DecorItem) => void;
  onClose: () => void;
}

function DialogImage({ assets, image, width, height, className }: { assets: CilizAssets; image: string; width?: number; height?: number; className: string }) {
  const data = dialogImage(assets, image, width, height);
  return <img className={className} src={data.src} width={data.width} height={data.height} alt="" crossOrigin="anonymous" />;
}

function DialogButton({ type, enabled, title, className, onClick }: { type: string; enabled: boolean; title: string; className: string; onClick: () => void }) {
  const button = bem("button");
  return (
    <div className={`${button("", [type, enabled ? "" : "disabled"])} ${className}`} onClick={onClick} role="button" aria-disabled={!enabled}>
      {title}
    </div>
  );
}

interface PreviewHandle {
  runApplyAnimation: () => void;
}

interface PreviewProps {
  assets: CilizAssets;
  decor: DecorItem;
  enabled: boolean;
  user: DecorUser;
  btn: { title: string; onApply: () => void };
}

function DecorPreview({ assets, decor, enabled, user, btn, className }: PreviewProps & { className: string }) {
  return (
    <div className={className}>
      <div className={previewCls("table")}>
        <div className={previewCls("photo_bg")}>
          <div className={previewCls("photo")} style={{ backgroundImage: `url("${user.photoUrl}")` }} />
          {decor.frame && <DialogImage assets={assets} className={previewCls("frame")} image={decor.frame.image} />}
        </div>
        <div className={previewCls("name_bg")}>
          {decor.stone && <DialogImage assets={assets} className={previewCls("stone")} image={decor.stone.image} width={9} height={9} />}
          <div className={previewCls("name")}>{user.name}</div>
          <div className={previewCls("age")}>, {user.age}</div>
          {decor.stone && <DialogImage assets={assets} className={previewCls("stone")} image={decor.stone.image} width={9} height={9} />}
        </div>
      </div>
      <div className={previewCls("control")}>
        <div className={previewCls("text")}>
          <div className={previewCls("desc")}>
            {decor.description}
            {decor.price.type === "open" && decor.price.price && decor.description.includes("{value}") ? (
              <span className={previewCls("heart")}>{decor.price.price}</span>
            ) : null}
          </div>
        </div>
        <DialogButton type="confirm" className={previewCls("button")} enabled={enabled} title={btn.title} onClick={btn.onApply} />
      </div>
    </div>
  );
}

const DecorPreviewAnimated = forwardRef(function DecorPreviewAnimated(props: PreviewProps, ref: Ref<PreviewHandle>) {
  const [animation, setAnimation] = useState<"apply" | "show" | "hide" | null>(null);
  const [displayedDecor, setDisplayedDecor] = useState(props.decor);
  const latestDecor = useRef(props.decor);
  latestDecor.current = props.decor;

  useImperativeHandle(ref, () => ({
    runApplyAnimation() {
      setAnimation("apply");
      window.setTimeout(() => setAnimation(null), 420);
    },
  }));

  useEffect(() => {
    setAnimation("hide");
    const id = window.setTimeout(() => {
      setDisplayedDecor(latestDecor.current);
      setAnimation("show");
    }, 126);
    return () => window.clearTimeout(id);
  }, [props.decor.type]);

  return <DecorPreview {...props} decor={{ ...displayedDecor, title: "" }} className={`${previewCls("", [animation || false])} undefined`} />;
});

function ItemState({ decor, isApplied }: { decor: DecorItem; isApplied: boolean }) {
  const [isAppliedLocal, setIsAppliedLocal] = useState(isApplied);
  const [isAppliedHideAnimation, setIsAppliedHideAnimation] = useState(false);
  useEffect(() => {
    if (isApplied === false && isAppliedLocal === true) {
      setIsAppliedHideAnimation(true);
      const id = window.setTimeout(() => {
        setIsAppliedHideAnimation(false);
        setIsAppliedLocal(false);
      }, 252);
      return () => window.clearTimeout(id);
    }
    setIsAppliedLocal(isApplied);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApplied]);
  if (isAppliedLocal) return <div className={cls("icon-applied", [isAppliedHideAnimation && "hide"])} />;
  if (decor.price.type === "lock") return <div className={cls("icon-lock")} />;
  if (decor.price.price) return <div className={cls("price")}>{decor.price.price}</div>;
  return null;
}

const Item = forwardRef(function Item(
  { assets, decor, isSelected, isApplied, onClick, style }: { assets: CilizAssets; decor: DecorItem; isSelected: boolean; isApplied: boolean; onClick: () => void; style?: CSSProperties },
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div className={cls("item", [isSelected && "selected", isApplied ? "show" : undefined])} style={style} ref={ref} onClick={onClick}>
      <div className={cls("images")}>
        {decor.frame ? (
          <DialogImage assets={assets} className={cls("store-frame")} image={decor.frame.storeImage_v2} width={42} height={42} />
        ) : (
          <div className={cls("store-frame", ["empty"])} />
        )}
        {decor.stone ? (
          <DialogImage assets={assets} className={cls("store-stone")} image={decor.stone.storeImage} width={20} height={20} />
        ) : (
          <div className={cls("store-stone", ["empty"])} />
        )}
      </div>
      <div className={cls("state")}>
        <ItemState isApplied={isApplied} decor={decor} />
      </div>
    </div>
  );
});

export function DecorSelectionDialog({ open, assets, items, activeItem, user, onApply, onClose }: DecorSelectionDialogProps) {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<"show" | "hide" | null>(null);
  const [preview, setPreview] = useState(activeItem);
  const previewRef = useRef<PreviewHandle>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // CSSTransition('popup--center', 'popup--show', 'popup--hide').
  useEffect(() => {
    if (open) {
      setPreview(activeItem);
      setMounted(true);
      setPhase("show");
      const id = window.setTimeout(() => setPhase(null), 300);
      return () => window.clearTimeout(id);
    }
    if (!mounted) return;
    setPhase("hide");
    const id = window.setTimeout(() => {
      setMounted(false);
      setPhase(null);
    }, 100);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, [open, onClose]);

  if (!mounted) return null;

  const apply = () => {
    onApply(preview);
    previewRef.current?.runApplyAnimation();
  };
  const shake = () => {
    const el = selectedItemRef.current;
    if (!el) return;
    el.classList.remove(cls("item", ["shake"], true));
    void el.offsetHeight;
    el.classList.add(cls("item", ["shake"], true));
  };
  const canApply = preview.price.type === "open";

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="popup__dialog-manager">
        <div className="popup-shade" onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={preview.title}
          className={["popup", cls("x_popup"), "popup--center", phase === "show" && "popup--show", phase === "hide" && "popup--hide"].filter(Boolean).join(" ")}
        >
          <div className={`popup__header ${cls("x_popup__header")}`}>
            <div className={`popup__title ${cls("x_popup__title")}`}>{preview.title}</div>
            <DecorPreviewAnimated
              ref={previewRef}
              assets={assets}
              decor={preview}
              enabled={preview.type !== activeItem.type && canApply}
              user={user}
              btn={{ title: preview.btnTitle, onApply: canApply ? apply : shake }}
            />
            <div className="popup__close popup__close--dlg" onClick={onClose} role="button" aria-label="Kapat">
              <div className="popup__close-icon" />
            </div>
          </div>
          <div className={`popup__content popup__content--no-padding ${cls("x_popup__content")}`}>
            <div className={cls("")}>
              {items.map((item) => (
                <Item
                  key={item.type}
                  ref={item.type === preview.type ? selectedItemRef : undefined}
                  assets={assets}
                  decor={item}
                  isSelected={preview.type === item.type}
                  isApplied={item.type === activeItem.type}
                  onClick={() => setPreview(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
