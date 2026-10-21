// @ts-nocheck
// ;// ./js/html/dialogs/MiscMenuDialog.tsx
// Orijinal Ciliz paketinden (preloader.fa928eddbe11.js, satır 136479-136567) birebir çıkarıldı.
import {
  preact_module_, preact_module_k, bem, Dialog, CSSTransition, passiveOps, __awaiter
} from './runtime';

const MiscMenuDialog_cls = bem('misc-menu');
export class MiscMenuDialog extends Dialog {
  constructor(ctx, p) {
    super(ctx, 'MiscMenuDialog');
    this.p = p;
    this.onClose = () => this.close();
    this.JSX = props => preact_module_(preact_module_k, null, props.items.map(item => preact_module_(MiscMenuDialog_Item, {
      item: item
    })));
    this.transition = new CSSTransition(MiscMenuDialog_cls('position'), MiscMenuDialog_cls('show'), MiscMenuDialog_cls('hide'));
    this.useShadeBackground = false;
    this.exclusiveGroup = 'misc_menu';
    this.onroot = () => this.close();
    this.el = document.createElement('div');
    this.el.classList.add('popup');
    this.el.addEventListener('mousedown', e => e.stopPropagation());
    this.el.addEventListener('touchstart', e => e.stopPropagation());
    this.ctx.htmlRoot.addEventListener('mousedown', this.onClose);
    this.ctx.htmlRoot.addEventListener('touchstart', this.onClose, passiveOps());
  }
  close() {
    const _super = Object.create(null, {
      close: {
        get: () => super.close
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      this.ctx.htmlRoot.removeEventListener('mousedown', this.onClose);
      this.ctx.htmlRoot.removeEventListener('touchstart', this.onClose);
      yield _super.close.call(this);
    });
  }
  update() {
    this.updateJSX(preact_module_(this.JSX, Object.assign({}, this.p)));
    this.updateLayout();
  }
  setParams(p) {
    this.p = p;
    this.update();
    this.updateLayout();
  }
  updateLayout() {
    super.updateLayout();
    if (!this.el || this.el.clientWidth === 0) return;
    const layout = this.layout;
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;
    const safeArea = this.layout.safeArea;
    if (layout.isHeaderUp) {
      this.el.style.top = `${safeArea.top + layout.header.height}px`;
      if (layout.unsafeFrame.width - this.p.btnCenterPoint.x < width / 2 + 15) {
        this.el.style.left = '50%';
        this.el.style.transform = 'translateX(-50%)';
      } else {
        this.el.style.left = `${this.p.btnCenterPoint.x - width / 2}px`;
        this.el.style.transform = 'none';
      }
    } else {
      this.el.style.left = `${safeArea.left + layout.header.width}px`;
      if (layout.unsafeFrame.height - this.p.btnCenterPoint.y < height / 2 + 15) {
        this.el.style.top = '50%';
        this.el.style.transform = 'translateY(-50%)';
      } else {
        this.el.style.top = `${this.p.btnCenterPoint.y - height / 2}px`;
        this.el.style.transform = 'none';
      }
    }
  }
}
const MiscMenuDialog_Item = _ref => {
  let {
    item
  } = _ref;
  return preact_module_("div", {
    class: MiscMenuDialog_cls('item'),
    onClick: item.action
  }, preact_module_("div", {
    class: MiscMenuDialog_cls('icon', [item.icon])
  }), item.title, item.indicate && preact_module_("div", {
    class: MiscMenuDialog_cls('indicator')
  }));
};
