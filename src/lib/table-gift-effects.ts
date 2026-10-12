export const TABLE_VFX_DATA: Record<string, { types: Record<string, Set<string>>; filters: Record<string, number> }> = {
  balloon1: {
    types: {
      gifts: new Set(['leninbadge']),
      hats: new Set(['lenincap'])
    },
    filters: {
      gifts: 10,
      hats: 9
    }
  },
  balloon2: {
    types: {
      drinks: new Set(['smilecup']),
      gifts: new Set(['smile'])
    },
    filters: {
      drinks: 10,
      gifts: 11
    }
  },
  confetti: {
    types: {
      drinks: new Set(['birthdaycake']),
      hats: new Set(['partyhat'])
    },
    filters: {
      drinks: 9,
      hats: 9
    }
  },
  flower: {
    types: {
      drinks: new Set(['perfume', 'springcocktail']),
      gifts: new Set(['rosep', 'roser', 'rosew'])
    },
    filters: {
      drinks: 9,
      gifts: 11
    }
  },
  ghost: {
    types: {
      drinks: new Set(['brainicecream', 'candle', 'tarantula']),
      gifts: new Set(['ghost', 'pumpkin']),
      hats: new Set(['witch'])
    },
    filters: {
      drinks: 12,
      gifts: 12,
      hats: 12
    }
  },
  heart: {
    types: {
      drinks: new Set(['romanticcandle']),
      gifts: new Set(['valentine'])
    },
    filters: {
      drinks: 9,
      gifts: 9
    }
  },
  heart2: {
    types: {
      drinks: new Set(['lipstick', 'romanticcandle']),
      gifts: new Set(['bikinibottom', 'bikinitop', 'swimmers'])
    },
    filters: {
      drinks: 8,
      gifts: 10
    }
  },
  leaf: {
    types: {
      drinks: new Set(['mushroomsbasket']),
      gifts: new Set(['leaf']),
      hats: new Set(['wreath'])
    },
    filters: {
      drinks: 9,
      gifts: 11,
      hats: 9
    }
  },
  pacifier: {
    types: {
      gifts: new Set(['bomb']),
      hats: new Set(['clownhat', 'ololosh'])
    },
    filters: {
      hats: 9,
      gifts: 11
    }
  },
  photo: {
    types: {
      drinks: new Set(['camera']),
      gifts: new Set(['polaroid'])
    },
    filters: {
      drinks: 7,
      gifts: 11
    }
  },
  roll: {
    types: {
      gifts: new Set(['trout']),
      drinks: new Set(['japaneseroll', 'japaneseset', 'japanesesushi'])
    },
    filters: {
      gifts: 11,
      drinks: 6
    }
  },
  snow: {
    types: {
      hats: new Set(['winterhat']),
      drinks: new Set(['christmasball', ...Array.from({ length: 8 }, (_, i) => `snowman${i + 1}`)])
    },
    filters: {
      hats: 6,
      drinks: 6
    }
  },
  sock: {
    types: {
      drinks: new Set(['canteen']),
      gifts: new Set(['goldstar']),
      hats: new Set(['budenovka', 'hatservice', 'hatvdv', 'helmet', 'tankhelmet'])
    },
    filters: {
      drinks: 6,
      gifts: 11,
      hats: 9
    }
  }
};
export function matchingTableEffects(sticks: readonly (readonly string[])[]) {
  if (sticks.length !== 12) return [];
  return Object.entries(TABLE_VFX_DATA).filter(([, data]) =>
    Object.entries(data.filters).every(([key, count]) =>
      sticks.filter(types => types.some(type => data.types[key]?.has(type))).length >= count
    )
  ).map(([name]) => name);
}
