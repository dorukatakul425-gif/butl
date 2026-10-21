// @ts-nocheck
// ;// ./js/html/dialogs/TopsDialog.tsx
// Orijinal Ciliz paketinden (preloader.fa928eddbe11.js, satır 139385-139681) birebir çıkarıldı.
import {
  preact_module_, preact_module_k, hooks_module_A, hooks_module_d, hooks_module_q,
  hooks_module_y, compat_module_D, bem, Dialog, Swiper, splitThousands,
  getTopString, TOP_TAB_CONFIG, categories
} from './runtime';

const TopsDialog_cls = bem('top-dlg');
function parseTopPosition(topPosition) {
  const [category, period] = topPosition.split(':');
  return {
    page: categories.indexOf(category),
    period: period || ''
  };
}
function getInitialTopPosition(startCategory, savedTopSection) {
  if (startCategory) {
    return {
      page: categories.indexOf(startCategory),
      period: ''
    };
  } else if (savedTopSection) {
    return parseTopPosition(savedTopSection);
  }
  return {
    page: 0,
    period: ''
  };
}
export class TopsDialog extends Dialog {
  constructor(ctx, p) {
    super(ctx, 'TopsDialog');
    this.p = p;
    this.JSX = props => {
      var _a;
      const dlg = Dialog.useDialog();
      const tabsRef = hooks_module_A(null);
      const swiperRef = hooks_module_A(null);
      const [topPosition, setTopPosition] = hooks_module_d(() => getInitialTopPosition(props.startCategory, props.savedTopSection));
      const category = categories[topPosition.page];
      const periodDropdownOptions = props.periodsOptions[category];
      const loading = !((_a = props.tops) === null || _a === void 0 ? void 0 : _a[category]) || props.tops[category].length === 0;
      const onPageChanged = hooks_module_q(newPage => {
        props.onsection(getTopString(categories[newPage], topPosition.period));
      }, [topPosition]);
      const refCallback = el => {
        if (!el) {
          return;
        }
        if (!swiperRef.current) {
          const newSwiper = new Swiper(el, {
            animationManager: this.animationManager,
            disableScrollByWheel: true
          });
          newSwiper.setInitialPage(topPosition.page);
          swiperRef.current = newSwiper;
        }
      };
      hooks_module_y(() => {
        return () => {
          var _a;
          (_a = swiperRef.current) === null || _a === void 0 ? void 0 : _a.destroy();
        };
      }, []);
      hooks_module_y(() => {
        if (swiperRef.current) {
          swiperRef.current.onPageChanged = newPage => {
            setTopPosition(old => {
              if (old.page !== newPage) {
                onPageChanged(newPage);
              }
              const newTopPosition = Object.assign(Object.assign({}, old), {
                page: newPage
              });
              props.onsection(getTopString(categories[newPage], newTopPosition.period));
              return newTopPosition;
            });
          };
        }
      }, [swiperRef, onPageChanged]);
      const onChangeSelectedPeriod = period => {
        const newTopPosition = Object.assign(Object.assign({}, topPosition), {
          period: period
        });
        setTopPosition(newTopPosition);
        props.onsection(getTopString(category, newTopPosition.period));
      };
      return preact_module_(preact_module_k, null, preact_module_(Dialog.Header, {
        onClose: () => dlg.close(),
        headerClass: TopsDialog_cls('x_popup__header'),
        closeIconClass: TopsDialog_cls('x_popup__close-icon')
      }, preact_module_(HelpButton, {
        onHelp: props.onhelp,
        category: category
      }), preact_module_("div", {
        class: TopsDialog_cls('tabs'),
        style: {
          pointerEvents: loading ? 'none' : 'auto'
        },
        ref: tabsRef
      }, categories.map((tagCategory, idx) => preact_module_("div", {
        key: tagCategory,
        class: TopsDialog_cls('tab', [tagCategory, category !== tagCategory ? `${tagCategory}-inactive` : '']),
        onClick: () => {
          var _a;
          (_a = swiperRef.current) === null || _a === void 0 ? void 0 : _a.scrollToPage(idx);
        }
      }))), preact_module_("div", {
        class: TopsDialog_cls('desc')
      }, preact_module_("div", {
        class: TopsDialog_cls('title')
      }, props.titles[category]), TOP_TAB_CONFIG[category].periods.length > 1 && preact_module_(TopsDialog_Dropdown, {
        loadingTimeout: loading,
        value: topPosition.period,
        options: periodDropdownOptions,
        onSelect: selected => onChangeSelectedPeriod(selected)
      }))), preact_module_("div", {
        ref: refCallback,
        class: TopsDialog_cls('swiper'),
        style: {
          pointerEvents: loading ? 'none' : 'auto'
        }
      }, categories.map(category => {
        var _a, _b;
        let topString;
        if (TOP_TAB_CONFIG[category].periods.indexOf(topPosition.period) !== -1) {
          topString = getTopString(category, topPosition.period);
        } else {
          topString = getTopString(category);
        }
        return preact_module_(TopList, {
          section: topString,
          top: (_b = (_a = props.tops) === null || _a === void 0 ? void 0 : _a[topString]) !== null && _b !== void 0 ? _b : [],
          onuser: props.onuser,
          topBorderLabel: props.topBorderLabel
        });
      })), loading && preact_module_("div", {
        class: TopsDialog_cls('loading')
      }, preact_module_("div", {
        class: TopsDialog_cls('loading-icon')
      })));
    };
    this.onroot = () => this.close();
    this.useScrollBorder = false;
    this.el = document.createElement('div');
    this.el.style.position = 'absolute';
    this.el.classList.add('popup', TopsDialog_cls('x_popup'));
  }
  update() {
    this.updateJSX(preact_module_(this.JSX, Object.assign({}, this.p)));
  }
  setParams(params) {
    this.p = params;
    this.update();
  }
}
function cmpCategories(a, b) {
  return categories.indexOf(a) - categories.indexOf(b);
}
const HelpButton = _ref => {
  let {
    onHelp,
    category
  } = _ref;
  const leftRef = hooks_module_A(null);
  const rightRef = hooks_module_A(null);
  const [lastCategory, setLastCategory] = hooks_module_d(category);
  const [isFirstRender, setIsFirstRender] = hooks_module_d(true);
  hooks_module_y(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    const dir = cmpCategories(category, lastCategory);
    setLastCategory(category);
    leftRef.current.classList.remove(...TopsDialog_cls('help-icon', ['left-hide', 'left-show'], true).split(' '));
    rightRef.current.classList.remove(...TopsDialog_cls('help-icon', ['right-hide', 'right-show'], true).split(' '));
    leftRef.current.offsetHeight;
    rightRef.current.offsetHeight;
    if (dir < 0) {
      rightRef.current.classList.add(TopsDialog_cls('help-icon', ['right-hide'], true));
      leftRef.current.classList.add(TopsDialog_cls('help-icon', ['left-show'], true));
    } else if (dir > 0) {
      rightRef.current.classList.add(TopsDialog_cls('help-icon', ['right-show'], true));
      leftRef.current.classList.add(TopsDialog_cls('help-icon', ['left-hide'], true));
    }
  }, [category]);
  return preact_module_("div", {
    class: TopsDialog_cls('help'),
    onClick: () => onHelp(category)
  }, preact_module_("div", {
    class: TopsDialog_cls('help-icon'),
    ref: leftRef
  }), preact_module_("div", {
    class: TopsDialog_cls('help-icon'),
    ref: rightRef
  }));
};
const TopList = props => {
  const category = props.section.split(':')[0];
  const viewerElementRef = hooks_module_A(null);
  const els = props.top.map(t => preact_module_(TopsDialog_Item, {
    key: t.id,
    user: t,
    category: category,
    onuser: props.onuser,
    ref: t.isViewer ? viewerElementRef : undefined
  }));
  const updateViewerElementBorder = () => {
    var _a, _b, _c;
    const sticky = (_a = viewerElementRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    const parent = (_c = (_b = viewerElementRef.current) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect();
    if (viewerElementRef.current && sticky && parent) {
      viewerElementRef.current.classList.remove(TopsDialog_cls('item', ['stuck-top'], true));
      viewerElementRef.current.classList.remove(TopsDialog_cls('item', ['stuck-bottom'], true));
      if (Math.floor(sticky.bottom) > Math.floor(parent.bottom)) {
        viewerElementRef.current.classList.add(TopsDialog_cls('item', ['stuck-bottom'], true));
      } else if (Math.floor(sticky.top) < Math.floor(parent.top)) {
        viewerElementRef.current.classList.add(TopsDialog_cls('item', ['stuck-top'], true));
      }
    }
  };
  hooks_module_y(() => {
    updateViewerElementBorder();
  });
  return preact_module_("div", {
    class: `${TopsDialog_cls('content')} ${TopsDialog_cls('bg')}`,
    onScroll: () => updateViewerElementBorder()
  }, [...els.slice(0, 10), ...(els.length > 10 ? [Border(props.topBorderLabel, 10, 25)] : []), ...els.slice(10, 25), ...(els.length > 25 ? [Border(props.topBorderLabel, 25, 50)] : []), ...els.slice(25)]);
};
const TopsDialog_Item = compat_module_D((_ref2, ref) => {
  let {
    user,
    category,
    onuser
  } = _ref2;
  var _a;
  return preact_module_("div", {
    ref: ref,
    class: TopsDialog_cls('item', user.isViewer ? ['sticked'] : [])
  }, preact_module_(Dialog.PhotoBg, {
    class: TopsDialog_cls('photo'),
    url: (_a = user.photo_url) !== null && _a !== void 0 ? _a : '',
    onClick: () => onuser(user.id)
  }), preact_module_("div", {
    class: TopsDialog_cls('user-info', user.isViewer ? ['viewer'] : [])
  }, preact_module_("div", {
    class: TopsDialog_cls('rank')
  }, user.rank ? user.rank + '. ' : ''), preact_module_("div", {
    class: TopsDialog_cls('name'),
    onClick: () => onuser(user.id)
  }, user.name), preact_module_("div", {
    class: TopsDialog_cls('icon', [category])
  }), preact_module_("div", {
    class: TopsDialog_cls('score', [category])
  }, splitThousands(user.score))));
});
const Border = (label, start, end) => preact_module_("div", {
  class: TopsDialog_cls('top-border')
}, preact_module_("div", {
  class: TopsDialog_cls('border-label')
}, label.replace('<top>', `${start}`)), preact_module_("div", {
  class: TopsDialog_cls('border-label')
}, label.replace('<top>', `${end}`)));
const TopsDialog_Dropdown = p => {
  const [intervalSelectorOpen, setIntervalSelectorOpen] = hooks_module_d(false);
  const selectedOption = p.options.find(option => option.key === p.value);
  return preact_module_("div", {
    class: `${TopsDialog_cls('custom-select')} ${intervalSelectorOpen ? 'opened' : ''}`,
    style: {
      pointerEvents: p.loadingTimeout ? 'none' : 'auto',
      display: 'inline-block'
    }
  }, preact_module_("div", {
    class: TopsDialog_cls('custom-select-trigger'),
    onClick: e => {
      e.stopPropagation();
      const cb = () => {
        document.removeEventListener('click', cb);
        setIntervalSelectorOpen(intervalSelectorOpen);
      };
      if (!intervalSelectorOpen) document.addEventListener('click', cb);
      setIntervalSelectorOpen(!intervalSelectorOpen);
    }
  }, selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.title), preact_module_("div", {
    class: TopsDialog_cls('custom-options')
  }, p.options.map(interval => preact_module_("div", {
    key: interval,
    class: TopsDialog_cls('custom-option', interval.key === p.value ? ['selected'] : []),
    onClick: () => p.onSelect(interval.key)
  }, interval.title, preact_module_("div", {
    class: TopsDialog_cls('selected-icon')
  })))));
};
