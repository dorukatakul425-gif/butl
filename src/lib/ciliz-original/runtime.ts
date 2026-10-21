// @ts-nocheck
// Orijinal Ciliz paketinden (preloader.fa928eddbe11.js) birebir çıkarılan çalışma zamanı modülleri.
// Bundle içi global isimler (preact_module_, hooks_module_*, G, Q ...) gerçek preact'e bağlanır.
import { h, Fragment, createContext, render } from 'preact';
import { useRef, useState, useCallback, useEffect, useContext, useMemo } from 'preact/hooks';
import { forwardRef } from 'preact/compat';

// ---- bundle global eşlemeleri ----
export const preact_module_ = h;
export const preact_module_k = Fragment;
export const hooks_module_A = useRef;
export const hooks_module_d = useState;
export const hooks_module_q = useCallback;
export const hooks_module_y = useEffect;
export const hooks_module_ = useEffect;
export const hooks_module_x = useContext;
export const hooks_module_T = useMemo;
export const compat_module_D = forwardRef;
export const G = render;
export const Q = createContext;

// ---- tslib yardımcıları (bundle'daki haliyle) ----
export function __rest(s, e) {
  const t = {};
  for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  return t;
}
export function __awaiter(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))((resolve, reject) => {
    const fulfilled = value => { try { step(generator.next(value)); } catch (e) { reject(e); } };
    const rejected = value => { try { step(generator['throw'](value)); } catch (e) { reject(e); } };
    const step = result => (result.done ? resolve(result.value) : new P(r => r(result.value)).then(fulfilled, rejected));
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

// ;// ./js/html/utils/bem.ts  (orijinal)
export const bem = block => (element, mods, modsOnly) => {
  const base = element ? `${block}__${element}` : block;
  const filteredMods = (mods || []).filter(Boolean);
  return [modsOnly ? '' : base, ...filteredMods.map(m => `${base}--${m}`)].join(' ').trim();
};

// ;// ./js/html/utils/clsJoin.ts  (orijinal)
export function clsJoin() {
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }
  return a.filter(Boolean).join(' ');
}

// ;// ./js/html/utils/applyRef  (orijinal)
function apply(ref, value) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}
export var applyRefs = function applyRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }
  return function (value) {
    refs.forEach(function (ref) {
      return apply(ref, value);
    });
  };
};

// ;// ./js/html/dialogs/Context  (orijinal)
export const Context = Q(undefined);
export function useDialog() {
  const dlg = hooks_module_x(Context);
  if (!dlg) throw new Error('No Dialog.Context provided');
  return dlg;
}
export function useDialogContext() {
  return useDialog().ctx;
}

// ;// ./js/utils/Scope.ts  (orijinal)
export class Scope {
  constructor() {
    this.stack = [];
  }
  addBlock(enter) {
    const leave = enter();
    return this.pushRemove(leave);
  }
  addCleaner(f) {
    return this.pushRemove(f);
  }
  addTimeout(handler, timeout) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    const tid = window.setTimeout(() => {
      wrap.remove();
      handler(...args);
    }, timeout);
    const wrap = Object.assign({
      call: () => handler(...args)
    }, this.pushRemove(() => clearTimeout(tid)));
    return wrap;
  }
  removeAll() {
    while (this.stack.length > 0) {
      const removeF = this.stack.pop();
      removeF();
    }
  }
  pushRemove(removeF) {
    let removed = false;
    const realRemoveF = () => {
      if (removed) throw new Error('Already removed');
      removed = true;
      this.stack = this.stack.filter(f => f !== realRemoveF);
      removeF();
    };
    this.stack.push(realRemoveF);
    return {
      remove: realRemoveF
    };
  }
}

// ;// ./js/utils/splitThousands.ts  (orijinal)
export function splitThousands(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// ;// ./js/utils/passiveOps  (orijinal)
const supportsPassiveEvents = (() => {
  let supports = false;
  try {
    const opts = Object.defineProperty({}, 'passive', { get: () => (supports = true) });
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch (e) {}
  return supports;
})();
export function passiveOps() {
  let capture = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (!supportsPassiveEvents) return capture;
  return {
    capture,
    passive: false
  };
}

// ;// ./js/utils/exception  (orijinal davranış: raporla)
export function exception(e) {
  console.error(e);
}

// ;// ./js/utils/throttle  (orijinal davranış)
export function throttle(f, ms) {
  let last = 0;
  let timer = null;
  return function () {
    const now = Date.now();
    const args = arguments;
    if (now - last >= ms) {
      last = now;
      f.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        last = Date.now();
        f.apply(this, args);
      }, ms - (now - last));
    }
  };
}

export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// ;// ./js/html/dialogs/transitions.ts  (orijinal)
export class CSSTransition {
  constructor(positionClass, showClass, hideClass) {
    this.positionClass = positionClass;
    this.showClass = showClass;
    this.hideClass = hideClass;
  }
  setup(el) {
    el.classList.add(this.positionClass);
    if (CSSTransition.ignoreAnimation) return;
    el.style.opacity = '0';
  }
  open(el) {
    return __awaiter(this, void 0, void 0, function* () {
      if (CSSTransition.ignoreAnimation) return;
      yield nextFrame();
      el.style.opacity = '';
      yield runAnimationClass(el, this.showClass);
    });
  }
  close(el) {
    return __awaiter(this, void 0, void 0, function* () {
      if (CSSTransition.ignoreAnimation) return;
      el.classList.remove(this.showClass);
      yield runAnimationClass(el, this.hideClass);
    });
  }
  setLayout(el, layout) {}
}
CSSTransition.ignoreAnimation = false;
function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(() => resolve());
  });
}
function runAnimationClass(el, cls) {
  return __awaiter(this, void 0, void 0, function* () {
    yield new Promise(resolve => {
      el.addEventListener('animationend', resolve);
      el.addEventListener('webkitAnimationEnd', resolve);
      el.classList.add(cls);
    });
    el.classList.remove(cls);
  });
}

// ;// ./js/animationManager — bundle'daki tween/timeline arayüzünün最小 karşılığı
export const animationManager = {
  EASE_OUT: t => 1 - Math.pow(1 - t, 3),
  tween(el, duration, props) {
    return { el, duration, props };
  },
  timeline() {
    const items = [];
    return {
      ease: null,
      add(delay, tw) {
        items.push(tw);
      },
      start() {
        for (const tw of items) {
          const { el, duration, props } = tw;
          const start = {};
          for (const k in props) start[k] = el[k];
          const t0 = performance.now();
          const step = now => {
            let p = Math.min(1, (now - t0) / (duration * 1000));
            if (this.ease) p = this.ease === animationManager.EASE_OUT ? animationManager.EASE_OUT(p) : p;
            for (const k in props) el[k] = start[k] + (props[k] - start[k]) * p;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      }
    };
  }
};
// Swiper doğrudan timeline().add çağırıyor; add içinde hemen başlat:
const origTimeline = animationManager.timeline.bind(animationManager);
animationManager.timeline = function () {
  const tl = origTimeline();
  const origAdd = tl.add.bind(tl);
  tl.add = (delay, tw) => {
    origAdd(delay, tw);
    tl.start();
  };
  return tl;
};

// ;// ./js/html/components/Swiper.tsx  (orijinal)
export class Swiper {
  constructor(el, config) {
    this.el = el;
    this.config = config;
    this.lastTouch = {
      x: 0,
      y: 0
    };
    this.lastPage = 0;
    this.startTime = 0;
    this.lastSpeed = 0;
    this.swipeSpeed = 0.035;
    this.touchStart = e => {
      this.lastTouch.x = e.touches[0].clientX;
      this.lastTouch.y = e.touches[0].clientY;
      this.startTime = Date.now();
      this.scroll = undefined;
    };
    this.touchMove = e => {
      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;
      if (!this.scroll) this.scroll = Math.abs(this.lastTouch.y - curY) > Math.abs(this.lastTouch.x - curX) ? 'vertical' : 'horizontal';
      if (this.scroll === 'vertical') return;
      e.preventDefault();
      this.lastSpeed = (this.lastTouch.x - curX) / (Date.now() - this.startTime);
      this.el.scrollLeft += this.lastTouch.x - curX;
      this.lastTouch.x = curX;
      this.lastTouch.y = curY;
    };
    this.endSwipe = () => {
      if (this.scroll === 'vertical') return;
      const page = (percent => {
        if (this.lastSpeed > this.swipeSpeed) return Math.ceil(percent);
        if (this.lastSpeed < -this.swipeSpeed) return Math.floor(percent);
        return Math.round(percent);
      })(this.el.scrollLeft / this.el.offsetWidth);
      const x = page * this.el.offsetWidth;
      this.onPageChanged && this.onPageChanged(page);
      this.scrollPagesTo(x);
    };
    this.onwheel = e => {
      const isHorizontal = isFirefox ? Math.abs(e.deltaX) > Math.abs(e.deltaY) : Math.abs(e.deltaX) > 0;
      if (isHorizontal) {
        e.preventDefault();
        return;
      }
    };
    this.onscroll = () => {
      const page = this.page;
      if (page !== this.lastPage && this.config.onPageChanged) {
        this.config.onPageChanged(page);
        this.lastPage = page;
      }
    };
    el.addEventListener('touchstart', this.touchStart);
    el.addEventListener('touchmove', this.touchMove);
    el.addEventListener('touchend', this.endSwipe);
    el.addEventListener('touchcancel', this.endSwipe);
    el.addEventListener('scroll', this.onscroll);
    if (config.disableScrollByWheel) {
      el.addEventListener('wheel', this.onwheel);
    }
    if (config.onScrollCb) {
      el.addEventListener('scroll', config.onScrollCb, passiveOps());
    }
  }
  get page() {
    return Math.round(this.el.scrollLeft / this.el.offsetWidth);
  }
  get maxPage() {
    return this.el.children.length - 1;
  }
  setInitialPage(page) {
    const x = page * this.el.offsetWidth;
    this.el.scrollLeft = x;
  }
  scrollToPage(page) {
    const x = page * this.el.offsetWidth;
    this.scrollPagesTo(x);
    this.onPageChanged && this.onPageChanged(page);
  }
  scrollPagesTo(scrollTo) {
    const tl = this.config.animationManager.timeline();
    tl.ease = this.config.animationManager.EASE_OUT;
    tl.add(0, this.config.animationManager.tween(this.el, 0.2, {
      scrollLeft: scrollTo
    }));
  }
  destroy() {
    this.el.removeEventListener('touchstart', this.touchStart);
    this.el.removeEventListener('touchmove', this.touchMove);
    this.el.removeEventListener('touchend', this.endSwipe);
    this.el.removeEventListener('touchcancel', this.endSwipe);
    if (this.config.onScrollCb) {
      this.el.removeEventListener('scroll', this.config.onScrollCb);
    }
  }
}

// ;// ./js/html/components/Dialog/Button.tsx  (orijinal)
const clsButton = bem('button');
export const Button = _a => {
  var {
      type = '',
      title,
      enabled = true,
      bonus = 0,
      onclick = undefined
    } = _a,
    p = __rest(_a, ["type", "title", "enabled", "bonus", "onclick"]);
  return preact_module_("div", Object.assign({}, p, {
    class: clsJoin(clsButton('', [type, enabled ? '' : 'disabled']), p.class),
    onClick: e => onclick === null || onclick === void 0 ? void 0 : onclick({
      x: e.clientX,
      y: e.clientY
    })
  }), title, bonus > 0 && preact_module_("span", {
    class: clsButton('bonus')
  }, "+", preact_module_("div", {
    class: clsButton('heart')
  }), bonus));
};

// ;// ./js/html/components/Dialog/Header.tsx  (orijinal)
const Header_cls = bem('popup');
export const Header = _ref => {
  let {
    innerRef = null,
    headerMods,
    headerClass,
    title,
    titleMods,
    titleClass,
    titleRef,
    closeBtnRef,
    closeBtnMod = 'dlg',
    onClose,
    closeIconClass,
    showScrollBorder = true,
    children
  } = _ref;
  return preact_module_(preact_module_k, null, onClose && ['drawer', 'response-gift'].indexOf(closeBtnMod) >= 0 && (closeBtnMod === 'drawer' ? preact_module_("div", {
    ref: closeBtnRef,
    class: Header_cls('close-drawer-bg'),
    onClick: e => onClose({
      x: e.clientX,
      y: e.clientY
    })
  }, preact_module_("div", {
    class: Header_cls('close', [closeBtnMod])
  }, preact_module_("div", {
    class: `${clsJoin(Header_cls('close-icon'), closeIconClass)}`
  }))) : preact_module_("div", {
    ref: closeBtnRef,
    class: Header_cls('close', [closeBtnMod]),
    onClick: e => onClose({
      x: e.clientX,
      y: e.clientY
    })
  }, preact_module_("div", {
    class: `${clsJoin(Header_cls('close-icon'), closeIconClass)}`
  }))), preact_module_("div", {
    class: clsJoin(Header_cls('header', headerMods), headerClass),
    ref: applyRefs(innerRef, useDialog().jsx_setHeader(showScrollBorder))
  }, title && preact_module_("div", {
    class: clsJoin(Header_cls('title', titleMods), titleClass),
    ref: titleRef
  }, title), children, onClose && closeBtnMod === 'dlg' && preact_module_("div", {
    ref: closeBtnRef,
    class: Header_cls('close', [closeBtnMod]),
    onClick: e => onClose({
      x: e.clientX,
      y: e.clientY
    })
  }, preact_module_("div", {
    class: `${clsJoin(Header_cls('close-icon'), closeIconClass)}`
  }))));
};

// ;// ./js/html/components/Dialog/PhotoBg.tsx  (orijinal)
export const PhotoBg = _a => {
  var {
      url,
      onClick
    } = _a,
    p = __rest(_a, ["url", "onClick"]);
  const ref = hooks_module_A(null);
  const dlg = useDialog();
  hooks_module_(() => {
    dlg.jsx_setPhotoBg(url)(ref.current);
  }, [url]);
  return preact_module_("div", {
    class: p.class,
    onClick: onClick,
    ref: ref
  }, p.children);
};

// ;// ./js/html/dialogs/Dialog.tsx  (orijinal)
export class Dialog {
  constructor(ctx, dlgName) {
    this.ctx = ctx;
    this.dlgName = dlgName;
    this.transition = new CSSTransition('popup--center', 'popup--show', 'popup--hide');
    this.isReusable = false;
    this.useShadeBackground = true;
    this.useScrollBorder = true;
    this.isSystem = false;
    this.scope = new Scope();
    this._isOpened = false;
    this._isDestroyed = false;
    this._needsUpdate = false;
    this.updatesAfterDestroy = 0;
    this.jsx_setPhotoBg = url => el => {
      var _a;
      if (!el) return;
      (_a = this.ctx.photoLoader) === null || _a === void 0 ? void 0 : _a.tryLoadBG(el, url);
    };
    this.jsx_headerShowScrollBorder = true;
    this.jsx_header = null;
    this.jsx_setHeader = showScrollBorder => el => {
      this.jsx_headerShowScrollBorder = showScrollBorder;
      this.jsx_header = el;
      this.updateScroll();
    };
    this.jsx_content = null;
    this.jsx_setContent = el => {
      this.jsx_content = el;
      this.updateScroll();
    };
    this.jsx_butttonsShowScrollBorder = true;
    this.jsx_buttons = null;
    this.jsx_setButtons = showScrollBorder => el => {
      this.jsx_butttonsShowScrollBorder = showScrollBorder;
      this.jsx_buttons = el;
      this.updateScroll();
    };
    this.jsx_footerShowScrollBorder = true;
    this.jsx_footer = null;
    this.jsx_setFooter = showScrollBorder => el => {
      this.jsx_footerShowScrollBorder = showScrollBorder;
      this.jsx_footer = el;
      this.updateScroll();
    };
  }
  get isOpened() {
    return this._isOpened;
  }
  open() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (this.isReusable) this.closingPromise = undefined;
      this._isOpened = true;
      this.ctx.open(this);
      this.transition.setup(this.el);
      this.update();
      yield this.transition.open(this.el);
      if (this._isDestroyed) return;
      (_a = this.onopen) === null || _a === void 0 ? void 0 : _a.call(this);
    });
  }
  get layout() {
    return this.ctx.layout;
  }
  setLayout(layout) {
    this.transition.setLayout(this.el, layout);
    this.updateLayout();
    if (this.requestAnimationFrameId !== undefined) cancelAnimationFrame(this.requestAnimationFrameId);
    this.requestAnimationFrameId = requestAnimationFrame(() => this.updateScroll());
  }
  get needsUpdate() {
    return this._needsUpdate;
  }
  setNeedsUpdate() {
    this._needsUpdate = true;
  }
  updateLayout() {}
  close() {
    let showTransition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    if (!this.closingPromise) {
      this.closingPromise = (() => __awaiter(this, void 0, void 0, function* () {
        if (showTransition) {
          yield this.transition.close(this.el);
        }
        this.closeImmediately();
      }))();
    }
    return this.closingPromise;
  }
  closeImmediately() {
    var _a;
    this._isOpened = false;
    (_a = this.onclose) === null || _a === void 0 ? void 0 : _a.call(this);
    this.scope.removeAll();
    this.ctx.close(this);
    if (this.isReusable) {
      this.update();
    } else {
      this.destroy();
    }
  }
  destroy() {
    this._isDestroyed = true;
    this.unmountJsx();
  }
  unmountJsx() {
    G(null, this.el);
  }
  update() {
    this._update();
  }
  updateJSX(jsx) {
    try {
      if (!this._isDestroyed) {
        this.renderToDialog(jsx);
      }
      this._update();
    } catch (error) {
      exception(`Error rendering ${this.dlgName}: ${error.message}`);
      this.close(false);
    }
  }
  _update() {
    var _a, _b;
    if (this._isDestroyed) {
      if (this.updatesAfterDestroy++ === 10) {
        exception(new Error(`${this.dlgName}: DESTROYED_UPDATE`));
      }
      this.unmountJsx();
      return;
    }
    if (!this.el) return;
    this._needsUpdate = false;
    (_a = this.ctx.imageLoader) === null || _a === void 0 ? void 0 : _a.dlgUpdate(this.el);
    (_b = this.ctx.photoLoader) === null || _b === void 0 ? void 0 : _b.dlgUpdate(this.el);
    this.updateScroll();
  }
  get animationManager() {
    return this.ctx.animationManager;
  }
  updateScroll() {
    if (!this.useScrollBorder) return;
    const content = this.jsx_content || this.el.querySelector('.js-content');
    if (!content) return;
    if (!content.getAttribute('border-scroll-event')) {
      content.addEventListener('scroll', () => this.updateScroll());
      content.setAttribute('border-scroll-event', 'listening');
    }
    const header = this.jsx_headerShowScrollBorder && this.jsx_header || this.el.querySelector('.js-header');
    if (header) {
      header.classList.toggle('popup__border--bottom', content.scrollTop > 0);
    }
    const footer = this.jsx_footerShowScrollBorder && this.jsx_footer || this.el.querySelector('.js-actions') || this.jsx_butttonsShowScrollBorder && this.jsx_buttons || this.el.querySelector('.js-buttons') || this.el.querySelector('.js-footer');
    if (footer) {
      const scrollBottom = content.scrollTop + content.offsetHeight;
      footer.classList.toggle('popup__border--top', scrollBottom < content.scrollHeight);
    }
  }
  renderToDialog(jsx) {
    G(preact_module_(Context.Provider, {
      value: this
    }, jsx), this.el);
  }
}
Dialog.Button = Button;
Dialog.Header = Header;
Dialog.PhotoBg = PhotoBg;
Dialog.Context = Context;
Dialog.useDialog = useDialog;
Dialog.useDialogContext = useDialogContext;

// ;// ./js/presenters/dialogs/TopsPresenter.ts içinden  (orijinal)
export function getTopString(category, period) {
  return period ? `${category}:${period}` : category;
}
export const TOP_TAB_CONFIG = {
  total_kisses: {
    periods: ['', 'monthly', 'weekly', 'daily']
  },
  dj_score: {
    periods: ['', 'monthly', 'weekly', 'daily']
  },
  price: {
    periods: ['']
  },
  harem_price: {
    periods: ['']
  },
  gestures: {
    periods: ['', 'monthly', 'weekly', 'daily']
  },
  glv: {
    periods: ['']
  },
  activity: {
    periods: ['']
  }
};
export const categories = Object.keys(TOP_TAB_CONFIG);
