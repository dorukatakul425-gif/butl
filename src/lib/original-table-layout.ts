// @ts-nocheck
// Unmodified layout.ts extracted from preloader.fa928eddbe11.js, lines 126666–126962.
const VIRTUAL_SIZE = 375;
const EMPTY_SAFE_AREA = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
function getPlayerParams(embeddedPlayerSupported, frameWidth, frameHeight, chatWidth, chatX) {
  const isPortrait = frameWidth <= frameHeight;
  const isLarge = isPortrait ? frameWidth > 600 : frameHeight > 800;
  let position = isPortrait ? 'portrait' : 'center';
  if (!isPortrait && embeddedPlayerSupported) {
    return {
      position: 'embedded',
      isLarge: false,
      width: chatWidth,
      height: Math.min(chatWidth / 1.77, frameHeight * 0.27),
      x: chatX,
      y: 0
    };
  }
  if (!isPortrait) {
    if (isLarge && chatWidth < 470) position = embeddedPlayerSupported ? 'embedded' : 'right';else if (isLarge && chatWidth >= 470 && chatWidth < 650) position = 'right';else if (isLarge && chatWidth >= 650) position = 'center';else if (!isLarge && chatWidth < 375) position = embeddedPlayerSupported ? 'embedded' : 'right';else if (!isLarge && chatWidth >= 375 && chatWidth < 550) position = 'right';else if (!isLarge && chatWidth >= 550) position = 'center';
  }
  return {
    position,
    isLarge,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
}
function getLayout(width, height, playerVisible, supportEmbeddedPlayer, customTableLayout) {
  let safeArea = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EMPTY_SAFE_AREA;
  if (width <= 100) width = 100;
  if (height <= 100) height = 100;
  const unsafeFrame = {
    x: 0,
    y: 0,
    width,
    height
  };
  const awvSW = Math.min(width, height);
  width -= safeArea.left + safeArea.right;
  height -= safeArea.top + safeArea.bottom;
  const dpr = window.devicePixelRatio;
  const frame = {
    x: safeArea.left,
    y: safeArea.top,
    width,
    height
  };
  const isHeaderSmall = Math.min(width, height) <= 500;
  const headerSize = isHeaderSmall ? 48 : 84;
  const landscapeWide = () => {
    const tableSize = height;
    const chatWidth = width - (headerSize + tableSize) + safeArea.right;
    const chatX = safeArea.left + headerSize + tableSize;
    const playerLayout = getPlayerParams(supportEmbeddedPlayer, width, height, chatWidth, chatX);
    const chatOffset = playerVisible ? playerLayout.height : 0;
    const bgSize = tableSize + 2 * (safeArea.left + headerSize);
    return {
      unsafeFrame,
      awvSW,
      frame,
      isLandscape: true,
      isHeaderUp: false,
      isHeaderSmall,
      pixiScale: dpr * tableSize / VIRTUAL_SIZE,
      tableScale: tableSize / VIRTUAL_SIZE,
      dpr,
      safeArea,
      game: {
        x: 0,
        y: 0,
        width: safeArea.left + headerSize + tableSize,
        height: tableSize
      },
      tutorial: {
        x: safeArea.left,
        y: 0,
        width: headerSize + tableSize,
        height: tableSize
      },
      background: {
        x: safeArea.left + headerSize + tableSize / 2,
        y: tableSize / 2,
        width: bgSize,
        height: bgSize
      },
      header: {
        x: safeArea.left,
        y: 0,
        width: headerSize,
        height: tableSize
      },
      table: {
        x: safeArea.left + headerSize,
        y: 0,
        width: tableSize,
        height: tableSize
      },
      chat: {
        x: safeArea.left + headerSize + tableSize,
        y: chatOffset,
        width: chatWidth,
        height: height - chatOffset
      },
      player: playerLayout
    };
  };
  const landscapeNarrow = () => {
    const tableSize = height - headerSize;
    const bgSize = tableSize + 2 * Math.max(safeArea.left, headerSize);
    const chatWidth = width - tableSize + safeArea.right;
    const chatX = safeArea.left + tableSize;
    const playerLayout = getPlayerParams(supportEmbeddedPlayer, width, height, chatWidth, chatX);
    const chatOffset = playerVisible ? playerLayout.height : 0;
    return {
      unsafeFrame,
      awvSW,
      frame,
      isLandscape: true,
      isHeaderUp: true,
      isHeaderSmall,
      pixiScale: dpr * tableSize / VIRTUAL_SIZE,
      tableScale: tableSize / VIRTUAL_SIZE,
      dpr,
      safeArea,
      game: {
        x: 0,
        y: 0,
        width: safeArea.left + tableSize,
        height: headerSize + tableSize
      },
      tutorial: {
        x: safeArea.left,
        y: 0,
        width: tableSize,
        height: headerSize + tableSize
      },
      background: {
        x: safeArea.left + tableSize / 2,
        y: headerSize + tableSize / 2,
        width: bgSize,
        height: bgSize
      },
      header: {
        x: safeArea.left,
        y: 0,
        width: tableSize,
        height: headerSize
      },
      table: {
        x: safeArea.left,
        y: headerSize,
        width: tableSize,
        height: tableSize
      },
      chat: {
        x: chatX,
        y: chatOffset,
        width: chatWidth,
        height: height - chatOffset
      },
      player: playerLayout
    };
  };
  const portraitWide = () => {
    const tableSize = width;
    const bgSize = tableSize + 2 * (safeArea.top + headerSize);
    return {
      unsafeFrame,
      awvSW,
      frame,
      isLandscape: false,
      isHeaderUp: true,
      isHeaderSmall,
      pixiScale: dpr * tableSize / VIRTUAL_SIZE,
      tableScale: tableSize / VIRTUAL_SIZE,
      dpr,
      safeArea,
      game: {
        x: 0,
        y: 0,
        width: tableSize,
        height: safeArea.top + headerSize + tableSize
      },
      tutorial: {
        x: 0,
        y: safeArea.top,
        width: tableSize,
        height: headerSize + tableSize
      },
      background: {
        x: tableSize / 2,
        y: safeArea.top + headerSize + tableSize / 2,
        width: bgSize,
        height: bgSize
      },
      header: {
        x: 0,
        y: safeArea.top,
        width: tableSize,
        height: headerSize
      },
      table: {
        x: 0,
        y: safeArea.top + headerSize,
        width: tableSize,
        height: tableSize
      },
      chat: {
        x: 0,
        y: safeArea.top + headerSize + tableSize,
        width: width,
        height: height - (headerSize + tableSize) + safeArea.bottom
      },
      player: getPlayerParams(supportEmbeddedPlayer, width, height, width, 0)
    };
  };
  const portraitNarrow = () => {
    const tableSize = width - headerSize;
    const bgSize = tableSize + 2 * Math.max(safeArea.top, headerSize);
    return {
      unsafeFrame,
      awvSW,
      frame,
      isLandscape: false,
      isHeaderUp: false,
      isHeaderSmall,
      pixiScale: dpr * tableSize / VIRTUAL_SIZE,
      tableScale: tableSize / VIRTUAL_SIZE,
      dpr,
      safeArea,
      game: {
        x: 0,
        y: 0,
        width: headerSize + tableSize,
        height: safeArea.top + tableSize
      },
      tutorial: {
        x: 0,
        y: safeArea.top,
        width: headerSize + tableSize,
        height: tableSize
      },
      background: {
        x: headerSize + tableSize / 2,
        y: safeArea.top + tableSize / 2,
        width: bgSize,
        height: bgSize
      },
      header: {
        x: 0,
        y: safeArea.top,
        width: headerSize,
        height: tableSize
      },
      table: {
        x: headerSize,
        y: safeArea.top,
        width: tableSize,
        height: tableSize
      },
      chat: {
        x: 0,
        y: safeArea.top + tableSize,
        width: width,
        height: height - tableSize + safeArea.bottom
      },
      player: getPlayerParams(supportEmbeddedPlayer, width, height, width, 0)
    };
  };
  const isLandscape = width >= height;
  const isWide = (() => {
    if (customTableLayout === 'awv') return awvSW < 600;
    return isLandscape ? width / height > 4 / 3 : height / width > 4 / 3;
  })();
  if (isLandscape) {
    return isWide ? landscapeWide() : landscapeNarrow();
  } else {
    if (customTableLayout === 'tgdesktop') return portraitNarrow();
    return isWide ? portraitWide() : portraitNarrow();
  }
}

export { getLayout };
