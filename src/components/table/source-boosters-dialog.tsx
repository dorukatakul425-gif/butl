import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useCilizAssets } from '@/components/decor/decor-selection';
import { dialogImage, translate, type CilizAssets, type CilizBooster } from '@/lib/ciliz-assets';

const ORDER = ['kiss_fire', 'refuse_slap', 'league5', 'league_kiss2x', 'league_kiss_lim10'];
function Popup({ title, onClose, children, help, nested = false }: { title: string; onClose: () => void; children: ReactNode; help?: () => void; nested?: boolean }) {
  useEffect(() => {
    if (nested) return;
    const previous = document.activeElement;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onClose(); } };
    document.addEventListener('keydown', key, true);
    return () => { document.removeEventListener('keydown', key, true); if (previous instanceof HTMLElement) previous.focus(); };
  }, [onClose, nested]);
  return <div className="source-boosters-layer">
    <div className="popup-shade" onClick={onClose} />
    <section role="dialog" aria-modal={!nested} inert={nested} aria-label={title} className="popup popup--center">
      <Button variant="ghost" className="popup__close popup__close--dlg" aria-label="Kapat" onClick={onClose}><span className="popup__close-icon" /></Button>
      <header className="popup__header"><div className="popup__title">{title}</div>{help && <Button variant="ghost" className="boosters-list__manual" aria-label="Güçlendirici Nedir" onClick={help} />}</header>
      <div className="popup__content">{children}</div>
    </section>
  </div>;
}
function Item({ assets, booster, onClick, info = false }: { assets: CilizAssets; booster: CilizBooster; onClick?: () => void; info?: boolean }) {
  const image = dialogImage(assets, booster.image, 60, 60);
  const content = <div className="booster-item__image"><img src={image.src} width={image.width} height={image.height} alt="" /><div className="booster-item__hint booster-item__hint--counter-grey">—</div></div>;
  return onClick ? <Button variant="ghost" className="booster-item booster-item--list booster-item--clickable" aria-label={translate(assets, `dlg:booster_info:${booster.type}:title`)} onClick={onClick}>{content}</Button> : <div className={`booster-item booster-item--${info ? 'info' : 'list'}`}>{content}</div>;
}

/** Original inventory and help. Unknown inventory is never substituted with owned boosters. */
export function SourceBoostersDialog({ onClose }: { onClose: () => void }) {
  const assets = useCilizAssets();
  const [selected, setSelected] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  if (!assets) return null;
  const entries = ORDER.flatMap(id => assets.boosters?.[id] ? [[id, assets.boosters[id]] as const] : []);
  const current = selected ? assets.boosters?.[selected] : undefined;
  const categories = ['choice', 'league'];
  return createPortal(<>
    <Popup title={translate(assets, 'table:menu:boosters')} onClose={onClose} nested={Boolean(current || help)} help={() => setHelp(true)}>
      <div className="boosters-list"><div className="boosters-list__subtitle">{translate(assets, 'dlg:boosters:desc')}</div>
        {categories.map(category => <div key={category} className="boosters-category-group">
          <div className="boosters-list__category"><div className="boosters-list__cat-border" /><div className="boosters-list__cat-title">{translate(assets, `dlg:boosters:section:${category}`)}</div><div className="boosters-list__cat-border" /></div>
          <div className="boosters-list__cat-items">{entries.filter(([, b]) => b.category === category).map(([id, b]) => <Item key={id} assets={assets} booster={b} onClick={() => setSelected(id)} />)}</div>
        </div>)}
      </div>
    </Popup>
    {current && <Popup title={translate(assets, `dlg:booster_info:${selected}:title`)} onClose={() => setSelected(null)}>
      <div className="booster"><Item assets={assets} booster={current} info /><div className="booster__description">{translate(assets, `dlg:booster_info:${selected}:desc`)}</div>
        <div className={`booster__info${current.category === 'choice' ? ' booster__info--disabled' : ''}`}>{translate(assets, current.category === 'choice' ? 'dlg:booster_info:table_activation:info' : 'dlg:booster_info:not_in_leagues:info')}</div>
      </div>
    </Popup>}
    {help && <Popup title={translate(assets, 'dlg:boosters_help:header')} onClose={() => setHelp(false)}>
      <div className="boosters-help"><div className="boosters-help__subtitle">{translate(assets, 'dlg:boosters_help:desc')}</div>
        {categories.map(category => <div key={category}>
          <div className="boosters-help__category"><div className="boosters-help__category-border" /><div className="boosters-help__category-title">{translate(assets, `dlg:boosters:section:${category}`)}</div><div className="boosters-help__category-border" /></div>
          <div className="boosters-help__category-desc">{translate(assets, `dlg:boosters_help:${category}_desc`)}</div>
          <div className="boosters-help__category-items">{entries.filter(([, b]) => b.category === category).map(([id, b]) => <div key={id} className="boosters-help__category-item"><Item assets={assets} booster={b} /><div className="boosters-help__category-item-info"><div className={`boosters-help__category-item-title boosters-help__category-item-title--${category}`}>{translate(assets, `dlg:booster_info:${id}:title`)}</div><div className="boosters-help__category-item-desc">{translate(assets, `dlg:booster_info:${id}:desc`)}</div></div></div>)}</div>
        </div>)}
      </div>
    </Popup>}
  </>, document.body);
}