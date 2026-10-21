import { i as __toESM } from "../_runtime.mjs";
import { t as DEFAULT_APPEARANCE } from "./player-appearance-BO0_Ac72.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as azerbaijaniGameDictionary } from "./game-language-BY9iR37b.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/player-name-Cyu_I4Wa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initial = {
	progress: 10,
	ready: false,
	error: false
};
var state = initial;
var completed = /* @__PURE__ */ new Set();
var listeners = /* @__PURE__ */ new Set();
var weights = {
	server: 10,
	assets: 15,
	renderer: 25,
	icons: 20,
	bottle: 15,
	artwork: 5
};
function completeLoadingStage(stage) {
	completed.add(stage);
	state = {
		progress: 10 + [...completed].reduce((sum, key) => sum + weights[key], 0),
		ready: completed.size === 6,
		error: false
	};
	listeners.forEach((listener) => listener());
}
function failGameLoading() {
	state = {
		...state,
		error: true
	};
	listeners.forEach((listener) => listener());
}
function useGameLoading() {
	return (0, import_react.useSyncExternalStore)((listener) => {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	}, () => state, () => initial);
}
var CUSTOM_FRAMES = {
	cf_42: {
		"html": "/custom-frames/42_3_female.anim.png",
		"sheet": "/custom-frames/42_3_female.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 4,
					"y0": 21,
					"x1": 123,
					"y1": 149
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_59: {
		"html": "/custom-frames/59_1_female.anim.png",
		"sheet": "/custom-frames/59_1_female.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 50,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"cut": {
				"frames": 50,
				"of": 100
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 2,
					"y0": 26,
					"x1": 126,
					"y1": 149
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_63: {
		"html": "/custom-frames/63_1_male.anim.png",
		"sheet": "/custom-frames/63_1_male.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 1,
					"y0": 25,
					"x1": 126,
					"y1": 150
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_64: {
		"html": "/custom-frames/64_1_male.anim.png",
		"sheet": "/custom-frames/64_1_male.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 4,
					"y0": 28,
					"x1": 124,
					"y1": 146
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_92: {
		"html": "/custom-frames/92_1_female.anim.png",
		"sheet": "/custom-frames/92_1_female.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 9,
					"y0": 34,
					"x1": 119,
					"y1": 146
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_95: {
		"html": "/custom-frames/95_1_male.anim.png",
		"sheet": "/custom-frames/95_1_male.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 6,
					"y0": 30,
					"x1": 122,
					"y1": 148
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_169: {
		"html": "/custom-frames/169_1_female.anim.png",
		"sheet": "/custom-frames/169_1_female.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 1,
					"y0": 25,
					"x1": 127,
					"y1": 152
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_186: {
		"html": "/custom-frames/186_1_all.anim.png",
		"sheet": "/custom-frames/186_1_all.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 50,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"cut": {
				"frames": 50,
				"of": 100
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 1,
					"y0": 25,
					"x1": 127,
					"y1": 151
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_263: {
		"html": "/custom-frames/263_1_all.anim.png",
		"sheet": "/custom-frames/263_1_all.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 50,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"cut": {
				"frames": 50,
				"of": 100
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 0,
					"y0": 28,
					"x1": 128,
					"y1": 152
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_402: {
		"html": "/custom-frames/402_1_male.anim.png",
		"sheet": "/custom-frames/402_1_male.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 1,
					"y0": 26,
					"x1": 127,
					"y1": 150
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_781: {
		"html": "/custom-frames/781_1_all.anim.png",
		"sheet": "/custom-frames/781_1_all.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 2,
					"y0": 26,
					"x1": 126,
					"y1": 150
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_1112: {
		"html": "/custom-frames/1112_1_all.anim.png",
		"sheet": "/custom-frames/1112_1_all.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 50,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"cut": {
				"frames": 50,
				"of": 100
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 3,
					"y0": 26,
					"x1": 126,
					"y1": 150
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_1121: {
		"html": "/custom-frames/1121_1_all.anim.png",
		"sheet": "/custom-frames/1121_1_all.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 1,
					"y0": 27,
					"x1": 127,
					"y1": 150
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_1133: {
		"html": "/custom-frames/1133_1_all.anim.png",
		"sheet": "/custom-frames/1133_1_all.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 50,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"cut": {
				"frames": 50,
				"of": 100
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 0,
					"y0": 25,
					"x1": 128,
					"y1": 152
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_1135: {
		"html": "/custom-frames/1135_1_all.anim.png",
		"sheet": "/custom-frames/1135_1_all.thin.png",
		"meta": {
			"width": 106,
			"height": 106,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 5,
				"y": 5,
				"w": 96,
				"h": 96
			},
			"thin": {
				"band": 5,
				"from": {
					"x0": 3,
					"y0": 29,
					"x1": 127,
					"y1": 147
				},
				"box": {
					"x": 16,
					"y": 40,
					"w": 96,
					"h": 96
				}
			}
		}
	},
	cf_131: {
		"sheet": "/custom-frames/131_1_female.sheet.png",
		"meta": {
			"width": 128,
			"height": 152,
			"cols": 10,
			"rows": 10,
			"count": 100,
			"loop": 0,
			"delays": [
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30,
				40,
				30,
				30
			],
			"window": {
				"x": 21,
				"y": 48,
				"w": 76,
				"h": 85
			}
		}
	}
};
/** Level frames sent by the ureyimsen server (level_frames.list): unlocked at this gift level. */
var LEVEL_FRAMES = [
	{
		key: "cf_42",
		level: 20
	},
	{
		key: "cf_59",
		level: 26
	},
	{
		key: "cf_63",
		level: 31
	},
	{
		key: "cf_64",
		level: 37
	},
	{
		key: "cf_92",
		level: 43
	},
	{
		key: "cf_95",
		level: 49
	},
	{
		key: "cf_169",
		level: 54
	},
	{
		key: "cf_186",
		level: 60
	},
	{
		key: "cf_263",
		level: 66
	},
	{
		key: "cf_402",
		level: 71
	},
	{
		key: "cf_781",
		level: 77
	},
	{
		key: "cf_1112",
		level: 83
	},
	{
		key: "cf_1121",
		level: 89
	},
	{
		key: "cf_1133",
		level: 94
	},
	{
		key: "cf_1135",
		level: 100
	}
];
function getCustomFrame(key) {
	return CUSTOM_FRAMES[key] ?? null;
}
var IMAGE_PREFIX = "cfimg_";
var customFrameImageName = (key) => IMAGE_PREFIX + key;
function customFrameKeyOfImage(name) {
	const key = name.indexOf(IMAGE_PREFIX) === 0 ? name.slice(6) : "";
	return CUSTOM_FRAMES[key] ? key : "";
}
function customFrameLayout(frame) {
	const win = frame.meta.window;
	const s = 64 / win.w;
	return {
		s,
		w: frame.meta.width * s,
		h: frame.meta.height * s,
		left: -64 / 2 - win.x * s,
		top: -64 / 2 - win.y * s
	};
}
/** hi.url(): animated image URL for a custom frame image name (also its _store variant). */
function customFrameUrl(name) {
	const key = customFrameKeyOfImage(String(name).replace(/_store$/, ""));
	if (!key) return "";
	const frame = CUSTOM_FRAMES[key];
	return frame.html || frame.sheet;
}
/** hi.inject(): registers every custom frame as a regular game frame + image meta. */
function injectCustomFrames(assets) {
	const k = 1 / ASSETS_TO_VIRTUAL;
	for (const key of Object.keys(CUSTOM_FRAMES)) {
		const frame = CUSTOM_FRAMES[key];
		const l = customFrameLayout(frame);
		const image = customFrameImageName(key);
		assets.images[image] = { size: [
			l.left * k,
			l.top * k,
			l.w * k,
			l.h * k
		] };
		assets.images[`${image}_store`] = { size: [
			0,
			0,
			42 * frame.meta.width / frame.meta.height,
			42
		] };
		assets.frames[key] = {
			type: key,
			image,
			storeImage: `${image}_store`,
			storeImage_v2: `${image}_store`,
			custom: key
		};
	}
}
/** pd.isOpen() for an account without purchases: gift level reaches the frame level. */
function isLevelFrameOpen(level, giftLevel) {
	return giftLevel >= level;
}
var source_normal_gifts_data_default = {
	provenance: "ureyimsen.com/game-v2 runtime gifts.__store, captured 2026-10-20; non-premium additions only",
	entries: [
		{ "id": "3september" },
		{ "id": "abcbook" },
		{ "id": "amurchik" },
		{ "id": "angelgift" },
		{ "id": "apple" },
		{ "id": "armytea" },
		{ "id": "astronaut" },
		{ "id": "astronomy" },
		{ "id": "babycocktail" },
		{ "id": "baloon" },
		{ "id": "banana" },
		{ "id": "baranki" },
		{ "id": "baseball1" },
		{ "id": "baseball2" },
		{ "id": "baseball3" },
		{ "id": "baseball4" },
		{ "id": "baseball5" },
		{ "id": "baseball6" },
		{ "id": "baseballde" },
		{ "id": "baseballtr" },
		{ "id": "baseballua" },
		{ "id": "baseballus" },
		{ "id": "batmanhat" },
		{ "id": "bayanist" },
		{ "id": "bbq" },
		{ "id": "bear6" },
		{ "id": "berries" },
		{ "id": "bikinibottom" },
		{ "id": "bikinitop" },
		{ "id": "bomb" },
		{ "id": "boxingglove" },
		{ "id": "brainicecream" },
		{ "id": "bretzel" },
		{ "id": "budenovka" },
		{ "id": "builderhat" },
		{ "id": "camera" },
		{ "id": "candle" },
		{ "id": "canteen" },
		{ "id": "caviar" },
		{ "id": "chemistry" },
		{ "id": "cherrypie" },
		{ "id": "chess" },
		{ "id": "chinese" },
		{ "id": "chocolate" },
		{ "id": "christmasball" },
		{ "id": "christmasbell" },
		{ "id": "christmassock" },
		{ "id": "clover" },
		{ "id": "clownhat" },
		{ "id": "colamentos" },
		{ "id": "comet" },
		{ "id": "compass" },
		{ "id": "cook" },
		{ "id": "cooler" },
		{ "id": "cosmohelmet" },
		{ "id": "cuckooclock" },
		{ "id": "darthvader" },
		{ "id": "deerhorns" },
		{ "id": "diamond" },
		{ "id": "diamondgift" },
		{ "id": "dinosaur" },
		{ "id": "djcap" },
		{ "id": "donut" },
		{ "id": "doshirak" },
		{ "id": "dove" },
		{ "id": "drinkaz" },
		{ "id": "drinkby" },
		{ "id": "drinkge" },
		{ "id": "drinkkg" },
		{ "id": "drinkkz" },
		{ "id": "drinkru" },
		{ "id": "drinkua" },
		{ "id": "drinkus" },
		{ "id": "drinkuz" },
		{ "id": "ears9b" },
		{ "id": "ears9c" },
		{ "id": "eastercake" },
		{ "id": "easteregg" },
		{ "id": "eggplant" },
		{ "id": "eggsbasket" },
		{ "id": "eggskiss" },
		{ "id": "elephant" },
		{ "id": "elvis" },
		{ "id": "extinguisher" },
		{ "id": "faberge" },
		{ "id": "fern" },
		{ "id": "fire" },
		{ "id": "firehorse" },
		{ "id": "fireman" },
		{ "id": "flagby" },
		{ "id": "flagca" },
		{ "id": "flagde" },
		{ "id": "flages" },
		{ "id": "flagge" },
		{ "id": "flaghr" },
		{ "id": "flagkg" },
		{ "id": "flagkz" },
		{ "id": "flagru" },
		{ "id": "flagtr" },
		{ "id": "flagua" },
		{ "id": "flagus" },
		{ "id": "flaguz" },
		{ "id": "flowerwreath" },
		{ "id": "football" },
		{ "id": "footballcup" },
		{ "id": "fruitbasket2" },
		{ "id": "fruitbasket3" },
		{ "id": "fruitbasket4" },
		{ "id": "funnyanimal" },
		{ "id": "gascan" },
		{ "id": "ghost" },
		{ "id": "gingy" },
		{ "id": "glintwein" },
		{ "id": "globe" },
		{ "id": "goldpot" },
		{ "id": "goldstar" },
		{ "id": "grog" },
		{ "id": "groundhog" },
		{ "id": "guitar" },
		{ "id": "hatservice" },
		{ "id": "hatvdv" },
		{ "id": "heartlock" },
		{ "id": "helmet" },
		{ "id": "hockey1" },
		{ "id": "hockey2" },
		{ "id": "hockey3" },
		{ "id": "hockey4" },
		{ "id": "hockeycup" },
		{ "id": "holigrenade" },
		{ "id": "hotdog" },
		{ "id": "japaneseroll" },
		{ "id": "japaneseset" },
		{ "id": "japanesesushi" },
		{ "id": "kinder" },
		{ "id": "leaf" },
		{ "id": "leninbadge" },
		{ "id": "lenincap" },
		{ "id": "lepricon" },
		{ "id": "liberty" },
		{ "id": "lionet" },
		{ "id": "lipstick" },
		{ "id": "louboutin" },
		{ "id": "lovecompote" },
		{ "id": "lovepotion" },
		{ "id": "magichat" },
		{ "id": "mandarin" },
		{ "id": "manygifts2" },
		{ "id": "manygifts3" },
		{ "id": "manygifts4" },
		{ "id": "mardigrasmask" },
		{ "id": "maroccantea" },
		{ "id": "medicalmask" },
		{ "id": "meldonium" },
		{ "id": "menorah" },
		{ "id": "meteorit" },
		{ "id": "migalka" },
		{ "id": "minerhat" },
		{ "id": "mosque" },
		{ "id": "mushroomsbasket" },
		{ "id": "nokia" },
		{ "id": "nytree1" },
		{ "id": "oilbarrel" },
		{ "id": "ololosh" },
		{ "id": "olympichat" },
		{ "id": "olympmedal" },
		{ "id": "olympwreath" },
		{ "id": "orange" },
		{ "id": "orangutan" },
		{ "id": "owl" },
		{ "id": "painterhat" },
		{ "id": "palette" },
		{ "id": "pancake" },
		{ "id": "pancakes" },
		{ "id": "panda" },
		{ "id": "paperhat" },
		{ "id": "peach" },
		{ "id": "perfume" },
		{ "id": "petcat" },
		{ "id": "petdog" },
		{ "id": "phdhat" },
		{ "id": "picnic" },
		{ "id": "pillow" },
		{ "id": "pinguin" },
		{ "id": "piratecanon" },
		{ "id": "pirateflag" },
		{ "id": "pirateparrot" },
		{ "id": "piratespot" },
		{ "id": "pirateswords" },
		{ "id": "plaguemask" },
		{ "id": "polaroid" },
		{ "id": "pomegranate" },
		{ "id": "popcorn" },
		{ "id": "pumpkin" },
		{ "id": "pumpkinpie" },
		{ "id": "random" },
		{ "id": "redwig" },
		{ "id": "reindeer" },
		{ "id": "rocket" },
		{ "id": "romanticcandle" },
		{ "id": "rosep" },
		{ "id": "roser" },
		{ "id": "rosew" },
		{ "id": "royalslug" },
		{ "id": "rzdtea" },
		{ "id": "safari" },
		{ "id": "sakura1" },
		{ "id": "salute" },
		{ "id": "samovar" },
		{ "id": "santa" },
		{ "id": "seafish" },
		{ "id": "seashell" },
		{ "id": "seastar" },
		{ "id": "seeds" },
		{ "id": "shashlik" },
		{ "id": "skateboard" },
		{ "id": "sleephat" },
		{ "id": "smile" },
		{ "id": "smilecup" },
		{ "id": "snegurka" },
		{ "id": "snowball" },
		{ "id": "snowdrops" },
		{ "id": "snowman1" },
		{ "id": "sofa" },
		{ "id": "spacecocktail" },
		{ "id": "spaghetti" },
		{ "id": "sponge" },
		{ "id": "springcocktail" },
		{ "id": "springwreath" },
		{ "id": "squirrel" },
		{ "id": "sturmtruppen" },
		{ "id": "submarine" },
		{ "id": "sunflower" },
		{ "id": "superbowlball" },
		{ "id": "superbowlcap" },
		{ "id": "swimmers" },
		{ "id": "tankhelmet" },
		{ "id": "tarantula" },
		{ "id": "taxi" },
		{ "id": "teapot" },
		{ "id": "tearssnake" },
		{ "id": "theatremask" },
		{ "id": "thermos" },
		{ "id": "toiletpaper1" },
		{ "id": "touristmug" },
		{ "id": "trashcan2" },
		{ "id": "trashcan3" },
		{ "id": "trashcan4" },
		{ "id": "trout" },
		{ "id": "trumpet" },
		{ "id": "tub" },
		{ "id": "turkey" },
		{ "id": "tyrolhat" },
		{ "id": "ufo" },
		{ "id": "unclesam" },
		{ "id": "valenok" },
		{ "id": "valentine" },
		{ "id": "venus" },
		{ "id": "watermelon" },
		{ "id": "weight" },
		{ "id": "whistle" },
		{ "id": "winterhat" },
		{ "id": "witch" },
		{ "id": "wreath" },
		{ "id": "wreathorange" },
		{ "id": "wreathroses" },
		{ "id": "wreathviolets" },
		{ "id": "zucchini" }
	],
	gifts: /* @__PURE__ */ JSON.parse("{\"3september\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"3september\"],\"flyImages\":[\"g_3september\"],\"spine\":[\"s_3september\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_3september\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_3september\",\"storePrice\":1,\"type\":\"3september\"},\"abcbook\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_abcbook_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_abcbook_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_abcbook_v2\",\"storePrice\":1,\"type\":\"abcbook\"},\"amurchik\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"kissing2\"],\"flyImages\":[\"g_amurchik\"],\"spine\":[\"s_amurchik\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_amurchik\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_amurchik\",\"storePrice\":2,\"type\":\"amurchik\"},\"angelgift\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"empty\"],\"flyImages\":[\"g_angelgift\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_angelgift\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_angelgift\",\"storePrice\":1,\"type\":\"angelgift\"},\"apple\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_apple\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_apple\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_apple\",\"storePrice\":1,\"type\":\"apple\"},\"armytea\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_armytea\"],\"startSounds\":[\"coffee\"],\"stickImages\":[\"g_armytea\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_armytea\",\"storePrice\":1,\"type\":\"armytea\"},\"astronaut\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"empty\"],\"flyImages\":[\"g_astronaut\",\"g_astronaut_ch\",\"g_astronaut_eu\",\"g_astronaut_ru\",\"g_astronaut_us\"],\"spine\":[\"s_astronaut\",\"s_astronaut_ch\",\"s_astronaut_eu\",\"s_astronaut_ru\",\"s_astronaut_us\"],\"startSounds\":[\"astro\"],\"stickImages\":[\"g_astronaut\",\"g_astronaut_ch\",\"g_astronaut_eu\",\"g_astronaut_ru\",\"g_astronaut_us\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_astronaut\",\"storePrice\":1,\"type\":\"astronaut\"},\"astronomy\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_astronomy_v3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_astronomy_v3\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_astronomy_v3\",\"storePrice\":2,\"type\":\"astronomy\"},\"babycocktail\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_babycocktail\"],\"spine\":[\"s_babycocktail\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_babycocktail\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_babycocktail\",\"storePrice\":2,\"type\":\"babycocktail\"},\"baloon\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"empty\"],\"flyImages\":[\"g_baloon1\",\"g_baloon2\",\"g_baloon3\"],\"spine\":[\"s_baloon1\",\"s_baloon2\",\"s_baloon3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baloon1\",\"g_baloon2\",\"g_baloon3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_baloon1\",\"storePrice\":1,\"type\":\"baloon\"},\"banana\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"monkey\"],\"flyImages\":[\"g_banana\"],\"spine\":[\"s_banana_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_banana\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_banana\",\"storePrice\":1,\"type\":\"banana\"},\"baranki\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baranki_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baranki_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baranki_v2\",\"storePrice\":2,\"type\":\"baranki\"},\"baseball1\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseball1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseball1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseball1\",\"storePrice\":2,\"type\":\"baseball1\"},\"baseball2\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseball2_v3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseball2_v3\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseball2_v3\",\"storePrice\":2,\"type\":\"baseball2\"},\"baseball3\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseball3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseball3\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseball3\",\"storePrice\":2,\"type\":\"baseball3\"},\"baseball4\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseball4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseball4\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseball4\",\"storePrice\":2,\"type\":\"baseball4\"},\"baseball5\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseball5\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseball5\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseball5\",\"storePrice\":2,\"type\":\"baseball5\"},\"baseball6\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseball6\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseball6\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseball6\",\"storePrice\":2,\"type\":\"baseball6\"},\"baseballde\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseballde_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseballde_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseballde_v2\",\"storePrice\":2,\"type\":\"baseballde\"},\"baseballtr\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseballtr_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseballtr_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseballtr_v2\",\"storePrice\":2,\"type\":\"baseballtr\"},\"baseballua\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseballua_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseballua_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseballua_v2\",\"storePrice\":2,\"type\":\"baseballua\"},\"baseballus\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_baseballus_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_baseballus_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_baseballus_v2\",\"storePrice\":2,\"type\":\"baseballus\"},\"batmanhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_batmanhat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_batmanhat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_batmanhat\",\"storePrice\":2,\"type\":\"batmanhat\"},\"bayanist\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_bayanist_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_bayanist_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_bayanist_v2\",\"storePrice\":2,\"type\":\"bayanist\"},\"bbq\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_bbq\"],\"spine\":[\"s_bbq\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_bbq\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_bbq\",\"storePrice\":1,\"type\":\"bbq\"},\"bear6\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_bear6\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_bear6\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_bear6\",\"storePrice\":1,\"type\":\"bear6\"},\"berries\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_berries_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_berries_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_berries_v2\",\"storePrice\":1,\"type\":\"berries\"},\"bikinibottom\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_bikinibottom1\",\"g_bikinibottom2\"],\"startSounds\":[\"whistle\"],\"stickImages\":[\"g_bikinibottom1\",\"g_bikinibottom2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_bikinibottom2\",\"storePrice\":2,\"type\":\"bikinibottom\"},\"bikinitop\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_bikinitop1\",\"g_bikinitop2\"],\"startSounds\":[\"whistle\"],\"stickImages\":[\"g_bikinitop1\",\"g_bikinitop2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_bikinitop2\",\"storePrice\":2,\"type\":\"bikinitop\"},\"bomb\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"boom1\",\"boom2\"],\"flyImages\":[\"g_bomb2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_bomb3\",\"g_bomb4\",\"g_bomb5\",\"g_bomb6\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_bomb1\",\"storePrice\":1,\"type\":\"bomb\"},\"boxingglove\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"punch1\",\"punch2\"],\"flyImages\":[\"g_boxingglove1\",\"g_boxingglove2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_boxingglove1\",\"g_boxingglove2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_boxingglove1\",\"storePrice\":1,\"type\":\"boxingglove\"},\"brainicecream\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_brainicecream_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_brainicecream_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_brainicecream_v2\",\"storePrice\":1,\"type\":\"brainicecream\"},\"bretzel\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_bretzel\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_bretzel\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_bretzel\",\"storePrice\":1,\"type\":\"bretzel\"},\"budenovka\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_budenovka_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_budenovka_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_budenovka_v2\",\"storePrice\":2,\"type\":\"budenovka\"},\"builderhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_builderhat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_builderhat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_builderhat\",\"storePrice\":2,\"type\":\"builderhat\"},\"camera\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_camera\"],\"spine\":[\"s_camera\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_camera\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_camera\",\"storePrice\":1,\"type\":\"camera\"},\"candle\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_candle_v2\"],\"spine\":[\"s_candle_v2\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_candle_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_candle_v2\",\"storePrice\":1,\"type\":\"candle\"},\"canteen\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_canteen_v2\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_canteen_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_canteen_v2\",\"storePrice\":1,\"type\":\"canteen\"},\"caviar\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_caviar\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_caviar\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_caviar\",\"storePrice\":1,\"type\":\"caviar\"},\"chemistry\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_chemistry_v2\"],\"spine\":[\"s_chemistry_v2\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_chemistry_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_chemistry_v2\",\"storePrice\":1,\"type\":\"chemistry\"},\"cherrypie\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_cherrypie\"],\"spine\":[\"s_cherrypie\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_cherrypie\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_cherrypie\",\"storePrice\":2,\"type\":\"cherrypie\"},\"chess\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"horse\"],\"flyImages\":[\"g_chess\"],\"spine\":[\"s_chess\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_chess\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_chess\",\"storePrice\":1,\"type\":\"chess\"},\"chinese\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_chinese\"],\"spine\":[\"s_chinese\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_chinese\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_chinese\",\"storePrice\":1,\"type\":\"chinese\"},\"chocolate\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"snow4\"],\"flyImages\":[\"g_chocolate\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_chocolate\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_chocolate\",\"storePrice\":1,\"type\":\"chocolate\"},\"christmasball\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_christmasball\"],\"spine\":[\"s_christmasball\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_christmasball\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_christmasball\",\"storePrice\":1,\"type\":\"christmasball\"},\"christmasbell\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_christmasbell2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_christmasbell2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_christmasbell1\",\"storePrice\":2,\"type\":\"christmasbell\"},\"christmassock\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_christmassock2_v2\"],\"startSounds\":[\"bells\"],\"stickImages\":[\"g_christmassock2_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_christmassock1_v2\",\"storePrice\":2,\"type\":\"christmassock\"},\"clover\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_clover1\",\"g_clover2\",\"g_clover3\",\"g_clover4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_clover1\",\"g_clover2\",\"g_clover3\",\"g_clover4\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_clover1\",\"storePrice\":1,\"type\":\"clover\"},\"clownhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_clownhat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_clownhat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_clownhat\",\"storePrice\":2,\"type\":\"clownhat\"},\"colamentos\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"colamentos\"],\"flyImages\":[\"g_colamentos1\"],\"spine\":[\"s_colamentos\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_colamentos2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_colamentos\",\"storePrice\":2,\"type\":\"colamentos\"},\"comet\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"boom1\",\"boom2\"],\"flyImages\":[\"g_comet2\",\"g_comet3\",\"g_comet4\",\"g_comet5\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_comet6\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_comet1\",\"storePrice\":1,\"type\":\"comet\",\"vfx\":\"magic\"},\"compass\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_compass\"],\"spine\":[\"s_compass\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_compass\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_compass\",\"storePrice\":1,\"type\":\"compass\"},\"cook\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_cook_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_cook_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_cook_v2\",\"storePrice\":2,\"type\":\"cook\",\"vkMedia\":\"photo17075769_457239607\"},\"cooler\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_cooler_v2\"],\"spine\":[\"s_cooler_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_cooler_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_cooler_v2\",\"storePrice\":1,\"type\":\"cooler\"},\"cosmohelmet\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_cosmohelmet_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_cosmohelmet_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_cosmohelmet_v2\",\"storePrice\":2,\"type\":\"cosmohelmet\"},\"cuckooclock\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"cuckoo\"],\"flyImages\":[\"g_cuckooclock\"],\"spine\":[\"s_cuckooclock_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_cuckooclock\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_cuckooclock\",\"storePrice\":1,\"type\":\"cuckooclock\"},\"darthvader\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_darthvader\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_darthvader\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_darthvader\",\"storePrice\":2,\"type\":\"darthvader\"},\"deerhorns\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_deerhorns\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_deerhorns\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_deerhorns\",\"storePrice\":2,\"type\":\"deerhorns\"},\"diamond\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_diamond\"],\"spine\":[\"s_diamond\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_diamond\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_diamond\",\"storePrice\":1,\"type\":\"diamond\"},\"diamondgift\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_diamondgift\"],\"spine\":[\"s_diamond\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_diamondgift\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_diamondgift\",\"storePrice\":1,\"type\":\"diamondgift\"},\"dinosaur\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"clang\"],\"flyImages\":[\"g_dinosaur\"],\"spine\":[\"s_dinosaur\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_dinosaur\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_dinosaur\",\"storePrice\":2,\"type\":\"dinosaur\"},\"djcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_djcap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_djcap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_djcap\",\"storePrice\":2,\"type\":\"djcap\"},\"donut\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_donut1\",\"g_donut2\",\"g_donut3\",\"g_donut4\",\"g_donut5\",\"g_donut6\",\"g_donut7\",\"g_donut8\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_donut1\",\"g_donut2\",\"g_donut3\",\"g_donut4\",\"g_donut5\",\"g_donut6\",\"g_donut7\",\"g_donut8\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_donut1\",\"storePrice\":1,\"type\":\"donut\"},\"doshirak\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_doshirak1\"],\"spine\":[\"s_doshirak\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_doshirak2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_doshirak1\",\"storePrice\":1,\"type\":\"doshirak\"},\"dove\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_dove\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_dove\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_dove\",\"storePrice\":1,\"type\":\"dove\"},\"drinkaz\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkaz\"],\"spine\":[\"s_drinkaz\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkaz\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkaz\",\"storePrice\":1,\"type\":\"drinkaz\"},\"drinkby\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkby\"],\"spine\":[\"s_drinkby\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkby\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkby\",\"storePrice\":1,\"type\":\"drinkby\"},\"drinkge\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkge\"],\"spine\":[\"s_drinkge\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkge\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkge\",\"storePrice\":1,\"type\":\"drinkge\"},\"drinkkg\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkkg\"],\"spine\":[\"s_drinkkg\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkkg\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkkg\",\"storePrice\":1,\"type\":\"drinkkg\"},\"drinkkz\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkkz\"],\"spine\":[\"s_drinkkz\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkkz\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkkz\",\"storePrice\":1,\"type\":\"drinkkz\"},\"drinkru\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkru\"],\"spine\":[\"s_drinkru\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkru\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkru\",\"storePrice\":1,\"type\":\"drinkru\"},\"drinkua\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkua\"],\"spine\":[\"s_drinkua\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkua\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkua\",\"storePrice\":1,\"type\":\"drinkua\"},\"drinkus\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkus\"],\"spine\":[\"s_drinkus\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkus\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkus\",\"storePrice\":1,\"type\":\"drinkus\"},\"drinkuz\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_drinkuz\"],\"spine\":[\"s_drinkuz\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_drinkuz\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_drinkuz\",\"storePrice\":1,\"type\":\"drinkuz\"},\"ears9b\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_ears9b\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_ears9b\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_ears9b\",\"storePrice\":2,\"type\":\"ears9b\"},\"ears9c\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_ears9c\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_ears9c\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_ears9c\",\"storePrice\":2,\"type\":\"ears9c\"},\"eastercake\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_eastercake1\",\"g_eastercake2\",\"g_eastercake3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_eastercake1\",\"g_eastercake2\",\"g_eastercake3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_eastercake1\",\"storePrice\":1,\"type\":\"eastercake\"},\"easteregg\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_easteregg1\",\"g_easteregg2\",\"g_easteregg3\",\"g_easteregg4\",\"g_easteregg5\",\"g_easteregg6\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_easteregg1\",\"g_easteregg2\",\"g_easteregg3\",\"g_easteregg4\",\"g_easteregg5\",\"g_easteregg6\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_easteregg1\",\"storePrice\":1,\"type\":\"easteregg\"},\"eggplant\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"eggplant\"],\"flyImages\":[\"g_eggplant_v2\"],\"spine\":[\"s_eggplant\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_eggplant_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_eggplant_v2\",\"storePrice\":1,\"type\":\"eggplant\"},\"eggsbasket\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_eggsbasket_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_eggsbasket_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_eggsbasket_v2\",\"storePrice\":1,\"type\":\"eggsbasket\"},\"eggskiss\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"kissing2\"],\"flyImages\":[\"g_eggskiss\"],\"spine\":[\"s_eggskiss\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_eggskiss\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_eggskiss\",\"storePrice\":2,\"type\":\"eggskiss\"},\"elephant\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"dance\"],\"flyImages\":[\"g_elephant\"],\"spine\":[\"s_elephant\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_elephant\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_elephant\",\"storePrice\":1,\"type\":\"elephant\"},\"elvis\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_elvis2_v2\"],\"startSounds\":[\"bells\"],\"stickImages\":[\"g_elvis2_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_elvis1_v2\",\"storePrice\":2,\"type\":\"elvis\"},\"extinguisher\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_extinguisher\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_extinguisher\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_extinguisher\",\"storePrice\":1,\"type\":\"extinguisher\"},\"faberge\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_faberge\"],\"spine\":[\"s_faberge\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_faberge\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_faberge\",\"storePrice\":1,\"type\":\"faberge\"},\"fern\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_fern\"],\"spine\":[\"s_fern\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_fern\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_fern\",\"storePrice\":1,\"type\":\"fern\"},\"fire\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_fire_v2\"],\"spine\":[\"s_fire_v2\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_fire_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_fire_v2\",\"storePrice\":1,\"type\":\"fire\"},\"firehorse\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"horse\"],\"flyImages\":[\"g_firehorse\"],\"spine\":[\"s_firehorse\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_firehorse\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_firehorse\",\"storePrice\":3,\"type\":\"firehorse\"},\"fireman\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_fireman\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_fireman\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_fireman\",\"storePrice\":2,\"type\":\"fireman\"},\"flagby\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagby\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagby\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagby\",\"storePrice\":1,\"type\":\"flagby\"},\"flagca\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagca\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagca\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagca\",\"storePrice\":1,\"type\":\"flagca\"},\"flagde\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagde\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagde\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagde\",\"storePrice\":1,\"type\":\"flagde\"},\"flages\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flages\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flages\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flages\",\"storePrice\":1,\"type\":\"flages\"},\"flagge\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagge\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagge\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagge\",\"storePrice\":1,\"type\":\"flagge\"},\"flaghr\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flaghr\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flaghr\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flaghr\",\"storePrice\":1,\"type\":\"flaghr\"},\"flagkg\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagkg\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagkg\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagkg\",\"storePrice\":1,\"type\":\"flagkg\"},\"flagkz\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagkz\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagkz\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagkz\",\"storePrice\":1,\"type\":\"flagkz\"},\"flagru\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagru\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagru\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagru\",\"storePrice\":1,\"type\":\"flagru\"},\"flagtr\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagtr\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagtr\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagtr\",\"storePrice\":1,\"type\":\"flagtr\"},\"flagua\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagua\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagua\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagua\",\"storePrice\":1,\"type\":\"flagua\"},\"flagus\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flagus\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flagus\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flagus\",\"storePrice\":1,\"type\":\"flagus\"},\"flaguz\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_flaguz\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flaguz\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_flaguz\",\"storePrice\":1,\"type\":\"flaguz\"},\"flowerwreath\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_flowerwreath_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_flowerwreath_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_flowerwreath_v2\",\"storePrice\":2,\"type\":\"flowerwreath\"},\"football\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_football\"],\"spine\":[\"s_football_v2\"],\"startSounds\":[\"football\"],\"stickImages\":[\"g_football\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_football\",\"storePrice\":1,\"type\":\"football\"},\"footballcup\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_footballcup\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_footballcup\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_footballcup\",\"storePrice\":1,\"type\":\"footballcup\"},\"fruitbasket2\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_fruitbasket2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_fruitbasket2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_fruitbasket2\",\"storePrice\":2,\"type\":\"fruitbasket2\"},\"fruitbasket3\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_fruitbasket3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_fruitbasket3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_fruitbasket3\",\"storePrice\":2,\"type\":\"fruitbasket3\"},\"fruitbasket4\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_fruitbasket4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_fruitbasket4\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_fruitbasket4\",\"storePrice\":2,\"type\":\"fruitbasket4\"},\"funnyanimal\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_funnyanimal\"],\"spine\":[\"s_funnyanimal\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_funnyanimal\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_funnyanimal\",\"storePrice\":1,\"type\":\"funnyanimal\"},\"gascan\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_gascan_1\",\"g_gascan_2\",\"g_gascan_3\"],\"spine\":[\"s_gascan_1\",\"s_gascan_2\",\"s_gascan_3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_gascan_1\",\"g_gascan_2\",\"g_gascan_3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_gascan_3\",\"storePrice\":3,\"type\":\"gascan\"},\"ghost\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_ghost1_v2\",\"g_ghost2_v2\",\"g_ghost3_v2\",\"g_ghost4_v2\"],\"startSounds\":[\"ghost\"],\"stickImages\":[\"g_ghost1_v2\",\"g_ghost2_v2\",\"g_ghost3_v2\",\"g_ghost4_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_ghost1_v2\",\"storePrice\":1,\"type\":\"ghost\"},\"gingy\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_gingy\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_gingy\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_gingy\",\"storePrice\":1,\"type\":\"gingy\"},\"glintwein\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_glintwein\"],\"spine\":[\"s_glintwein\"],\"startSounds\":[\"coffee\"],\"stickImages\":[\"g_glintwein\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_glintwein\",\"storePrice\":1,\"type\":\"glintwein\"},\"globe\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_globe_v2\"],\"spine\":[\"s_globe\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_globe_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_globe_v2\",\"storePrice\":1,\"type\":\"globe\"},\"goldpot\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_goldpot\"],\"spine\":[\"s_goldpot\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_goldpot\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_goldpot\",\"storePrice\":1,\"type\":\"goldpot\"},\"goldstar\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_goldstar\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_goldstar\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_goldstar\",\"storePrice\":1,\"type\":\"goldstar\"},\"grog\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_grog\"],\"spine\":[\"s_grog\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_grog\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_grog\",\"storePrice\":1,\"type\":\"grog\"},\"groundhog\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_groundhog\"],\"spine\":[\"s_groundhog\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_groundhog\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_groundhog\",\"storePrice\":1,\"type\":\"groundhog\"},\"guitar\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_guitar2\"],\"startSounds\":[\"guitar\"],\"stickImages\":[\"g_guitar2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_guitar1\",\"storePrice\":1,\"type\":\"guitar\"},\"hatservice\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_hatservice_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_hatservice_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_hatservice_v2\",\"storePrice\":2,\"type\":\"hatservice\"},\"hatvdv\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_hatvdv_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_hatvdv_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_hatvdv_v2\",\"storePrice\":2,\"type\":\"hatvdv\"},\"heartlock\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_heartlock\"],\"spine\":[\"s_heartlock\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_heartlock\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_heartlock\",\"storePrice\":1,\"type\":\"heartlock\"},\"helmet\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_helmet_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_helmet_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_helmet_v2\",\"storePrice\":2,\"type\":\"helmet\"},\"hockey1\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_hockey1\"],\"startSounds\":[\"hockey\"],\"stickImages\":[\"g_hockey1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_hockey1\",\"storePrice\":2,\"type\":\"hockey1\"},\"hockey2\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_hockey2\"],\"startSounds\":[\"hockey\"],\"stickImages\":[\"g_hockey2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_hockey2\",\"storePrice\":2,\"type\":\"hockey2\"},\"hockey3\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_hockey3\"],\"startSounds\":[\"hockey\"],\"stickImages\":[\"g_hockey3\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_hockey3\",\"storePrice\":2,\"type\":\"hockey3\"},\"hockey4\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_hockey4\"],\"startSounds\":[\"hockey\"],\"stickImages\":[\"g_hockey4\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_hockey4\",\"storePrice\":2,\"type\":\"hockey4\"},\"hockeycup\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_hockeycup\"],\"spine\":[\"s_hockeycup\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_hockeycup\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_hockeycup\",\"storePrice\":1,\"type\":\"hockeycup\"},\"holigrenade\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"boom1\",\"boom2\"],\"flyImages\":[\"g_holigrenade1_v2\",\"g_holigrenade1_v2\",\"g_holigrenade1_v2\",\"g_holigrenade1_v2\",\"g_holigrenade1_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_holigrenade2_v2\",\"g_holigrenade3_v2\",\"g_holigrenade4_v2\",\"g_holigrenade5_v2\",\"g_holigrenade6_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_holigrenade1_v2\",\"storePrice\":1,\"type\":\"holigrenade\"},\"hotdog\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_hotdog\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_hotdog\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_hotdog\",\"storePrice\":1,\"type\":\"hotdog\"},\"japaneseroll\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_japaneseroll\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_japaneseroll\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_japaneseroll\",\"storePrice\":1,\"type\":\"japaneseroll\"},\"japaneseset\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_japaneseset\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_japaneseset\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_japaneseset\",\"storePrice\":1,\"type\":\"japaneseset\"},\"japanesesushi\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_japanesesushi\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_japanesesushi\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_japanesesushi\",\"storePrice\":1,\"type\":\"japanesesushi\"},\"kinder\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"snow2\"],\"flyImages\":[\"g_kinder1_v2\"],\"spine\":[\"s_kinder2_v2\",\"s_kinder3_v2\",\"s_kinder4_v2\",\"s_kinder5_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_kinder2_v2\",\"g_kinder3_v2\",\"g_kinder4_v2\",\"g_kinder5_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_kinder1_v2\",\"storePrice\":1,\"type\":\"kinder\"},\"leaf\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_leaf1_v2\",\"g_leaf2_v2\",\"g_leaf3_v2\",\"g_leaf4_v2\",\"g_leaf5_v2\",\"g_leaf6_v2\",\"g_leaf7_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_leaf1_v2\",\"g_leaf2_v2\",\"g_leaf3_v2\",\"g_leaf4_v2\",\"g_leaf5_v2\",\"g_leaf6_v2\",\"g_leaf7_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_leaf1_v2\",\"storePrice\":1,\"type\":\"leaf\"},\"leninbadge\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_leninbadge1\",\"g_leninbadge2\",\"g_leninbadge3\",\"g_leninbadge4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_leninbadge1\",\"g_leninbadge2\",\"g_leninbadge3\",\"g_leninbadge4\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_leninbadge1\",\"storePrice\":1,\"type\":\"leninbadge\"},\"lenincap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_lenincap_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_lenincap_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_lenincap_v2\",\"storePrice\":2,\"type\":\"lenincap\"},\"lepricon\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_lepricon\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_lepricon\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_lepricon\",\"storePrice\":2,\"type\":\"lepricon\"},\"liberty\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_liberty\"],\"spine\":[\"s_liberty\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_liberty\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_liberty\",\"storePrice\":1,\"type\":\"liberty\"},\"lionet\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"empty\"],\"flyImages\":[\"g_lionet\"],\"spine\":[\"s_lionet\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_lionet\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_lionet\",\"storePrice\":2,\"type\":\"lionet\"},\"lipstick\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_lipstick\"],\"spine\":[\"s_lipstick\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_lipstick\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_lipstick\",\"storePrice\":1,\"type\":\"lipstick\"},\"louboutin\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_louboutin\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_louboutin\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_louboutin\",\"storePrice\":3,\"type\":\"louboutin\"},\"lovecompote\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_lovecompote\"],\"spine\":[\"s_lovecompote\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_lovecompote\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_lovecompote\",\"storePrice\":3,\"type\":\"lovecompote\"},\"lovepotion\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_lovepotion_v2\"],\"spine\":[\"s_lovepotion_v2\"],\"startSounds\":[\"coffee\"],\"stickImages\":[\"g_lovepotion_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_lovepotion_v2\",\"storePrice\":1,\"type\":\"lovepotion\"},\"magichat\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_magichat1\"],\"spine\":[\"s_magichat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_magichat2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_magichat1\",\"storePrice\":1,\"type\":\"magichat\"},\"mandarin\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"empty\"],\"flyImages\":[\"g_mandarin1\"],\"spine\":[\"s_mandarin\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_mandarin2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_mandarin1\",\"storePrice\":1,\"type\":\"mandarin\"},\"manygifts2\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"pillow\"],\"flyImages\":[\"g_manygifts2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_manygifts2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_manygifts2\",\"storePrice\":2,\"type\":\"manygifts2\"},\"manygifts3\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"pillow\"],\"flyImages\":[\"g_manygifts3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_manygifts3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_manygifts3\",\"storePrice\":2,\"type\":\"manygifts3\"},\"manygifts4\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"pillow\"],\"flyImages\":[\"g_manygifts4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_manygifts4\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_manygifts4\",\"storePrice\":2,\"type\":\"manygifts4\"},\"mardigrasmask\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_mardigrasmask\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_mardigrasmask\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_mardigrasmask\",\"storePrice\":2,\"type\":\"mardigrasmask\"},\"maroccantea\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_maroccantea\"],\"spine\":[\"s_maroccantea\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_maroccantea\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_maroccantea\",\"storePrice\":1,\"type\":\"maroccantea\"},\"medicalmask\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_medicalmask1\",\"g_medicalmask2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_medicalmask1\",\"g_medicalmask2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_medicalmask1\",\"storePrice\":1,\"type\":\"medicalmask\"},\"meldonium\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_meldonium\"],\"spine\":[\"s_meldonium\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_meldonium\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_meldonium\",\"storePrice\":1,\"type\":\"meldonium\"},\"menorah\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_menorah1\"],\"spine\":[\"s_menorah\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_menorah2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_menorah2\",\"storePrice\":1,\"type\":\"menorah\"},\"meteorit\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"boom1\",\"boom2\"],\"flyImages\":[\"g_meteorit2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_meteorit3\",\"g_meteorit4\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_meteorit1\",\"storePrice\":1,\"type\":\"meteorit\"},\"migalka\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_migalka\"],\"spine\":[\"s_migalka\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_migalka\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_migalka\",\"storePrice\":2,\"type\":\"migalka\"},\"minerhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_minerhat\"],\"spine\":[\"s_minerhat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_minerhat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_minerhat\",\"storePrice\":2,\"type\":\"minerhat\"},\"mosque\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_mosque\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_mosque\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_mosque\",\"storePrice\":1,\"type\":\"mosque\"},\"mushroomsbasket\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_mushroomsbasket\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_mushroomsbasket\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_mushroomsbasket\",\"storePrice\":1,\"type\":\"mushroomsbasket\"},\"nokia\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"nokia\"],\"flyImages\":[\"g_nokia\"],\"spine\":[\"s_nokia\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_nokia\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_nokia\",\"storePrice\":2,\"type\":\"nokia\"},\"nytree1\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_nytree1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_nytree1\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_nytree1\",\"storePrice\":1,\"type\":\"nytree1\"},\"oilbarrel\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_oilbarrel\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_oilbarrel\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_oilbarrel\",\"storePrice\":1,\"type\":\"oilbarrel\"},\"ololosh\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_ololosh_v2\"],\"spine\":[\"s_ololosh_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_ololosh_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_ololosh_v2\",\"storePrice\":2,\"type\":\"ololosh\"},\"olympichat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_olympichat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_olympichat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_olympichat\",\"storePrice\":2,\"type\":\"olympichat\"},\"olympmedal\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_olympmedal1\",\"g_olympmedal2\",\"g_olympmedal3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_olympmedal1\",\"g_olympmedal2\",\"g_olympmedal3\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_olympmedal1\",\"storePrice\":1,\"type\":\"olympmedal\"},\"olympwreath\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_olympwreath\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_olympwreath\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_olympwreath\",\"storePrice\":2,\"type\":\"olympwreath\"},\"orange\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tomato1\",\"tomato2\"],\"flyImages\":[\"g_orange1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_orange2\",\"g_orange3\",\"g_orange4\",\"g_orange5\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_orange1\",\"storePrice\":1,\"type\":\"orange\"},\"orangutan\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"empty\"],\"flyImages\":[\"g_orangutan\"],\"spine\":[\"s_orangutan\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_orangutan\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_orangutan\",\"storePrice\":1,\"type\":\"orangutan\"},\"owl\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_owl\"],\"spine\":[\"s_owl\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_owl\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_owl\",\"storePrice\":1,\"type\":\"owl\"},\"painterhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_painterhat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_painterhat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_painterhat\",\"storePrice\":2,\"type\":\"painterhat\"},\"palette\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_palette\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_palette\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_palette\",\"storePrice\":1,\"type\":\"palette\"},\"pancake\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_pancake1_v2\",\"g_pancake2_v2\",\"g_pancake3_v2\",\"g_pancake4_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pancake1_v2\",\"g_pancake2_v2\",\"g_pancake3_v2\",\"g_pancake4_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_pancake1_v2\",\"storePrice\":1,\"type\":\"pancake\"},\"pancakes\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_pancakes\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pancakes\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_pancakes\",\"storePrice\":1,\"type\":\"pancakes\"},\"panda\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_panda_v2\"],\"spine\":[\"s_panda_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_panda_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_panda_v2\",\"storePrice\":1,\"type\":\"panda\"},\"paperhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_paperhat_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_paperhat_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_paperhat_v2\",\"storePrice\":2,\"type\":\"paperhat\"},\"peach\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"whistle\"],\"flyImages\":[\"g_peach\"],\"spine\":[\"s_peach\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_peach\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_peach\",\"storePrice\":1,\"type\":\"peach\"},\"perfume\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"spray\"],\"flyImages\":[\"g_perfume\"],\"spine\":[\"s_perfume\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_perfume\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_perfume\",\"storePrice\":1,\"type\":\"perfume\"},\"petcat\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"cat\"],\"flyImages\":[\"g_petcat_v2\"],\"spine\":[\"s_petcat_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_petcat_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_petcat_v2\",\"storePrice\":3,\"type\":\"petcat\"},\"petdog\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_petdog_v2\"],\"spine\":[\"s_petdog_v2\"],\"startSounds\":[\"dog\",\"bark\"],\"stickImages\":[\"g_petdog_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_petdog_v2\",\"storePrice\":3,\"type\":\"petdog\"},\"phdhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_phdhat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_phdhat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_phdhat_store\",\"storePrice\":2,\"type\":\"phdhat\"},\"picnic\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_picnic\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_picnic\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_picnic\",\"storePrice\":1,\"type\":\"picnic\"},\"pillow\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"pillow\"],\"flyImages\":[\"g_pillow\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pillow\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_pillow\",\"storePrice\":1,\"type\":\"pillow\"},\"pinguin\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"empty\"],\"flyImages\":[\"g_pinguin\"],\"spine\":[\"s_pinguin\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pinguin\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_pinguin\",\"storePrice\":1,\"type\":\"pinguin\"},\"piratecanon\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_piratecanon\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_piratecanon\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_piratecanon\",\"storePrice\":1,\"type\":\"piratecanon\"},\"pirateflag\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_pirateflag\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pirateflag\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_pirateflag\",\"storePrice\":1,\"type\":\"pirateflag\"},\"pirateparrot\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_pirateparrot\"],\"spine\":[\"s_pirateparrot\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pirateparrot\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_pirateparrot\",\"storePrice\":1,\"type\":\"pirateparrot\"},\"piratespot\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_piratespot\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_piratespot\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_piratespot\",\"storePrice\":1,\"type\":\"piratespot\"},\"pirateswords\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_pirateswords\"],\"spine\":[\"s_pirateswords_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pirateswords\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_pirateswords\",\"storePrice\":1,\"type\":\"pirateswords\"},\"plaguemask\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_plaguemask\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_plaguemask\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_plaguemask_store\",\"storePrice\":2,\"type\":\"plaguemask\"},\"polaroid\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_polaroid1\",\"g_polaroid2\",\"g_polaroid3\",\"g_polaroid4\",\"g_polaroid5\"],\"spine\":[\"s_polaroid1\",\"s_polaroid2\",\"s_polaroid3\",\"s_polaroid4\",\"s_polaroid5\"],\"startSounds\":[\"photo\"],\"stickImages\":[\"g_polaroid1\",\"g_polaroid2\",\"g_polaroid3\",\"g_polaroid4\",\"g_polaroid5\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_polaroid\",\"storePrice\":1,\"type\":\"polaroid\"},\"pomegranate\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_pomegranate\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pomegranate\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_pomegranate\",\"storePrice\":1,\"type\":\"pomegranate\"},\"popcorn\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"popcorn\"],\"flyImages\":[\"g_popcorn1\",\"g_popcorn2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_popcorn1\",\"g_popcorn2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_popcorn1\",\"storePrice\":1,\"type\":\"popcorn\"},\"pumpkin\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_pumpkin1_v2\",\"g_pumpkin2_v2\",\"g_pumpkin3_v2\",\"g_pumpkin4_v2\"],\"startSounds\":[\"witch_laughter_1\",\"witch_laughter_2\"],\"stickImages\":[\"g_pumpkin1_v2\",\"g_pumpkin2_v2\",\"g_pumpkin3_v2\",\"g_pumpkin4_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_pumpkin1_v2\",\"storePrice\":1,\"type\":\"pumpkin\"},\"pumpkinpie\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_pumpkinpie\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_pumpkinpie\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_pumpkinpie\",\"storePrice\":1,\"type\":\"pumpkinpie\"},\"random\":{\"category\":\"random\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_dice\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_dice\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_dice\",\"storePrice\":1,\"type\":\"random\"},\"redwig\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_redwig2\"],\"startSounds\":[\"scissors\"],\"stickImages\":[\"g_redwig2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_redwig1\",\"storePrice\":2,\"type\":\"redwig\"},\"reindeer\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_reindeer_v2\"],\"spine\":[\"s_reindeer_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_reindeer_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_reindeer_v2\",\"storePrice\":1,\"type\":\"reindeer\"},\"rocket\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_rocket\"],\"spine\":[\"s_rocket\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_rocket\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_rocket\",\"storePrice\":1,\"type\":\"rocket\"},\"romanticcandle\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_romanticcandle1_v3\"],\"spine\":[\"s_romanticcandle\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_romanticcandle2_v3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_romanticcandle2_v3\",\"storePrice\":1,\"type\":\"romanticcandle\"},\"rosep\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_rose7_v2\",\"g_rose8_v2\",\"g_rose9_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_rose7_v2\",\"g_rose8_v2\",\"g_rose9_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_rose7_v2\",\"storePrice\":1,\"type\":\"rosep\"},\"roser\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_rose4_v2\",\"g_rose5_v2\",\"g_rose6_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_rose4_v2\",\"g_rose5_v2\",\"g_rose6_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_rose4_v2\",\"storePrice\":1,\"type\":\"roser\"},\"rosew\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_rose1_v2\",\"g_rose2_v2\",\"g_rose3_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_rose1_v2\",\"g_rose2_v2\",\"g_rose3_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_rose1_v2\",\"storePrice\":1,\"type\":\"rosew\"},\"royalslug\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"slug1\"],\"flyImages\":[\"g_slug_4_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_slug_4_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_slug_1_v2\",\"storePrice\":2,\"type\":\"royalslug\"},\"rzdtea\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_rzdtea\"],\"spine\":[\"s_rzdtea\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_rzdtea\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_rzdtea\",\"storePrice\":1,\"type\":\"rzdtea\"},\"safari\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_safari\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_safari\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_safari\",\"storePrice\":2,\"type\":\"safari\"},\"sakura1\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_sakura1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_sakura1\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_sakura1\",\"storePrice\":1,\"type\":\"sakura1\"},\"salute\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"boom1\",\"boom2\"],\"flyImages\":[\"g_salute2\",\"g_salute3\",\"g_salute4\"],\"spine\":[\"s_salute2\",\"s_salute3\",\"s_salute4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_salute5\",\"g_salute6\",\"g_salute7\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_salute1\",\"storePrice\":1,\"type\":\"salute\",\"vfx\":\"magic\"},\"samovar\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_samovar_v2\"],\"spine\":[\"s_samovar_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_samovar_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_samovar_v2\",\"storePrice\":1,\"type\":\"samovar\"},\"santa\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_santa_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_santa_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_santa_v2\",\"storePrice\":2,\"type\":\"santa\"},\"seafish\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_seafish1\",\"g_seafish2\",\"g_seafish3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_seafish1\",\"g_seafish2\",\"g_seafish3\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_seafish1\",\"storePrice\":1,\"type\":\"seafish\"},\"seashell\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_seashell1\",\"g_seashell2\",\"g_seashell3\",\"g_seashell4\",\"g_seashell5\",\"g_seashell6\",\"g_seashell7\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_seashell1\",\"g_seashell2\",\"g_seashell3\",\"g_seashell4\",\"g_seashell5\",\"g_seashell6\",\"g_seashell7\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_seashell1\",\"storePrice\":1,\"type\":\"seashell\"},\"seastar\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_seastar1\",\"g_seastar2\",\"g_seastar3\",\"g_seastar4\",\"g_seastar5\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_seastar1\",\"g_seastar2\",\"g_seastar3\",\"g_seastar4\",\"g_seastar5\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_seastar1\",\"storePrice\":1,\"type\":\"seastar\"},\"seeds\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_seeds\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_seeds\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_seeds\",\"storePrice\":1,\"type\":\"seeds\"},\"shashlik\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_shashlik\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_shashlik\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_shashlik\",\"storePrice\":1,\"type\":\"shashlik\"},\"skateboard\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_skateboard\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_skateboard\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_skateboard\",\"storePrice\":1,\"type\":\"skateboard\"},\"sleephat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_sleephat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_sleephat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_sleephat\",\"storePrice\":2,\"type\":\"sleephat\"},\"smile\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_smile1\",\"g_smile2\",\"g_smile3\",\"g_smile4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_smile1\",\"g_smile2\",\"g_smile3\",\"g_smile4\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_smile1\",\"storePrice\":1,\"type\":\"smile\"},\"smilecup\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_smilecup\"],\"spine\":[\"s_smilecup\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_smilecup\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_smilecup\",\"storePrice\":1,\"type\":\"smilecup\"},\"snegurka\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_snegurka\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_snegurka\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_snegurka\",\"storePrice\":2,\"type\":\"snegurka\"},\"snowball\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"snow2\",\"snow3\",\"snow4\"],\"flyImages\":[\"g_snowball1\",\"g_snowball1\",\"g_snowball1\",\"g_snowball1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_snowball2\",\"g_snowball3\",\"g_snowball4\",\"g_snowball5\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_snowball1\",\"storePrice\":1,\"type\":\"snowball\"},\"snowdrops\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_snowdrops_v2\"],\"spine\":[\"s_snowdrops_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_snowdrops_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_snowdrops_v2\",\"storePrice\":1,\"type\":\"snowdrops\"},\"snowman1\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_snowman1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_snowman1\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_snowman1\",\"storePrice\":1,\"type\":\"snowman1\"},\"sofa\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_sofa\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_sofa\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_sofa\",\"storePrice\":1,\"type\":\"sofa\"},\"spacecocktail\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_spacecocktail\"],\"spine\":[\"s_spacecocktail\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_spacecocktail\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_spacecocktail\",\"storePrice\":1,\"type\":\"spacecocktail\"},\"spaghetti\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"slug1\"],\"flyImages\":[\"g_spaghetti2\"],\"spine\":[\"s_spaghetti\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_spaghetti3\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_spaghetti1\",\"storePrice\":2,\"type\":\"spaghetti\"},\"sponge\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"sponge\"],\"flyImages\":[\"g_sponge_green\",\"g_sponge_violet\",\"g_sponge_yellow\"],\"spine\":[\"s_sponge_green\",\"s_sponge_violet\",\"s_sponge_yellow\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_sponge_green\",\"g_sponge_violet\",\"g_sponge_yellow\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_sponge\",\"storePrice\":1,\"type\":\"sponge\"},\"springcocktail\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_springcocktail\"],\"spine\":[\"s_springcocktail\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_springcocktail\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_springcocktail\",\"storePrice\":1,\"type\":\"springcocktail\"},\"springwreath\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_springwreath\"],\"spine\":[\"s_springwreath\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_springwreath\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_springwreath\",\"storePrice\":2,\"type\":\"springwreath\"},\"squirrel\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_squirrel_v2\"],\"spine\":[\"s_squirrel_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_squirrel_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_squirrel_v2\",\"storePrice\":1,\"type\":\"squirrel\"},\"sturmtruppen\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_sturmtruppen\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_sturmtruppen\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_sturmtruppen\",\"storePrice\":2,\"type\":\"sturmtruppen\"},\"submarine\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"guitar\"],\"flyImages\":[\"g_submarine\"],\"spine\":[\"s_submarine\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_submarine\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_submarine\",\"storePrice\":1,\"type\":\"submarine\"},\"sunflower\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_sunflower_v2\"],\"spine\":[\"s_sunflower_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_sunflower_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_sunflower_v2\",\"storePrice\":2,\"type\":\"sunflower\"},\"superbowlball\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_superbowlball_2020\"],\"startSounds\":[\"football\"],\"stickImages\":[\"g_superbowlball_2020\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_superbowlball_2020\",\"storePrice\":1,\"type\":\"superbowlball\"},\"superbowlcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_superbowlcap_2020\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_superbowlcap_2020\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_superbowlcap_2020\",\"storePrice\":2,\"type\":\"superbowlcap\"},\"swimmers\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_swimmers1\",\"g_swimmers2\"],\"startSounds\":[\"whistle\"],\"stickImages\":[\"g_swimmers1\",\"g_swimmers2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_swimmers1\",\"storePrice\":2,\"type\":\"swimmers\"},\"tankhelmet\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_tankhelmet_2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_tankhelmet_2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_tankhelmet_1\",\"storePrice\":2,\"type\":\"tankhelmet\"},\"tarantula\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_tarantula\"],\"spine\":[\"s_tarantula\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_tarantula\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_tarantula\",\"storePrice\":1,\"type\":\"tarantula\"},\"taxi\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_taxi\"],\"spine\":[\"s_taxi\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_taxi\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_taxi\",\"storePrice\":2,\"type\":\"taxi\"},\"teapot\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_teapot\"],\"spine\":[\"s_teapot\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_teapot\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_teapot\",\"storePrice\":1,\"type\":\"teapot\"},\"tearssnake\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_tearssnake\"],\"spine\":[\"s_tearssnake\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_tearssnake\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_tearssnake\",\"storePrice\":1,\"type\":\"tearssnake\"},\"theatremask\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_theatremask1\",\"g_theatremask2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_theatremask1\",\"g_theatremask2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_theatremask1\",\"storePrice\":1,\"type\":\"theatremask\"},\"thermos\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_thermos\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_thermos\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_thermos\",\"storePrice\":1,\"type\":\"thermos\"},\"toiletpaper1\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_toiletpaper1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_toiletpaper1\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_toiletpaper1\",\"storePrice\":1,\"type\":\"toiletpaper1\"},\"touristmug\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_touristmug\"],\"startSounds\":[\"coffee\"],\"stickImages\":[\"g_touristmug\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_touristmug\",\"storePrice\":1,\"type\":\"touristmug\"},\"trashcan2\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"door_open\"],\"flyImages\":[\"g_trashcan2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_trashcan2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_trashcan2\",\"storePrice\":2,\"type\":\"trashcan2\"},\"trashcan3\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"door_open\"],\"flyImages\":[\"g_trashcan3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_trashcan3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_trashcan3\",\"storePrice\":2,\"type\":\"trashcan3\"},\"trashcan4\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"door_open\"],\"flyImages\":[\"g_trashcan4\"],\"spine\":[\"s_trash\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_trashcan4\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_trashcan4\",\"storePrice\":2,\"type\":\"trashcan4\"},\"trout\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tomato1\",\"tomato2\"],\"flyImages\":[\"g_trout\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_trout\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_trout\",\"storePrice\":1,\"type\":\"trout\"},\"trumpet\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"trumpet\"],\"flyImages\":[\"g_trumpet\"],\"spine\":[\"s_trumpet\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_trumpet\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_trumpet\",\"storePrice\":2,\"type\":\"trumpet\"},\"tub\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tub\"],\"flyImages\":[\"g_tub1\"],\"spine\":[\"s_tub\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_tub2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_tub2\",\"storePrice\":2,\"type\":\"tub\"},\"turkey\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_turkey\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_turkey\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_turkey\",\"storePrice\":1,\"type\":\"turkey\"},\"tyrolhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_tyrolhat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_tyrolhat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_tyrolhat\",\"storePrice\":2,\"type\":\"tyrolhat\"},\"ufo\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_ufo\"],\"spine\":[\"s_ufo\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_ufo\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_ufo\",\"storePrice\":1,\"type\":\"ufo\"},\"unclesam\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_unclesam\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_unclesam\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_unclesam\",\"storePrice\":2,\"type\":\"unclesam\"},\"valenok\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"punch1\",\"punch2\"],\"flyImages\":[\"g_valenok\",\"g_valenok2\",\"g_valenok3\"],\"spine\":[\"s_valenok\",\"s_valenok2\",\"s_valenok3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_valenok\",\"g_valenok2\",\"g_valenok3\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_valenok_store\",\"storePrice\":1,\"type\":\"valenok\"},\"valentine\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_valentine2\",\"g_valentine3\",\"g_valentine4\",\"g_valentine5\"],\"spine\":[\"s_valentine2\",\"s_valentine3\",\"s_valentine4\",\"s_valentine5\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_valentine6\",\"g_valentine7\",\"g_valentine8\",\"g_valentine9\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_valentine1\",\"storePrice\":1,\"type\":\"valentine\"},\"venus\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_venus_v2\"],\"spine\":[\"s_venus\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_venus_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_venus_v2\",\"storePrice\":1,\"type\":\"venus\"},\"watermelon\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_watermelon1\",\"g_watermelon2\",\"g_watermelon3\",\"g_watermelon4\"],\"startSounds\":[\"slug1\"],\"stickImages\":[\"g_watermelon1\",\"g_watermelon2\",\"g_watermelon3\",\"g_watermelon4\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_watermelon1\",\"storePrice\":1,\"type\":\"watermelon\"},\"weight\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_weight\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_weight\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_weight\",\"storePrice\":1,\"type\":\"weight\"},\"whistle\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"whistle2\"],\"flyImages\":[\"g_whistle\",\"g_whistle2\",\"g_whistle3\",\"g_whistle4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_whistle\",\"g_whistle2\",\"g_whistle3\",\"g_whistle4\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_whistle\",\"storePrice\":1,\"type\":\"whistle\"},\"winterhat\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_winterhat\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_winterhat\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_winterhat\",\"storePrice\":2,\"type\":\"winterhat\"},\"witch\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_witch_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_witch_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_witch_v2\",\"storePrice\":2,\"type\":\"witch\"},\"wreath\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_wreath_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_wreath_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_wreath_v2\",\"storePrice\":2,\"type\":\"wreath\"},\"wreathorange\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_wreathorange\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_wreathorange\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_wreathorange\",\"storePrice\":2,\"type\":\"wreathorange\"},\"wreathroses\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_wreathroses\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_wreathroses\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_wreathroses\",\"storePrice\":2,\"type\":\"wreathroses\"},\"wreathviolets\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_wreathviolets\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_wreathviolets\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_wreathviolets\",\"storePrice\":2,\"type\":\"wreathviolets\"},\"zucchini\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_zucchini\"],\"spine\":[\"s_zucchini\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_zucchini\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_zucchini\",\"storePrice\":1,\"type\":\"zucchini\"}}")
};
/** Verified ordinary additions from the live source store; premium packs remain unchanged. */
var SOURCE_NORMAL_GIFTS = source_normal_gifts_data_default.gifts;
var SOURCE_NORMAL_ENTRIES = source_normal_gifts_data_default.entries;
function injectSourceNormalGifts(assets) {
	const seen = new Set(assets.giftStore.map((entry) => entry.id));
	for (const entry of SOURCE_NORMAL_ENTRIES) {
		const source = SOURCE_NORMAL_GIFTS[entry.id];
		if (!source) continue;
		assets.gifts[entry.id] ??= source;
		if (seen.has(entry.id)) continue;
		seen.add(entry.id);
		assets.giftStore.push(entry);
	}
}
var source_premium_gifts_data_default = {
	store: [
		{ "id": "crown1" },
		{ "id": "p1_crown" },
		{ "id": "p2_crown" },
		{ "id": "p6_crown_queen" },
		{ "id": "p71_crown1" },
		{ "id": "crown2" },
		{ "id": "p6_crown_shah" },
		{ "id": "p71_crown2" },
		{ "id": "crown3" },
		{ "id": "p71_crown3" },
		{ "id": "crown4" },
		{ "id": "p71_crown4" },
		{
			"birthday": true,
			"id": "partyhat"
		},
		{
			"birthday": true,
			"id": "birthdaycake"
		},
		{ "id": "p2_cake" },
		{ "id": "__SCHEDULED__" },
		{ "id": "air_kiss" },
		{ "id": "p6_kiss_diamond" },
		{ "id": "p72_air_kiss" },
		{ "id": "gem" },
		{ "id": "strawberry" },
		{ "id": "tomato" },
		{ "id": "p2_tomato" },
		{ "id": "p6_kiss_heart" },
		{ "id": "frog" },
		{ "id": "flower" },
		{ "id": "sweet" },
		{ "id": "bear4" },
		{ "id": "bear1" },
		{
			"id": "labubu",
			"social": [
				"mm",
				"ok",
				"vk",
				"ya"
			]
		},
		{ "id": "bear7" },
		{ "id": "bouquet" },
		{ "id": "p2_bouquet" },
		{ "id": "p6_bq_sapphire" },
		{ "id": "bouquet2" },
		{ "id": "p6_bq_ruby" },
		{ "id": "rose" },
		{ "id": "cactus" },
		{ "id": "icecream" },
		{ "id": "cake" },
		{ "id": "milk" },
		{ "id": "wine" },
		{ "id": "p1_wine" },
		{ "id": "whiskey" },
		{ "id": "p1_whiskey" },
		{ "id": "tea" },
		{ "id": "vodka" },
		{ "id": "p74_vodka" },
		{ "id": "coffee" },
		{ "id": "champagne" },
		{ "id": "p1_champagne" },
		{ "id": "p2_champagne" },
		{ "id": "beer" },
		{ "id": "martini" },
		{ "id": "p1_martini" },
		{ "id": "juice" },
		{ "id": "p71_juice" },
		{ "id": "love" },
		{ "id": "teddybear" },
		{ "id": "healthdrink" },
		{ "id": "nurse" },
		{ "id": "cowboy" },
		{ "id": "bezkoz" },
		{ "id": "slug" },
		{ "id": "ears1" },
		{ "id": "ears2" },
		{ "id": "ears3" },
		{ "id": "ears4" },
		{ "id": "ears5" },
		{ "id": "ears6" },
		{ "id": "ears7" },
		{ "id": "ears8" },
		{ "id": "ears9a" },
		{ "id": "bow1" },
		{ "id": "bow2" },
		{ "id": "bow3" },
		{ "id": "bow4" },
		{ "id": "flagaz" },
		{ "id": "p2_flagaz" },
		{ "id": "baseballaz" },
		{
			"id": "mobile",
			"platform": ["android", "ios"]
		},
		{ "id": "p2_phone" },
		{
			"id": "ushanka",
			"kisses_s": 20
		},
		{
			"id": "romcola",
			"kisses_s": 40
		},
		{
			"id": "clown",
			"kisses_s": 80
		},
		{
			"id": "mineralka",
			"kisses_s": 150
		},
		{
			"id": "strawhat",
			"kisses_s": 250
		},
		{
			"id": "bloodymary",
			"kisses_s": 350
		},
		{ "id": "p1_bloodymary" },
		{
			"id": "weddingring1",
			"kisses_s": 550
		},
		{
			"id": "weddingring2",
			"kisses_s": 550
		},
		{
			"id": "weddingring3",
			"kisses_s": 550
		},
		{
			"id": "weddingring4",
			"kisses_s": 550
		},
		{
			"id": "latte",
			"kisses_s": 750
		},
		{ "id": "p79_latte" },
		{
			"id": "sombrero",
			"kisses_s": 950
		},
		{
			"id": "mojito",
			"kisses_s": 1150
		},
		{ "id": "p1_mojito" },
		{
			"id": "viking",
			"kisses_s": 1450
		},
		{
			"id": "tarhun",
			"kisses_s": 1750
		},
		{
			"id": "cappy",
			"kisses_s": 2150
		},
		{ "id": "p2_cappyred" },
		{ "id": "p71_cappy" },
		{
			"id": "bluelagoon",
			"kisses_s": 2550
		},
		{ "id": "p73_bluelagoon" },
		{
			"id": "pirat",
			"kisses_s": 3050
		},
		{
			"id": "b52",
			"kisses_s": 3550
		},
		{ "id": "p1_b52" },
		{
			"id": "kotelok",
			"kisses_s": 4150
		},
		{
			"id": "daiquiri",
			"kisses_s": 4750
		},
		{ "id": "p74_daiquiri" },
		{
			"id": "pilotka",
			"kisses_s": 5350
		},
		{
			"id": "sexonthebeach",
			"kisses_s": 5950
		},
		{ "id": "p75_sexonthebeach" },
		{
			"id": "cylinder",
			"kisses_s": 6550
		},
		{
			"id": "pinacolada",
			"kisses_s": 7150
		},
		{ "id": "p1_pinacolada" },
		{
			"id": "rasta",
			"kisses_s": 7750
		},
		{
			"id": "oscar",
			"kisses_s": 8350
		},
		{
			"id": "nipple",
			"kisses_s": 8950
		},
		{ "id": "p72_nipple" },
		{
			"id": "cocoscocktail",
			"kisses_s": 9550
		},
		{ "id": "p72_cocoscocktail" },
		{
			"id": "surprizebox",
			"kisses_s": 10150
		},
		{
			"id": "napoleon",
			"kisses_s": 10750
		},
		{
			"id": "poison",
			"kisses_s": 11350
		},
		{
			"id": "musketeer",
			"kisses_s": 11950
		},
		{
			"id": "rassol",
			"kisses_s": 12550
		},
		{
			"id": "sultan",
			"kisses_s": 13150
		},
		{
			"id": "microphone",
			"kisses_s": 13750
		},
		{
			"id": "voodoo",
			"kisses_s": 14350
		},
		{
			"id": "jam",
			"kisses_s": 14950
		},
		{
			"id": "pepper",
			"kisses_s": 15550
		},
		{
			"id": "colander",
			"kisses_s": 16150
		},
		{
			"id": "genielamp",
			"kisses_s": 16750
		},
		{ "id": "p2_lamp" },
		{
			"id": "vanilla",
			"kisses_s": 17350
		},
		{
			"id": "cherry",
			"kisses_s": 17950
		},
		{
			"id": "sparta",
			"kisses_s": 18550
		},
		{
			"id": "pearl",
			"kisses_s": 19150
		},
		{
			"id": "cylinderw",
			"kisses_s": 19750
		},
		{
			"id": "icecrown",
			"kisses_s": 20350
		},
		{ "id": "p71_icecrown" },
		{
			"id": "hookah",
			"kisses_s": 21050
		},
		{
			"id": "indianhat",
			"kisses_s": 21850
		},
		{
			"id": "bosscap",
			"kisses_s": 22750
		},
		{ "id": "p71_bosscap" },
		{
			"id": "cognacglass",
			"kisses_s": 23750
		},
		{ "id": "p1_cognac" },
		{
			"id": "dollar",
			"kisses_s": 24850
		},
		{ "id": "p2_money" },
		{
			"id": "matreshka",
			"kisses_s": 26050
		},
		{
			"id": "universal",
			"kisses_s": 27350
		},
		{
			"id": "easterrabbit",
			"kisses_s": 28750
		},
		{
			"id": "tequilashot",
			"kisses_s": 30250
		},
		{ "id": "p76_tequilashot" },
		{
			"id": "candy",
			"kisses_s": 31850
		},
		{
			"id": "knight",
			"kisses_s": 33550
		},
		{
			"id": "orchid",
			"kisses_s": 35350
		},
		{
			"id": "lifestyle",
			"kisses_s": 37250
		},
		{
			"id": "honeybarrel",
			"kisses_s": 39250
		},
		{
			"id": "candyheartcup",
			"kisses_s": 41350
		},
		{
			"id": "hamburger",
			"kisses_s": 43550
		},
		{
			"id": "clutch",
			"kisses_s": 45850
		},
		{ "id": "p6_rose_gold" },
		{
			"id": "friedpotatoes",
			"kisses_s": 48250
		},
		{
			"id": "vipring",
			"vip_s": true
		},
		{
			"id": "vipgold",
			"vip_s": true
		},
		{
			"id": "viproses",
			"vip_s": true
		},
		{
			"id": "viplegbox",
			"vip_s": true
		},
		{
			"id": "vipkalash",
			"vip_s": true
		},
		{
			"id": "vipcock",
			"vip_s": true
		},
		{
			"id": "vipcrown",
			"vip_s": true
		},
		{ "id": "p71_vipcrown" },
		{
			"id": "viphorseshoe",
			"vip_s": true
		},
		{
			"id": "vipchampagne",
			"vip_s": true
		},
		{ "id": "p1_vipchampagne" },
		{
			"id": "blackrose",
			"vip_s": true
		},
		{
			"id": "blackcrown",
			"vip_s": true
		},
		{ "id": "p71_blackcrown" },
		{
			"id": "blackring",
			"vip_s": true
		},
		{ "id": "p6_ring_ruby" },
		{
			"friends_s": 15,
			"id": "babecap"
		},
		{ "id": "p71_babecap" },
		{
			"friends_s": 15,
			"id": "boybyecap"
		},
		{ "id": "p71_boybyecap" },
		{
			"friends_s": 15,
			"id": "classycap"
		},
		{
			"friends_s": 15,
			"id": "goodenuffcap"
		},
		{ "id": "p71_goodenuffcap" },
		{
			"friends_s": 15,
			"id": "goodvibescap"
		},
		{ "id": "p71_goodvibescap" },
		{
			"friends_s": 15,
			"id": "kingcap"
		},
		{ "id": "p71_kingcap" },
		{
			"friends_s": 15,
			"id": "mrcoolcap"
		},
		{ "id": "p71_mrcoolcap" },
		{
			"friends_s": 15,
			"id": "omgcap"
		},
		{ "id": "p71_omgcap" },
		{
			"friends_s": 15,
			"id": "partycap"
		},
		{
			"friends_s": 15,
			"id": "queencap"
		},
		{
			"friends_s": 15,
			"id": "rabbitcap"
		},
		{
			"friends_s": 15,
			"id": "savagecap"
		},
		{ "id": "p71_savagecap" },
		{
			"friends_s": 15,
			"id": "shitcap"
		},
		{
			"friends_s": 15,
			"id": "supermecap"
		},
		{ "id": "p71_supermecap" },
		{
			"dj_score_s": 50,
			"id": "gramophone"
		},
		{
			"dj_score_s": 150,
			"id": "noteshatw"
		},
		{
			"dj_score_s": 150,
			"id": "noteshatb"
		},
		{
			"dj_score_s": 350,
			"id": "grandpiano"
		},
		{
			"dj_score_s": 750,
			"id": "notes"
		},
		{
			"dj_score_s": 1500,
			"id": "harp"
		},
		{
			"dj_score_s": 3e3,
			"id": "kokoshnik"
		},
		{
			"dj_score_s": 6e3,
			"id": "drumkit1"
		},
		{
			"dj_score_s": 12e3,
			"id": "maracas"
		},
		{
			"dj_score_s": 25e3,
			"id": "djmixer1"
		},
		{
			"dj_score_s": 5e4,
			"id": "ledglasses"
		},
		{
			"dj_score_s": 12e4,
			"id": "goldenmic"
		},
		{ "id": "p2_crystalqueen" },
		{
			"id": "iloveyou",
			"price_s": 5
		},
		{ "id": "p2_loveyou" },
		{
			"id": "loveis",
			"price_s": 10
		},
		{
			"id": "rubyearrings",
			"price_s": 15
		},
		{
			"id": "rubyheart",
			"price_s": 25
		},
		{
			"id": "rubyshoes",
			"price_s": 40
		},
		{
			"id": "rubyglasses",
			"price_s": 65
		},
		{
			"id": "rubyrose",
			"price_s": 100
		},
		{
			"id": "heart3",
			"price_s": 200
		},
		{
			"id": "heart1",
			"price_s": 350
		},
		{
			"id": "heart2",
			"price_s": 500
		},
		{
			"harem_price_s": 10,
			"id": "bowidle"
		},
		{
			"harem_price_s": 25,
			"id": "pants"
		},
		{
			"harem_price_s": 45,
			"id": "bra"
		},
		{
			"harem_price_s": 70,
			"id": "furhandcuffs"
		},
		{
			"harem_price_s": 100,
			"id": "leathermousehat"
		},
		{
			"harem_price_s": 150,
			"id": "leathershoes"
		},
		{
			"harem_price_s": 250,
			"id": "leathercathat"
		},
		{
			"harem_price_s": 450,
			"id": "leatherbra"
		},
		{
			"harem_price_s": 800,
			"id": "plunger"
		},
		{
			"harem_price_s": 1300,
			"id": "leathergag"
		},
		{
			"harem_price_s": 2e3,
			"id": "leatherzipmask"
		},
		{
			"gestures_s": 25,
			"id": "carnivalmask1"
		},
		{
			"gestures_s": 50,
			"id": "retrocar"
		},
		{
			"gestures_s": 100,
			"id": "egg"
		},
		{
			"gestures_s": 200,
			"id": "carnivalmask2"
		},
		{
			"gestures_s": 400,
			"id": "fruitbasket1"
		},
		{
			"gestures_s": 800,
			"id": "skull"
		},
		{
			"gestures_s": 1700,
			"id": "manygifts1"
		},
		{
			"gestures_s": 3500,
			"id": "snakepot"
		},
		{
			"gestures_s": 7500,
			"id": "suitcase"
		},
		{
			"gestures_s": 15e3,
			"id": "kick"
		},
		{
			"gestures_s": 3e4,
			"id": "trashcan1"
		},
		{
			"gestures_s": 6e4,
			"id": "dynamite"
		},
		{
			"gestures_s": 12e4,
			"id": "prankcake"
		},
		{
			"achievement_s": {
				"id": "jewelry",
				"level": 0
			},
			"id": "ringiy"
		},
		{
			"achievement_s": {
				"id": "jewelry",
				"level": 1
			},
			"id": "ringflower"
		},
		{
			"achievement_s": {
				"id": "jewelry",
				"level": 2
			},
			"id": "ringwhite"
		},
		{
			"achievement_s": {
				"id": "jewelry",
				"level": 3
			},
			"id": "ringblack"
		},
		{
			"achievement_s": {
				"id": "coffeeman",
				"level": 4
			},
			"id": "starbucks"
		},
		{
			"achievement_s": {
				"id": "guru",
				"level": 0
			},
			"id": "alarmclock"
		},
		{
			"achievement_s": {
				"id": "guru",
				"level": 1
			},
			"id": "rolexwhite"
		},
		{
			"achievement_s": {
				"id": "guru",
				"level": 2
			},
			"id": "rolexblack"
		},
		{
			"achievement_s": {
				"id": "princess",
				"level": 0
			},
			"id": "pisatower"
		},
		{
			"achievement_s": {
				"id": "princess",
				"level": 1
			},
			"id": "londonphone"
		},
		{
			"achievement_s": {
				"id": "princess",
				"level": 2
			},
			"id": "eiffeltower"
		},
		{ "id": "p2_queen" },
		{
			"achievement_s": {
				"id": "princess",
				"level": 3
			},
			"id": "sphinx"
		},
		{
			"achievement_s": {
				"id": "princess",
				"level": 4
			},
			"id": "pharaoh"
		},
		{
			"achievement_s": {
				"id": "shodka",
				"level": 0
			},
			"id": "blackoverlordcap"
		},
		{ "id": "p71_blackoverlordcap" },
		{
			"achievement_s": {
				"id": "sportsman",
				"level": 4
			},
			"id": "smoothie"
		},
		{ "id": "p73_smoothie" },
		{
			"achievement_s": {
				"id": "slippers",
				"level": 0
			},
			"id": "watchman"
		},
		{
			"achievement_s": {
				"id": "slippers",
				"level": 1
			},
			"id": "watchwoman"
		},
		{
			"achievement_s": {
				"id": "slippers",
				"level": 2
			},
			"id": "iwatch"
		},
		{
			"achievement_s": {
				"id": "barista",
				"level": 2
			},
			"id": "turkishcoffee"
		},
		{
			"achievement_s": {
				"id": "ersh",
				"level": 0
			},
			"id": "heineken"
		},
		{
			"id": "heartangel",
			"league_s": 1
		},
		{ "id": "p2_heart" },
		{
			"id": "brokenheart",
			"league_s": 1
		},
		{
			"id": "heartdevil",
			"league_s": 1
		},
		{
			"id": "joystick",
			"league_s": 2
		},
		{
			"id": "helicopter",
			"league_s": 2
		},
		{
			"id": "tank",
			"league_s": 2
		},
		{
			"id": "cakeforher",
			"league_s": 3
		},
		{
			"id": "cakeforhim",
			"league_s": 3
		},
		{
			"id": "birds",
			"league_s": 3
		},
		{
			"id": "motorcycle",
			"league_s": 4
		},
		{
			"id": "castetmug",
			"league_s": 4
		},
		{
			"id": "lighter",
			"league_s": 4
		},
		{
			"id": "unicorn",
			"league_s": 5
		},
		{
			"id": "flowersviolet",
			"league_s": 5
		},
		{
			"id": "pig",
			"league_s": 5
		},
		{
			"id": "japanesefan",
			"league_s": 6
		},
		{
			"id": "aircraft",
			"league_s": 6
		},
		{
			"id": "manekineko",
			"league_s": 6
		},
		{
			"id": "revolver",
			"league_s": 7
		},
		{
			"id": "horseheadhat",
			"league_s": 7
		},
		{
			"id": "sheriffstar",
			"league_s": 7
		},
		{
			"id": "milkcoctail",
			"league_s": 8
		},
		{ "id": "p72_milkcoctail" },
		{
			"id": "flowerswhitered",
			"league_s": 8
		},
		{
			"id": "corgidog",
			"league_s": 8
		},
		{
			"id": "handcuffs",
			"league_s": 9
		},
		{
			"id": "makarov",
			"league_s": 9
		},
		{
			"id": "hammer",
			"league_s": 9
		},
		{
			"id": "poop",
			"league_s": 10
		},
		{
			"id": "monomachhat",
			"league_s": 10
		},
		{
			"id": "tsarscup",
			"league_s": 10
		},
		{
			"id": "fan",
			"league_s": 11
		},
		{
			"id": "pocketclock",
			"league_s": 11
		},
		{
			"id": "pipe",
			"league_s": 11
		},
		{
			"id": "flowersyellow",
			"league_s": 12
		},
		{
			"id": "glassshoe",
			"league_s": 12
		},
		{
			"id": "flamingo",
			"league_s": 12
		},
		{
			"id": "whip",
			"league_s": 13
		},
		{
			"id": "candybox",
			"league_s": 13
		},
		{
			"id": "bed",
			"league_s": 13
		},
		{
			"id": "flowerspink",
			"league_s": 14
		},
		{
			"id": "goldenapple",
			"league_s": 14
		},
		{
			"id": "roseinglass",
			"league_s": 14
		},
		{
			"id": "ananas",
			"league_s": 15
		},
		{
			"id": "bugatti",
			"league_s": 15
		},
		{
			"id": "chertovka",
			"league_s": 15
		},
		{
			"id": "cufflinks",
			"league_s": 16
		},
		{
			"id": "gwatch",
			"league_s": 16
		},
		{
			"id": "sigara",
			"league_s": 16
		},
		{ "id": "p1_cigar" },
		{ "id": "3september" },
		{ "id": "abcbook" },
		{ "id": "air_kiss_premium" },
		{ "id": "amurchik" },
		{ "id": "angelgift" },
		{ "id": "apple" },
		{ "id": "armytea" },
		{ "id": "astronaut" },
		{ "id": "astronomy" },
		{ "id": "babycocktail" },
		{ "id": "baloon" },
		{ "id": "banana" },
		{ "id": "baranki" },
		{ "id": "baseball1" },
		{ "id": "p1_cap" },
		{ "id": "p6_hat_gent" },
		{ "id": "p71_baseball1" },
		{ "id": "baseball2" },
		{ "id": "baseball3" },
		{ "id": "baseball4" },
		{ "id": "p71_baseball4" },
		{ "id": "baseball5" },
		{ "id": "p71_baseball5" },
		{ "id": "baseball6" },
		{ "id": "p71_baseball6" },
		{ "id": "baseballde" },
		{ "id": "baseballtr" },
		{ "id": "baseballua" },
		{ "id": "baseballus" },
		{ "id": "batmanhat" },
		{ "id": "bayanist" },
		{ "id": "bbq" },
		{ "id": "bear6" },
		{ "id": "berries" },
		{ "id": "bikinibottom" },
		{ "id": "bikinitop" },
		{ "id": "bomb" },
		{ "id": "boxingglove" },
		{ "id": "brainicecream" },
		{ "id": "bretzel" },
		{ "id": "budenovka" },
		{ "id": "builderhat" },
		{ "id": "camera" },
		{ "id": "candle" },
		{ "id": "canteen" },
		{ "id": "caviar" },
		{ "id": "chemistry" },
		{ "id": "cherrypie" },
		{ "id": "chess" },
		{ "id": "chinese" },
		{ "id": "chocolate" },
		{ "id": "christmasball" },
		{ "id": "christmasbell" },
		{ "id": "christmassock" },
		{ "id": "clover" },
		{ "id": "clownhat" },
		{ "id": "colamentos" },
		{ "id": "comet" },
		{ "id": "compass" },
		{ "id": "cook" },
		{ "id": "cooler" },
		{ "id": "cosmohelmet" },
		{ "id": "cuckooclock" },
		{ "id": "darthvader" },
		{ "id": "deerhorns" },
		{ "id": "diamond" },
		{ "id": "p2_diamond" },
		{ "id": "p6_ring_box" },
		{ "id": "diamondgift" },
		{ "id": "p6_rose_diamond" },
		{ "id": "dinosaur" },
		{ "id": "djcap" },
		{ "id": "p6_hat_lady" },
		{ "id": "p71_djcap" },
		{ "id": "donut" },
		{ "id": "doshirak" },
		{ "id": "dove" },
		{ "id": "p2_dove" },
		{ "id": "drinkaz" },
		{ "id": "drinkby" },
		{ "id": "drinkge" },
		{ "id": "drinkkg" },
		{ "id": "drinkkz" },
		{ "id": "drinkru" },
		{ "id": "drinkua" },
		{ "id": "drinkus" },
		{ "id": "drinkuz" },
		{ "id": "ears9b" },
		{ "id": "ears9c" },
		{ "id": "eastercake" },
		{ "id": "easteregg" },
		{ "id": "eggplant" },
		{ "id": "eggsbasket" },
		{ "id": "eggskiss" },
		{ "id": "elephant" },
		{ "id": "elvis" },
		{ "id": "extinguisher" },
		{ "id": "faberge" },
		{ "id": "fern" },
		{ "id": "fire" },
		{ "id": "firehorse" },
		{ "id": "fireman" },
		{ "id": "flagby" },
		{ "id": "flagca" },
		{ "id": "flagde" },
		{ "id": "flages" },
		{ "id": "flagge" },
		{ "id": "p2_flagge" },
		{ "id": "flaghr" },
		{ "id": "flagkg" },
		{ "id": "flagkz" },
		{ "id": "flagru" },
		{ "id": "flagtr" },
		{ "id": "flagua" },
		{ "id": "flagus" },
		{ "id": "flaguz" },
		{ "id": "flower_premium" },
		{ "id": "flowerwreath" },
		{ "id": "football" },
		{ "id": "footballcup" },
		{ "id": "frog_premium" },
		{ "id": "fruitbasket2" },
		{ "id": "fruitbasket3" },
		{ "id": "fruitbasket4" },
		{ "id": "funnyanimal" },
		{ "id": "gascan" },
		{ "id": "gem_premium" },
		{ "id": "ghost" },
		{ "id": "gingy" },
		{ "id": "glintwein" },
		{ "id": "globe" },
		{ "id": "goldpot" },
		{ "id": "goldstar" },
		{ "id": "p2_star" },
		{ "id": "grog" },
		{ "id": "groundhog" },
		{ "id": "guitar" },
		{ "id": "hatservice" },
		{ "id": "hatvdv" },
		{ "id": "heartlock" },
		{ "id": "p2_lovelock" },
		{ "id": "helmet" },
		{ "id": "hockey1" },
		{ "id": "hockey2" },
		{ "id": "hockey3" },
		{ "id": "hockey4" },
		{ "id": "hockeycup" },
		{ "id": "holigrenade" },
		{ "id": "hotdog" },
		{ "id": "japaneseroll" },
		{ "id": "japaneseset" },
		{ "id": "japanesesushi" },
		{ "id": "kinder" },
		{ "id": "leaf" },
		{ "id": "p2_leaf" },
		{ "id": "leninbadge" },
		{ "id": "lenincap" },
		{ "id": "p71_lenincap" },
		{ "id": "lepricon" },
		{ "id": "liberty" },
		{ "id": "lionet" },
		{ "id": "lipstick" },
		{ "id": "louboutin" },
		{ "id": "lovecompote" },
		{ "id": "lovepotion" },
		{ "id": "magichat" },
		{ "id": "mandarin" },
		{ "id": "manygifts2" },
		{ "id": "manygifts3" },
		{ "id": "manygifts4" },
		{ "id": "mardigrasmask" },
		{ "id": "maroccantea" },
		{ "id": "medicalmask" },
		{ "id": "meldonium" },
		{ "id": "menorah" },
		{ "id": "meteorit" },
		{ "id": "migalka" },
		{ "id": "minerhat" },
		{ "id": "mosque" },
		{ "id": "mushroomsbasket" },
		{ "id": "nokia" },
		{ "id": "nytree1" },
		{ "id": "oilbarrel" },
		{ "id": "ololosh" },
		{ "id": "olympichat" },
		{ "id": "olympmedal" },
		{ "id": "olympwreath" },
		{ "id": "orange" },
		{ "id": "orangutan" },
		{ "id": "owl" },
		{ "id": "painterhat" },
		{ "id": "palette" },
		{ "id": "pancake" },
		{ "id": "pancakes" },
		{ "id": "panda" },
		{ "id": "paperhat" },
		{ "id": "peach" },
		{ "id": "perfume" },
		{ "id": "petcat" },
		{ "id": "petdog" },
		{ "id": "phdhat" },
		{ "id": "picnic" },
		{ "id": "pillow" },
		{ "id": "pinguin" },
		{ "id": "piratecanon" },
		{ "id": "pirateflag" },
		{ "id": "pirateparrot" },
		{ "id": "piratespot" },
		{ "id": "pirateswords" },
		{ "id": "plaguemask" },
		{ "id": "polaroid" },
		{ "id": "pomegranate" },
		{ "id": "popcorn" },
		{ "id": "pumpkin" },
		{ "id": "pumpkinpie" },
		{ "id": "random" },
		{ "id": "redwig" },
		{ "id": "reindeer" },
		{ "id": "rocket" },
		{ "id": "romanticcandle" },
		{ "id": "rosep" },
		{ "id": "roser" },
		{ "id": "p2_rose" },
		{ "id": "rosew" },
		{ "id": "royalslug" },
		{ "id": "rzdtea" },
		{ "id": "safari" },
		{ "id": "sakura1" },
		{ "id": "salute" },
		{ "id": "p1_firework" },
		{ "id": "p2_rocket" },
		{ "id": "samovar" },
		{ "id": "santa" },
		{ "id": "seafish" },
		{ "id": "seashell" },
		{ "id": "seastar" },
		{ "id": "seeds" },
		{ "id": "shashlik" },
		{ "id": "skateboard" },
		{ "id": "sleephat" },
		{ "id": "smile" },
		{ "id": "smilecup" },
		{ "id": "snegurka" },
		{ "id": "snowball" },
		{ "id": "p2_snow" },
		{ "id": "snowdrops" },
		{ "id": "snowman1" },
		{ "id": "sofa" },
		{ "id": "spacecocktail" },
		{ "id": "spaghetti" },
		{ "id": "sponge" },
		{ "id": "springcocktail" },
		{ "id": "springwreath" },
		{ "id": "squirrel" },
		{ "id": "sturmtruppen" },
		{ "id": "submarine" },
		{ "id": "sunflower" },
		{ "id": "superbowlball" },
		{ "id": "superbowlcap" },
		{ "id": "p71_superbowlcap" },
		{ "id": "sweet_premium" },
		{ "id": "swimmers" },
		{ "id": "tankhelmet" },
		{ "id": "tarantula" },
		{ "id": "taxi" },
		{ "id": "teapot" },
		{ "id": "tearssnake" },
		{ "id": "theatremask" },
		{ "id": "thermos" },
		{ "id": "toiletpaper1" },
		{ "id": "touristmug" },
		{ "id": "trashcan2" },
		{ "id": "trashcan3" },
		{ "id": "trashcan4" },
		{ "id": "trout" },
		{ "id": "trumpet" },
		{ "id": "tub" },
		{ "id": "turkey" },
		{ "id": "tyrolhat" },
		{ "id": "ufo" },
		{ "id": "unclesam" },
		{ "id": "valenok" },
		{ "id": "valentine" },
		{ "id": "venus" },
		{ "id": "watermelon" },
		{ "id": "weight" },
		{ "id": "whistle" },
		{ "id": "winterhat" },
		{ "id": "witch" },
		{ "id": "wreath" },
		{ "id": "wreathorange" },
		{ "id": "wreathroses" },
		{ "id": "wreathviolets" },
		{ "id": "zucchini" }
	],
	gifts: /* @__PURE__ */ JSON.parse("{\"p1_crown\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"crown\":true,\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p1_crown1\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p1_crown1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p1_crown1\",\"storePrice\":3,\"type\":\"p1_crown\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p1_cap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p1_baseball1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p1_baseball1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p1_baseball1\",\"storePrice\":2,\"type\":\"p1_cap\",\"premium\":true,\"storePriceReal\":0},\"p1_cigar\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_sigara\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p1_sigara\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_sigara\",\"storePrice\":1,\"type\":\"p1_cigar\",\"premium\":true,\"storePriceReal\":0},\"p1_firework\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"boom1\",\"boom2\"],\"flyImages\":[\"g_p1_salute2\",\"g_p1_salute3\",\"g_p1_salute4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p1_salute5\",\"g_p1_salute6\",\"g_p1_salute7\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p1_salute1\",\"storePrice\":1,\"type\":\"p1_firework\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p1_champagne\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_champagne\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_champagne\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_champagne\",\"storePrice\":1,\"type\":\"p1_champagne\",\"premium\":true,\"storePriceReal\":0},\"p1_vipchampagne\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_p1_vipchampagne\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p1_vipchampagne\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_vipchampagne\",\"storePrice\":1,\"type\":\"p1_vipchampagne\",\"premium\":true,\"storePriceReal\":0},\"p1_cognac\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_cognacglass\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_cognacglass\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_cognacglass\",\"storePrice\":1,\"type\":\"p1_cognac\",\"vkMedia\":\"photo17075769_456239362\",\"premium\":true,\"storePriceReal\":0},\"p1_martini\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_martini\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_martini\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_martini\",\"storePrice\":1,\"type\":\"p1_martini\",\"premium\":true,\"storePriceReal\":0},\"p1_whiskey\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_whiskey\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_whiskey\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_whiskey\",\"storePrice\":1,\"type\":\"p1_whiskey\",\"premium\":true,\"storePriceReal\":0},\"p1_wine\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_wine\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_wine\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_wine\",\"storePrice\":1,\"type\":\"p1_wine\",\"premium\":true,\"storePriceReal\":0},\"p1_bloodymary\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_bloodymary\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_bloodymary\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_bloodymary\",\"storePrice\":1,\"type\":\"p1_bloodymary\",\"vkMedia\":\"photo17075769_456239370\",\"premium\":true,\"storePriceReal\":0},\"p1_mojito\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_mojito\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_mojito\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_mojito\",\"storePrice\":1,\"type\":\"p1_mojito\",\"vkMedia\":\"photo17075769_456239343\",\"premium\":true,\"storePriceReal\":0},\"p1_pinacolada\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_pinacolada\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_pinacolada\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_pinacolada\",\"storePrice\":1,\"type\":\"p1_pinacolada\",\"vkMedia\":\"photo17075769_456239334\",\"premium\":true,\"storePriceReal\":0},\"p1_b52\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p1_b52\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p1_b52\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p1_b52\",\"storePrice\":2,\"type\":\"p1_b52\",\"vkMedia\":\"photo17075769_456239371\",\"premium\":true,\"storePriceReal\":0},\"p2_crown\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"crown\":true,\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p2_crown1\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p2_crown1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p2_crown1\",\"storePrice\":3,\"type\":\"p2_crown\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p2_tomato\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tomato1\",\"tomato2\"],\"flyImages\":[\"g_p2_tomato1_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_tomato2_v2\",\"g_p2_tomato3_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_tomato1_v2\",\"storePrice\":1,\"type\":\"p2_tomato\",\"premium\":true,\"storePriceReal\":0},\"p2_rocket\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"boom1\",\"boom2\"],\"flyImages\":[\"g_p2_salute2\",\"g_p2_salute3\",\"g_p2_salute4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_salute5\",\"g_p2_salute6\",\"g_p2_salute7\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_salute1\",\"storePrice\":1,\"type\":\"p2_rocket\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p2_heart\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_heartangel\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_heartangel\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_heartangel\",\"storePrice\":1,\"type\":\"p2_heart\",\"premium\":true,\"storePriceReal\":0},\"p2_rose\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p2_rose4_v2\",\"g_p2_rose5_v2\",\"g_p2_rose6_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_rose4_v2\",\"g_p2_rose5_v2\",\"g_p2_rose6_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_rose4_v2\",\"storePrice\":1,\"type\":\"p2_rose\",\"premium\":true,\"storePriceReal\":0},\"p2_snow\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"snow2\",\"snow3\",\"snow4\"],\"flyImages\":[\"g_p2_snowball1\",\"g_p2_snowball1\",\"g_p2_snowball1\",\"g_p2_snowball1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_snowball2\",\"g_p2_snowball3\",\"g_p2_snowball4\",\"g_p2_snowball5\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_snowball1\",\"storePrice\":1,\"type\":\"p2_snow\",\"premium\":true,\"storePriceReal\":0},\"p2_leaf\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p2_leaf1_v2\",\"g_p2_leaf2_v2\",\"g_p2_leaf3_v2\",\"g_p2_leaf4_v2\",\"g_p2_leaf5_v2\",\"g_p2_leaf6_v2\",\"g_p2_leaf7_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_leaf1_v2\",\"g_p2_leaf2_v2\",\"g_p2_leaf3_v2\",\"g_p2_leaf4_v2\",\"g_p2_leaf5_v2\",\"g_p2_leaf6_v2\",\"g_p2_leaf7_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_leaf1_v2\",\"storePrice\":1,\"type\":\"p2_leaf\",\"premium\":true,\"storePriceReal\":0},\"p2_flagaz\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_flagaz\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_flagaz\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_flagaz\",\"storePrice\":1,\"type\":\"p2_flagaz\",\"premium\":true,\"storePriceReal\":0},\"p2_flagge\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_flagge\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_flagge\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_flagge\",\"storePrice\":1,\"type\":\"p2_flagge\",\"premium\":true,\"storePriceReal\":0},\"p2_cappyred\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p2_cappy_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_cappy_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p2_cappy_v2\",\"storePrice\":2,\"type\":\"p2_cappyred\",\"vkMedia\":\"photo17075769_456239366\",\"premium\":true,\"storePriceReal\":0},\"p2_phone\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_phonering\"],\"flyImages\":[\"g_p2_mobile1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_mobile2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_mobile1\",\"storePrice\":3,\"type\":\"p2_phone\",\"premium\":true,\"storePriceReal\":0},\"p2_queen\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_p2_eiffeltower\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_eiffeltower\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_eiffeltower\",\"storePrice\":5,\"type\":\"p2_queen\",\"vkMedia\":\"photo17075769_456239444\",\"premium\":true,\"storePriceReal\":0},\"p2_crystalqueen\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_goldenmic\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_goldenmic\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_goldenmic\",\"storePrice\":5,\"type\":\"p2_crystalqueen\",\"premium\":true,\"storePriceReal\":0},\"p2_diamond\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_diamond\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_diamond\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_diamond\",\"storePrice\":1,\"type\":\"p2_diamond\",\"premium\":true,\"storePriceReal\":0},\"p2_champagne\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_champagne\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p2_champagne\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_champagne\",\"storePrice\":1,\"type\":\"p2_champagne\",\"premium\":true,\"storePriceReal\":0},\"p2_cake\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_birthdaycake_v2\",\"g_p2_birthdaycake2\",\"g_p2_birthdaycake3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_birthdaycake_v2\",\"g_p2_birthdaycake2\",\"g_p2_birthdaycake3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_birthdaycake_v2\",\"storePrice\":1,\"type\":\"p2_cake\",\"premium\":true,\"storePriceReal\":0},\"p2_star\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p2_goldstar\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_goldstar\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_goldstar\",\"storePrice\":1,\"type\":\"p2_star\",\"premium\":true,\"storePriceReal\":0},\"p2_dove\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_dove\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_dove\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_dove\",\"storePrice\":1,\"type\":\"p2_dove\",\"premium\":true,\"storePriceReal\":0},\"p2_lovelock\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_heartlock\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_heartlock\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_heartlock\",\"storePrice\":1,\"type\":\"p2_lovelock\",\"premium\":true,\"storePriceReal\":0},\"p2_money\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p2_dollar\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_dollar\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_dollar\",\"storePrice\":1,\"type\":\"p2_money\",\"vkMedia\":\"photo17075769_456239357\",\"premium\":true,\"storePriceReal\":0},\"p2_bouquet\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p2_bouquet_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_bouquet_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_bouquet_v2\",\"storePrice\":1,\"type\":\"p2_bouquet\",\"premium\":true,\"storePriceReal\":0},\"p2_lamp\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_p2_genielamp_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_genielamp_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p2_genielamp_v2\",\"storePrice\":1,\"type\":\"p2_lamp\",\"vkMedia\":\"photo17075769_456239356\",\"premium\":true,\"storePriceReal\":0},\"p2_loveyou\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p2_iloveyou\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p2_iloveyou\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p2_iloveyou\",\"storePrice\":1,\"type\":\"p2_loveyou\",\"premium\":true,\"storePriceReal\":0},\"p6_crown_queen\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"crown\":true,\"finishSounds\":[\"mg_p6_crown_queen\"],\"flyImages\":[\"g_p6_crown1\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p6_crown1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p6_crown1\",\"storePrice\":3,\"type\":\"p6_crown_queen\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p6_crown_shah\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"crown\":true,\"finishSounds\":[\"mg_p6_crown_shah\"],\"flyImages\":[\"g_p6_crown2\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p6_crown2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p6_crown2\",\"storePrice\":3,\"type\":\"p6_crown_shah\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p6_kiss_diamond\":{\"category\":\"gift\",\"chatIcon\":\"kiss\",\"finishSounds\":[\"mg_p6_kiss_diamond\"],\"flyImages\":[\"g_p6_air_kiss1_v2\",\"g_p6_air_kiss2_v2\",\"g_p6_air_kiss3_v2\",\"g_p6_air_kiss4_v3\",\"g_p6_air_kiss5_v2\"],\"kiss\":1,\"startSounds\":[\"kissing_our\",\"kissing2\",\"kissing3\"],\"stickImages\":[\"g_p6_air_kiss1_v2\",\"g_p6_air_kiss2_v2\",\"g_p6_air_kiss3_v2\",\"g_p6_air_kiss4_v3\",\"g_p6_air_kiss5_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p6_air_kiss1_v2\",\"storePrice\":1,\"type\":\"p6_kiss_diamond\",\"premium\":true,\"storePriceReal\":0},\"p6_kiss_heart\":{\"category\":\"gift\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_kiss_heart\"],\"flyImages\":[\"g_p6_tomato1_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_tomato2_v2\",\"g_p6_tomato3_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p6_tomato1_v2\",\"storePrice\":1,\"type\":\"p6_kiss_heart\",\"premium\":true,\"storePriceReal\":0},\"p6_bq_sapphire\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_bq_sapphire\"],\"flyImages\":[\"g_p6_bouquet_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_bouquet_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p6_bouquet_v2\",\"storePrice\":1,\"type\":\"p6_bq_sapphire\",\"premium\":true,\"storePriceReal\":0},\"p6_bq_ruby\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_bq_ruby\"],\"flyImages\":[\"g_p6_bouquet2_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_bouquet2_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p6_bouquet2_v2\",\"storePrice\":1,\"type\":\"p6_bq_ruby\",\"premium\":true,\"storePriceReal\":0},\"p6_rose_diamond\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_rose_diamond\"],\"flyImages\":[\"g_p6_diamondgift\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_diamondgift\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p6_diamondgift\",\"storePrice\":1,\"type\":\"p6_rose_diamond\",\"premium\":true,\"storePriceReal\":0},\"p6_rose_gold\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_rose_gold\"],\"flyImages\":[\"g_p6_clutch\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_clutch\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p6_clutch\",\"storePrice\":1,\"type\":\"p6_rose_gold\",\"vkMedia\":\"photo17075769_456239428\",\"premium\":true,\"storePriceReal\":0},\"p6_ring_ruby\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_ring_ruby\"],\"flyImages\":[\"g_p6_blackring\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_blackring\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p6_blackring\",\"storePrice\":1,\"type\":\"p6_ring_ruby\",\"premium\":true,\"storePriceReal\":0},\"p6_ring_box\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_ring_box\"],\"flyImages\":[\"g_p6_diamond\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_diamond\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p6_diamond\",\"storePrice\":1,\"type\":\"p6_ring_box\",\"premium\":true,\"storePriceReal\":0},\"p6_hat_gent\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_hat_gent\"],\"flyImages\":[\"g_p6_baseball1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_baseball1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p6_baseball1\",\"storePrice\":2,\"type\":\"p6_hat_gent\",\"premium\":true,\"storePriceReal\":0},\"p6_hat_lady\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"mg_p6_hat_lady\"],\"flyImages\":[\"g_p6_djcap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p6_djcap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p6_djcap\",\"storePrice\":2,\"type\":\"p6_hat_lady\",\"premium\":true,\"storePriceReal\":0},\"p71_crown1\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"crown\":true,\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_crown1\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p71_crown1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_crown1\",\"storePrice\":3,\"type\":\"p71_crown1\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p71_crown2\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"crown\":true,\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_crown2\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p71_crown2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_crown2\",\"storePrice\":3,\"type\":\"p71_crown2\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p71_crown3\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"crown\":true,\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_crown3\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p71_crown3\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_crown3\",\"storePrice\":3,\"type\":\"p71_crown3\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p71_crown4\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"crown\":true,\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_crown4\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p71_crown4\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_crown4\",\"storePrice\":3,\"type\":\"p71_crown4\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p71_vipcrown\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_vipcrown\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p71_vipcrown\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_vipcrown\",\"storePrice\":3,\"type\":\"p71_vipcrown\",\"vfx\":\"magic\",\"premium\":true,\"storePriceReal\":0},\"p71_icecrown\":{\"category\":\"hat\",\"chatIcon\":\"crown\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_icecrown_v2\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p71_icecrown_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_icecrown_v2\",\"storePrice\":2,\"type\":\"p71_icecrown\",\"vfx\":\"magic\",\"vkMedia\":\"photo17075769_456239353\",\"premium\":true,\"storePriceReal\":0},\"p71_blackcrown\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_blackcrown_v2\"],\"startSounds\":[\"fanfare1\",\"fanfare2\"],\"stickImages\":[\"g_p71_blackcrown_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_blackcrown_v2\",\"storePrice\":3,\"type\":\"p71_blackcrown\",\"premium\":true,\"storePriceReal\":0},\"p71_babecap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_babecap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_babecap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_babecap\",\"storePrice\":2,\"type\":\"p71_babecap\",\"premium\":true,\"storePriceReal\":0},\"p71_baseball1\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_baseball1\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_baseball1\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_baseball1\",\"storePrice\":2,\"type\":\"p71_baseball1\",\"premium\":true,\"storePriceReal\":0},\"p71_baseball4\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_baseball4\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_baseball4\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_baseball4\",\"storePrice\":2,\"type\":\"p71_baseball4\",\"premium\":true,\"storePriceReal\":0},\"p71_baseball5\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_baseball5\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_baseball5\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_baseball5\",\"storePrice\":2,\"type\":\"p71_baseball5\",\"premium\":true,\"storePriceReal\":0},\"p71_baseball6\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_baseball6\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_baseball6\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_baseball6\",\"storePrice\":2,\"type\":\"p71_baseball6\",\"premium\":true,\"storePriceReal\":0},\"p71_bosscap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_bosscap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_bosscap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_bosscap\",\"storePrice\":2,\"type\":\"p71_bosscap\",\"vkMedia\":\"photo17075769_456239368\",\"premium\":true,\"storePriceReal\":0},\"p71_boybyecap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_boybyecap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_boybyecap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_boybyecap\",\"storePrice\":2,\"type\":\"p71_boybyecap\",\"premium\":true,\"storePriceReal\":0},\"p71_cappy\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_cappy_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_cappy_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_cappy_v2\",\"storePrice\":2,\"type\":\"p71_cappy\",\"vkMedia\":\"photo17075769_456239366\",\"premium\":true,\"storePriceReal\":0},\"p71_djcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_djcap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_djcap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_djcap\",\"storePrice\":2,\"type\":\"p71_djcap\",\"premium\":true,\"storePriceReal\":0},\"p71_goodenuffcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_goodenuffcap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_goodenuffcap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_goodenuffcap\",\"storePrice\":2,\"type\":\"p71_goodenuffcap\",\"premium\":true,\"storePriceReal\":0},\"p71_kingcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_kingcap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_kingcap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_kingcap\",\"storePrice\":2,\"type\":\"p71_kingcap\",\"premium\":true,\"storePriceReal\":0},\"p71_mrcoolcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_mrcoolcap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_mrcoolcap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_mrcoolcap\",\"storePrice\":2,\"type\":\"p71_mrcoolcap\",\"premium\":true,\"storePriceReal\":0},\"p71_omgcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_omgcap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_omgcap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_omgcap\",\"storePrice\":2,\"type\":\"p71_omgcap\",\"premium\":true,\"storePriceReal\":0},\"p71_savagecap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_savagecap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_savagecap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_savagecap\",\"storePrice\":2,\"type\":\"p71_savagecap\",\"premium\":true,\"storePriceReal\":0},\"p71_superbowlcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_superbowlcap_2020\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_superbowlcap_2020\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_superbowlcap_2020\",\"storePrice\":2,\"type\":\"p71_superbowlcap\",\"premium\":true,\"storePriceReal\":0},\"p71_supermecap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_supermecap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_supermecap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_supermecap\",\"storePrice\":2,\"type\":\"p71_supermecap\",\"premium\":true,\"storePriceReal\":0},\"p71_blackoverlordcap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_blackoverlordcap_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_blackoverlordcap_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_blackoverlordcap_v2\",\"storePrice\":2,\"type\":\"p71_blackoverlordcap\",\"vkMedia\":\"photo17075769_456239449\",\"premium\":true,\"storePriceReal\":0},\"p71_lenincap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_lenincap_v2\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_lenincap_v2\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_lenincap_v2\",\"storePrice\":2,\"type\":\"p71_lenincap\",\"premium\":true,\"storePriceReal\":0},\"p71_goodvibescap\":{\"category\":\"hat\",\"chatIcon\":\"gift\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p71_goodvibescap\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_goodvibescap\"],\"stickPoint\":\"hat\",\"storeImage\":\"g_p71_goodvibescap\",\"storePrice\":2,\"type\":\"p71_goodvibescap\",\"premium\":true,\"storePriceReal\":0},\"p72_air_kiss\":{\"category\":\"gift\",\"chatIcon\":\"kiss\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p72_air_kiss1_v2\",\"g_p72_air_kiss2_v2\",\"g_p72_air_kiss3_v2\",\"g_p72_air_kiss4_v3\",\"g_p72_air_kiss5_v2\"],\"kiss\":1,\"startSounds\":[\"kissing_our\",\"kissing2\",\"kissing3\"],\"stickImages\":[\"g_p72_air_kiss1_v2\",\"g_p72_air_kiss2_v2\",\"g_p72_air_kiss3_v2\",\"g_p72_air_kiss4_v3\",\"g_p72_air_kiss5_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p72_air_kiss1_v2\",\"storePrice\":1,\"type\":\"p72_air_kiss\",\"premium\":true,\"storePriceReal\":0},\"p73_air_kiss\":{\"category\":\"gift\",\"chatIcon\":\"kiss\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p73_air_kiss1_v2\",\"g_p73_air_kiss2_v2\",\"g_p73_air_kiss3_v2\",\"g_p73_air_kiss4_v3\",\"g_p73_air_kiss5_v2\"],\"kiss\":1,\"startSounds\":[\"kissing_our\",\"kissing2\",\"kissing3\"],\"stickImages\":[\"g_p73_air_kiss1_v2\",\"g_p73_air_kiss2_v2\",\"g_p73_air_kiss3_v2\",\"g_p73_air_kiss4_v3\",\"g_p73_air_kiss5_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p73_air_kiss1_v2\",\"storePrice\":1,\"type\":\"p73_air_kiss\",\"premium\":true,\"storePriceReal\":0},\"p74_air_kiss\":{\"category\":\"gift\",\"chatIcon\":\"kiss\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p74_air_kiss1_v2\",\"g_p74_air_kiss2_v2\",\"g_p74_air_kiss3_v2\",\"g_p74_air_kiss4_v3\",\"g_p74_air_kiss5_v2\"],\"kiss\":1,\"startSounds\":[\"kissing_our\",\"kissing2\",\"kissing3\"],\"stickImages\":[\"g_p74_air_kiss1_v2\",\"g_p74_air_kiss2_v2\",\"g_p74_air_kiss3_v2\",\"g_p74_air_kiss4_v3\",\"g_p74_air_kiss5_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p74_air_kiss1_v2\",\"storePrice\":1,\"type\":\"p74_air_kiss\",\"premium\":true,\"storePriceReal\":0},\"p75_air_kiss\":{\"category\":\"gift\",\"chatIcon\":\"kiss\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p75_air_kiss1_v2\",\"g_p75_air_kiss2_v2\",\"g_p75_air_kiss3_v2\",\"g_p75_air_kiss4_v3\",\"g_p75_air_kiss5_v2\"],\"kiss\":1,\"startSounds\":[\"kissing_our\",\"kissing2\",\"kissing3\"],\"stickImages\":[\"g_p75_air_kiss1_v2\",\"g_p75_air_kiss2_v2\",\"g_p75_air_kiss3_v2\",\"g_p75_air_kiss4_v3\",\"g_p75_air_kiss5_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p75_air_kiss1_v2\",\"storePrice\":1,\"type\":\"p75_air_kiss\",\"premium\":true,\"storePriceReal\":0},\"p76_air_kiss\":{\"category\":\"gift\",\"chatIcon\":\"kiss\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p76_air_kiss1_v2\",\"g_p76_air_kiss2_v2\",\"g_p76_air_kiss3_v2\",\"g_p76_air_kiss4_v3\",\"g_p76_air_kiss5_v2\"],\"kiss\":1,\"startSounds\":[\"kissing_our\",\"kissing2\",\"kissing3\"],\"stickImages\":[\"g_p76_air_kiss1_v2\",\"g_p76_air_kiss2_v2\",\"g_p76_air_kiss3_v2\",\"g_p76_air_kiss4_v3\",\"g_p76_air_kiss5_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p76_air_kiss1_v2\",\"storePrice\":1,\"type\":\"p76_air_kiss\",\"premium\":true,\"storePriceReal\":0},\"p77_air_kiss\":{\"category\":\"gift\",\"chatIcon\":\"kiss\",\"finishSounds\":[\"tick\"],\"flyImages\":[\"g_p77_air_kiss1_v2\",\"g_p77_air_kiss2_v2\",\"g_p77_air_kiss3_v2\",\"g_p77_air_kiss4_v3\",\"g_p77_air_kiss5_v2\"],\"kiss\":1,\"startSounds\":[\"kissing_our\",\"kissing2\",\"kissing3\"],\"stickImages\":[\"g_p77_air_kiss1_v2\",\"g_p77_air_kiss2_v2\",\"g_p77_air_kiss3_v2\",\"g_p77_air_kiss4_v3\",\"g_p77_air_kiss5_v2\"],\"stickPoint\":\"ava\",\"storeImage\":\"g_p77_air_kiss1_v2\",\"storePrice\":1,\"type\":\"p77_air_kiss\",\"premium\":true,\"storePriceReal\":0},\"p72_nipple\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"nipple\"],\"flyImages\":[\"g_p72_nipple1\",\"g_p72_nipple2\",\"g_p72_nipple3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p72_nipple1\",\"g_p72_nipple2\",\"g_p72_nipple3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p72_nipple1\",\"storePrice\":1,\"type\":\"p72_nipple\",\"vkMedia\":\"photo17075769_456239340\",\"premium\":true,\"storePriceReal\":0},\"p73_nipple\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"nipple\"],\"flyImages\":[\"g_p73_nipple1\",\"g_p73_nipple2\",\"g_p73_nipple3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p73_nipple1\",\"g_p73_nipple2\",\"g_p73_nipple3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p73_nipple1\",\"storePrice\":1,\"type\":\"p73_nipple\",\"vkMedia\":\"photo17075769_456239340\",\"premium\":true,\"storePriceReal\":0},\"p74_nipple\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"nipple\"],\"flyImages\":[\"g_p74_nipple1\",\"g_p74_nipple2\",\"g_p74_nipple3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p74_nipple1\",\"g_p74_nipple2\",\"g_p74_nipple3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p74_nipple1\",\"storePrice\":1,\"type\":\"p74_nipple\",\"vkMedia\":\"photo17075769_456239340\",\"premium\":true,\"storePriceReal\":0},\"p78_nipple\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"nipple\"],\"flyImages\":[\"g_p78_nipple1\",\"g_p78_nipple2\",\"g_p78_nipple3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p78_nipple1\",\"g_p78_nipple2\",\"g_p78_nipple3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p78_nipple1\",\"storePrice\":1,\"type\":\"p78_nipple\",\"vkMedia\":\"photo17075769_456239340\",\"premium\":true,\"storePriceReal\":0},\"p71_nipple\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"nipple\"],\"flyImages\":[\"g_p71_nipple1\",\"g_p71_nipple2\",\"g_p71_nipple3\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p71_nipple1\",\"g_p71_nipple2\",\"g_p71_nipple3\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p71_nipple1\",\"storePrice\":1,\"type\":\"p71_nipple\",\"vkMedia\":\"photo17075769_456239340\",\"premium\":true,\"storePriceReal\":0},\"p73_bluelagoon\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p73_bluelagoon\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p73_bluelagoon\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p73_bluelagoon\",\"storePrice\":1,\"type\":\"p73_bluelagoon\",\"vkMedia\":\"photo17075769_456239369\",\"premium\":true,\"storePriceReal\":0},\"p72_cocoscocktail\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p72_cocoscocktail_v2\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p72_cocoscocktail_v2\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p72_cocoscocktail_v2\",\"storePrice\":1,\"type\":\"p72_cocoscocktail\",\"vkMedia\":\"photo17075769_457239606\",\"premium\":true,\"storePriceReal\":0},\"p74_daiquiri\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p74_daiquiri\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p74_daiquiri\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p74_daiquiri\",\"storePrice\":1,\"type\":\"p74_daiquiri\",\"vkMedia\":\"photo17075769_456239358\",\"premium\":true,\"storePriceReal\":0},\"p75_sexonthebeach\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p75_sexonthebeach\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p75_sexonthebeach\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p75_sexonthebeach\",\"storePrice\":2,\"type\":\"p75_sexonthebeach\",\"vkMedia\":\"photo17075769_456239327\",\"premium\":true,\"storePriceReal\":0},\"p76_tequilashot\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p76_tequilashot\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p76_tequilashot\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p76_tequilashot\",\"storePrice\":1,\"type\":\"p76_tequilashot\",\"vkMedia\":\"photo17075769_456239320\",\"premium\":true,\"storePriceReal\":0},\"p72_milkcoctail\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_p72_milkcoctail\"],\"startSounds\":[\"coffee\"],\"stickImages\":[\"g_p72_milkcoctail\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p72_milkcoctail\",\"storePrice\":1,\"type\":\"p72_milkcoctail\",\"premium\":true,\"storePriceReal\":0},\"p73_smoothie\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"beer_tap\"],\"flyImages\":[\"g_p73_smoothie\"],\"startSounds\":[\"snow\"],\"stickImages\":[\"g_p73_smoothie\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p73_smoothie\",\"storePrice\":1,\"type\":\"p73_smoothie\",\"vkMedia\":\"photo17075769_456239451\",\"premium\":true,\"storePriceReal\":0},\"p74_vodka\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p74_vodka\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p74_vodka\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p74_vodka\",\"storePrice\":3,\"type\":\"p74_vodka\",\"premium\":true,\"storePriceReal\":0},\"p71_juice\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p71_juice\"],\"startSounds\":[\"pouring_water_glass\"],\"stickImages\":[\"g_p71_juice\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p71_juice\",\"storePrice\":1,\"type\":\"p71_juice\",\"premium\":true,\"storePriceReal\":0},\"p79_latte\":{\"category\":\"drink\",\"chatIcon\":\"gift\",\"finishSounds\":[\"light_tap\"],\"flyImages\":[\"g_p79_latte\"],\"startSounds\":[\"coffee\"],\"stickImages\":[\"g_p79_latte\"],\"stickPoint\":\"drink\",\"storeImage\":\"g_p79_latte\",\"storePrice\":1,\"type\":\"p79_latte\",\"vkMedia\":\"photo17075769_456239348\",\"premium\":true,\"storePriceReal\":0}}"),
	images: {
		"g_p1_crown1": { "size": [
			-28,
			-35,
			56,
			54
		] },
		"g_p1_baseball1": { "size": [
			-48,
			-16,
			75,
			52
		] },
		"g_p1_sigara": {
			"size": [
				-29.55,
				-28,
				47.8,
				67.2
			],
			"size_v2": [
				-17.6,
				-61.6,
				47.8,
				67.2
			]
		},
		"g_p1_salute2": { "size": [
			-19,
			-19,
			38,
			38
		] },
		"g_p1_salute3": { "size": [
			-19,
			-19,
			38,
			38
		] },
		"g_p1_salute4": { "size": [
			-19,
			-19,
			38,
			38
		] },
		"g_p1_salute5": { "size": [
			-25,
			-25,
			51,
			50
		] },
		"g_p1_salute6": { "size": [
			-26,
			-25,
			52,
			50
		] },
		"g_p1_salute7": { "size": [
			-26,
			-25,
			51,
			50
		] },
		"g_p1_salute1": { "size": [
			-30,
			-32,
			60,
			64
		] },
		"g_p1_champagne": {
			"size": [
				-15,
				-44.9,
				30,
				90
			],
			"size_v2": [
				-7.5,
				-89.9,
				30,
				90
			]
		},
		"g_p1_vipchampagne": {
			"size": [
				-26.52,
				-44.2,
				51.3,
				94.2
			],
			"size_v2": [
				-13.7,
				-91.3,
				51.3,
				94.2
			]
		},
		"g_p1_cognacglass": {
			"size": [
				-20.1,
				-40.7,
				40.2,
				61.69
			],
			"size_v2": [
				-10.05,
				-71.54,
				40.2,
				61.69
			]
		},
		"g_p1_martini": {
			"size": [
				-31.95,
				-38,
				57,
				76
			],
			"size_v2": [
				-17.7,
				-76,
				57,
				76
			]
		},
		"g_p1_whiskey": {
			"size": [
				-20.9,
				-25,
				44,
				48
			],
			"size_v2": [
				-9.9,
				-49,
				44,
				48
			]
		},
		"g_p1_wine": {
			"size": [
				-17.9,
				-42,
				36,
				84
			],
			"size_v2": [
				-8.9,
				-84,
				36,
				84
			]
		},
		"g_p1_bloodymary": {
			"size": [
				-31,
				-30,
				62,
				59
			],
			"size_v2": [
				-15.5,
				-59.5,
				62,
				59
			]
		},
		"g_p1_mojito": {
			"size": [
				-28.05,
				-44,
				53,
				88
			],
			"size_v2": [
				-14.8,
				-88,
				53,
				88
			]
		},
		"g_p1_pinacolada": {
			"size": [
				-20,
				-48.9,
				40,
				98
			],
			"size_v2": [
				-10,
				-97.9,
				40,
				98
			]
		},
		"g_p1_b52": {
			"size": [
				-17.9,
				-26.9,
				36,
				54
			],
			"size_v2": [
				-8.9,
				-53.9,
				36,
				54
			]
		},
		"g_p2_crown1": { "size": [
			-28,
			-35,
			56,
			54
		] },
		"g_p2_tomato1_v2": { "size": [
			-22.59,
			-21.85,
			45.17,
			43.7
		] },
		"g_p2_tomato2_v2": { "size": [
			-28.23,
			-26.06,
			56.46,
			52.12
		] },
		"g_p2_tomato3_v2": { "size": [
			-25.71,
			-29.52,
			51.42,
			59.03
		] },
		"g_p2_salute2": { "size": [
			-19,
			-19,
			38,
			38
		] },
		"g_p2_salute3": { "size": [
			-19,
			-19,
			38,
			38
		] },
		"g_p2_salute4": { "size": [
			-19,
			-19,
			38,
			38
		] },
		"g_p2_salute5": { "size": [
			-25,
			-25,
			51,
			50
		] },
		"g_p2_salute6": { "size": [
			-26,
			-25,
			52,
			50
		] },
		"g_p2_salute7": { "size": [
			-26,
			-25,
			51,
			50
		] },
		"g_p2_salute1": { "size": [
			-30,
			-32,
			60,
			64
		] },
		"g_p2_heartangel": { "size": [
			-41.8,
			-23.6,
			83.2,
			45.4
		] },
		"g_p2_rose4_v2": { "size": [
			-26.89,
			-23.06,
			60.74,
			46.12
		] },
		"g_p2_rose5_v2": { "size": [
			-23.22,
			-23.76,
			52.46,
			47.52
		] },
		"g_p2_rose6_v2": { "size": [
			-21.74,
			-23.47,
			49.12,
			46.93
		] },
		"g_p2_snowball1": { "size": [
			-22,
			-22,
			45,
			44
		] },
		"g_p2_snowball2": { "size": [
			-25,
			-25,
			50,
			50
		] },
		"g_p2_snowball3": { "size": [
			-25,
			-25,
			50,
			50
		] },
		"g_p2_snowball4": { "size": [
			-25,
			-25,
			50,
			50
		] },
		"g_p2_snowball5": { "size": [
			-25,
			-25,
			50,
			50
		] },
		"g_p2_leaf1_v2": { "size": [
			-21.9,
			-24.71,
			43.8,
			49.42
		] },
		"g_p2_leaf2_v2": { "size": [
			-14.6,
			-22.35,
			29.2,
			44.7
		] },
		"g_p2_leaf3_v2": { "size": [
			-24.6,
			-25.1,
			49.2,
			50.21
		] },
		"g_p2_leaf4_v2": { "size": [
			-25.5,
			-24.82,
			50.99,
			49.65
		] },
		"g_p2_leaf5_v2": { "size": [
			-23.03,
			-22.74,
			46.05,
			45.49
		] },
		"g_p2_leaf6_v2": { "size": [
			-18.42,
			-23.98,
			36.84,
			47.96
		] },
		"g_p2_leaf7_v2": { "size": [
			-21.9,
			-25.05,
			43.8,
			50.09
		] },
		"g_p2_flagaz": {
			"size": [
				-14,
				-40.9,
				40,
				82
			],
			"size_v2": [
				-4,
				-81.9,
				40,
				82
			]
		},
		"g_p2_flagge": {
			"size": [
				-12.05,
				-39,
				37,
				79
			],
			"size_v2": [
				-2.8,
				-78.5,
				37,
				79
			]
		},
		"g_p2_cappy_v2": { "size": [
			-44,
			-11.03,
			84.61,
			47.96
		] },
		"g_p2_mobile1": {
			"size": [
				-13.2,
				-27.5,
				35.6,
				55
			],
			"size_v2": [
				-4.3,
				-55,
				35.6,
				55
			]
		},
		"g_p2_mobile2": {
			"size": [
				-13.2,
				-27.5,
				35.6,
				55
			],
			"size_v2": [
				-4.3,
				-55,
				35.6,
				55
			]
		},
		"g_p2_eiffeltower": {
			"size": [
				-29.02,
				-46.85,
				58.9,
				93.3
			],
			"size_v2": [
				-14.3,
				-93.5,
				58.9,
				93.3
			]
		},
		"g_p2_goldenmic": {
			"size": [
				-50.98,
				-39.68,
				60.69,
				86.26
			],
			"size_v2": [
				-35.81,
				-82.81,
				60.69,
				86.26
			]
		},
		"g_p2_diamond": {
			"size": [
				-30.95,
				-24,
				57,
				48
			],
			"size_v2": [
				-16.7,
				-48,
				57,
				48
			]
		},
		"g_p2_champagne": {
			"size": [
				-15,
				-44.9,
				30,
				90
			],
			"size_v2": [
				-7.5,
				-89.9,
				30,
				90
			]
		},
		"g_p2_birthdaycake_v2": {
			"size": [
				-31.59,
				-43.53,
				50.95,
				101.22
			],
			"size_v2": [
				-18.85,
				-94.14,
				50.95,
				101.22
			]
		},
		"g_p2_birthdaycake2": {
			"size": [
				-31.59,
				-43.53,
				50.95,
				101.22
			],
			"size_v2": [
				-18.85,
				-94.14,
				50.95,
				101.22
			]
		},
		"g_p2_birthdaycake3": {
			"size": [
				-31.59,
				-43.53,
				50.95,
				101.22
			],
			"size_v2": [
				-18.85,
				-94.14,
				50.95,
				101.22
			]
		},
		"g_p2_goldstar": { "size": [
			-26,
			-25,
			52,
			50
		] },
		"g_p2_dove": {
			"size": [
				-28.83,
				-36.09,
				59.85,
				72.18
			],
			"size_v2": [
				-13.87,
				-72.18,
				59.85,
				72.18
			]
		},
		"g_p2_heartlock": {
			"size": [
				-25.9,
				-37,
				52,
				68
			],
			"size_v2": [
				-12.9,
				-71,
				52,
				68
			]
		},
		"g_p2_dollar": { "size": [
			-24,
			-13,
			48,
			27
		] },
		"g_p2_bouquet_v2": {
			"size": [
				-46.93,
				-40.89,
				62.58,
				90.86
			],
			"size_v2": [
				-31.29,
				-86.32,
				62.58,
				90.86
			]
		},
		"g_p2_genielamp_v2": {
			"size": [
				-63.96,
				-25.62,
				80.97,
				67.43
			],
			"size_v2": [
				-43.72,
				-59.33,
				80.97,
				67.43
			]
		},
		"g_p2_iloveyou": { "size": [
			-20.59,
			-20.86,
			41.17,
			41.71
		] },
		"g_p6_crown1": { "size": [
			-28,
			-35,
			56,
			54
		] },
		"g_p6_crown2": { "size": [
			-34,
			-26,
			68,
			55
		] },
		"g_p6_air_kiss1_v2": { "size": [
			-25,
			-19,
			50,
			39
		] },
		"g_p6_air_kiss2_v2": { "size": [
			-24,
			-17,
			47,
			36
		] },
		"g_p6_air_kiss3_v2": { "size": [
			-25,
			-17,
			50,
			37
		] },
		"g_p6_air_kiss4_v3": { "size": [
			-25,
			-20,
			49,
			40
		] },
		"g_p6_air_kiss5_v2": { "size": [
			-23,
			-22,
			45,
			44
		] },
		"g_p6_tomato1_v2": { "size": [
			-22.59,
			-21.85,
			45.17,
			43.7
		] },
		"g_p6_tomato2_v2": { "size": [
			-28.23,
			-26.06,
			56.46,
			52.12
		] },
		"g_p6_tomato3_v2": { "size": [
			-25.71,
			-29.52,
			51.42,
			59.03
		] },
		"g_p6_bouquet_v2": {
			"size": [
				-46.93,
				-40.89,
				62.58,
				90.86
			],
			"size_v2": [
				-31.29,
				-86.32,
				62.58,
				90.86
			]
		},
		"g_p6_bouquet2_v2": {
			"size": [
				-54.76,
				-36.27,
				71.12,
				82.44
			],
			"size_v2": [
				-36.98,
				-77.49,
				71.12,
				82.44
			]
		},
		"g_p6_diamondgift": {
			"size": [
				-30.95,
				-24,
				57,
				48
			],
			"size_v2": [
				-16.7,
				-48,
				57,
				48
			]
		},
		"g_p6_clutch": {
			"size": [
				-44.15,
				-26.5,
				67,
				54.8
			],
			"size_v2": [
				-27.4,
				-53.9,
				67,
				54.8
			]
		},
		"g_p6_blackring": {
			"size": [
				-36.85,
				-33.8,
				49,
				70
			],
			"size_v2": [
				-24.6,
				-68.8,
				49,
				70
			]
		},
		"g_p6_diamond": {
			"size": [
				-30.95,
				-24,
				57,
				48
			],
			"size_v2": [
				-16.7,
				-48,
				57,
				48
			]
		},
		"g_p6_baseball1": { "size": [
			-48,
			-16,
			75,
			52
		] },
		"g_p6_djcap": { "size": [
			-39.3,
			-19.3,
			75.4,
			65.1
		] },
		"g_p71_crown1": { "size": [
			-28,
			-35,
			56,
			54
		] },
		"g_p71_crown2": { "size": [
			-34,
			-26,
			68,
			55
		] },
		"g_p71_crown3": { "size": [
			-28,
			-25,
			57,
			56
		] },
		"g_p71_crown4": { "size": [
			-32,
			-35,
			64,
			62
		] },
		"g_p71_vipcrown": { "size": [
			-32.6,
			-32.6,
			65.1,
			65.1
		] },
		"g_p71_icecrown_v2": { "size": [
			-39.17,
			-18.99,
			78.34,
			59.33
		] },
		"g_p71_blackcrown_v2": { "size": [
			-39.58,
			-19.89,
			77.62,
			62.15
		] },
		"g_p71_babecap": { "size": [
			-43,
			-10.7,
			75,
			50.1
		] },
		"g_p71_baseball1": { "size": [
			-48,
			-16,
			75,
			52
		] },
		"g_p71_baseball4": { "size": [
			-45,
			-20,
			70,
			59
		] },
		"g_p71_baseball5": { "size": [
			-45,
			-19,
			70,
			58
		] },
		"g_p71_baseball6": { "size": [
			-45,
			-19,
			70,
			58
		] },
		"g_p71_bosscap": { "size": [
			-41,
			-10,
			75,
			58
		] },
		"g_p71_boybyecap": { "size": [
			-43,
			-10.7,
			75,
			50.1
		] },
		"g_p71_cappy_v2": { "size": [
			-44,
			-11.03,
			84.61,
			47.96
		] },
		"g_p71_djcap": { "size": [
			-39.3,
			-19.3,
			75.4,
			65.1
		] },
		"g_p71_goodenuffcap": { "size": [
			-43,
			-10.7,
			75,
			50.1
		] },
		"g_p71_kingcap": { "size": [
			-39.1,
			-9,
			71.2,
			56
		] },
		"g_p71_mrcoolcap": { "size": [
			-39.1,
			-9,
			71.2,
			56
		] },
		"g_p71_omgcap": { "size": [
			-43,
			-10.7,
			75,
			50.1
		] },
		"g_p71_savagecap": { "size": [
			-39.1,
			-9,
			71.2,
			56
		] },
		"g_p71_superbowlcap_2020": { "size": [
			-43.5,
			-12.1,
			72.7,
			57.1
		] },
		"g_p71_supermecap": { "size": [
			-39.1,
			-9,
			71.2,
			56
		] },
		"g_p71_blackoverlordcap_v2": { "size": [
			-39.4,
			-18.08,
			78.79,
			56.51
		] },
		"g_p71_lenincap_v2": { "size": [
			-44.56,
			-11.25,
			82.52,
			53.59
		] },
		"g_p71_goodvibescap": { "size": [
			-43,
			-10.7,
			75,
			50.1
		] },
		"g_p72_air_kiss1_v2": { "size": [
			-25,
			-19,
			50,
			39
		] },
		"g_p72_air_kiss2_v2": { "size": [
			-24,
			-17,
			47,
			36
		] },
		"g_p72_air_kiss3_v2": { "size": [
			-25,
			-17,
			50,
			37
		] },
		"g_p72_air_kiss4_v3": { "size": [
			-25,
			-20,
			49,
			40
		] },
		"g_p72_air_kiss5_v2": { "size": [
			-23,
			-22,
			45,
			44
		] },
		"g_p73_air_kiss1_v2": { "size": [
			-25,
			-19,
			50,
			39
		] },
		"g_p73_air_kiss2_v2": { "size": [
			-24,
			-17,
			47,
			36
		] },
		"g_p73_air_kiss3_v2": { "size": [
			-25,
			-17,
			50,
			37
		] },
		"g_p73_air_kiss4_v3": { "size": [
			-25,
			-20,
			49,
			40
		] },
		"g_p73_air_kiss5_v2": { "size": [
			-23,
			-22,
			45,
			44
		] },
		"g_p74_air_kiss1_v2": { "size": [
			-25,
			-19,
			50,
			39
		] },
		"g_p74_air_kiss2_v2": { "size": [
			-24,
			-17,
			47,
			36
		] },
		"g_p74_air_kiss3_v2": { "size": [
			-25,
			-17,
			50,
			37
		] },
		"g_p74_air_kiss4_v3": { "size": [
			-25,
			-20,
			49,
			40
		] },
		"g_p74_air_kiss5_v2": { "size": [
			-23,
			-22,
			45,
			44
		] },
		"g_p75_air_kiss1_v2": { "size": [
			-25,
			-19,
			50,
			39
		] },
		"g_p75_air_kiss2_v2": { "size": [
			-24,
			-17,
			47,
			36
		] },
		"g_p75_air_kiss3_v2": { "size": [
			-25,
			-17,
			50,
			37
		] },
		"g_p75_air_kiss4_v3": { "size": [
			-25,
			-20,
			49,
			40
		] },
		"g_p75_air_kiss5_v2": { "size": [
			-23,
			-22,
			45,
			44
		] },
		"g_p76_air_kiss1_v2": { "size": [
			-25,
			-19,
			50,
			39
		] },
		"g_p76_air_kiss2_v2": { "size": [
			-24,
			-17,
			47,
			36
		] },
		"g_p76_air_kiss3_v2": { "size": [
			-25,
			-17,
			50,
			37
		] },
		"g_p76_air_kiss4_v3": { "size": [
			-25,
			-20,
			49,
			40
		] },
		"g_p76_air_kiss5_v2": { "size": [
			-23,
			-22,
			45,
			44
		] },
		"g_p77_air_kiss1_v2": { "size": [
			-25,
			-19,
			50,
			39
		] },
		"g_p77_air_kiss2_v2": { "size": [
			-24,
			-17,
			47,
			36
		] },
		"g_p77_air_kiss3_v2": { "size": [
			-25,
			-17,
			50,
			37
		] },
		"g_p77_air_kiss4_v3": { "size": [
			-25,
			-20,
			49,
			40
		] },
		"g_p77_air_kiss5_v2": { "size": [
			-23,
			-22,
			45,
			44
		] },
		"g_p72_nipple1": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p72_nipple2": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p72_nipple3": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p73_nipple1": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p73_nipple2": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p73_nipple3": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p74_nipple1": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p74_nipple2": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p74_nipple3": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p78_nipple1": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p78_nipple2": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p78_nipple3": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p71_nipple1": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p71_nipple2": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p71_nipple3": {
			"size": [
				-31,
				-28.9,
				66,
				58
			],
			"size_v2": [
				-14.5,
				-57.9,
				66,
				58
			]
		},
		"g_p73_bluelagoon": {
			"size": [
				-25,
				-46,
				50,
				92
			],
			"size_v2": [
				-12.5,
				-92,
				50,
				92
			]
		},
		"g_p72_cocoscocktail_v2": {
			"size": [
				-63.51,
				-29.46,
				76.51,
				81.83
			],
			"size_v2": [
				-44.38,
				-70.38,
				76.51,
				81.83
			]
		},
		"g_p74_daiquiri": {
			"size": [
				-29,
				-40.9,
				58,
				82
			],
			"size_v2": [
				-14.5,
				-81.9,
				58,
				82
			]
		},
		"g_p75_sexonthebeach": {
			"size": [
				-25,
				-48,
				50,
				96
			],
			"size_v2": [
				-12.5,
				-96,
				50,
				96
			]
		},
		"g_p76_tequilashot": {
			"size": [
				-16.95,
				-37,
				35,
				63
			],
			"size_v2": [
				-8.2,
				-68.5,
				35,
				63
			]
		},
		"g_p72_milkcoctail": {
			"size": [
				-13.88,
				-41.35,
				34.7,
				84.9
			],
			"size_v2": [
				-5.2,
				-83.8,
				34.7,
				84.9
			]
		},
		"g_p73_smoothie": {
			"size": [
				-25.83,
				-45.6,
				50.9,
				89.8
			],
			"size_v2": [
				-13.1,
				-90.5,
				50.9,
				89.8
			]
		},
		"g_p74_vodka": {
			"size": [
				-25.95,
				-35,
				49,
				65
			],
			"size_v2": [
				-13.7,
				-67.5,
				49,
				65
			]
		},
		"g_p71_juice": {
			"size": [
				-28,
				-40,
				56,
				80
			],
			"size_v2": [
				-14,
				-80,
				56,
				80
			]
		},
		"g_p79_latte": {
			"size": [
				-21,
				-32.9,
				46,
				74
			],
			"size_v2": [
				-9.5,
				-69.9,
				46,
				74
			]
		}
	}
};
/**
* ureyimsen live gift catalog: premium packs (p1_…p79_) with their image meta, plus the
* exact gifts.__store order (premium entries interleaved with ordinary ones).
*/
var SOURCE_PREMIUM_GIFTS = source_premium_gifts_data_default.gifts;
var SOURCE_PREMIUM_IMAGES = source_premium_gifts_data_default.images;
var SOURCE_GIFT_STORE = source_premium_gifts_data_default.store;
var PREMIUM_IMAGE = /^[gs]_p[0-9]+_/;
function isPremiumImage(name) {
	return PREMIUM_IMAGE.test(String(name));
}
/** Wa.url(): premium images live next to the vendor bundles under /room-assets/premium-gifts/<bundle>/. */
function premiumImageUrl(bundleTemplate, name) {
	if (!isPremiumImage(name)) return "";
	const match = /\/bundle\/(dlg\d+|\d+)\//.exec(bundleTemplate);
	return match ? `/room-assets/premium-gifts/${match[1]}/${name}.webp` : "";
}
/** Adds premium definitions and switches the store list to the live source order. */
function injectSourcePremiumGifts(assets) {
	for (const [id, gift] of Object.entries(SOURCE_PREMIUM_GIFTS)) assets.gifts[id] ??= gift;
	for (const [name, meta] of Object.entries(SOURCE_PREMIUM_IMAGES)) assets.images[name] ??= meta;
	const known = new Map(assets.giftStore.map((entry) => [entry.id, entry]));
	const order = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of SOURCE_GIFT_STORE) {
		if (seen.has(entry.id)) continue;
		if (!entry.id.startsWith("__") && !assets.gifts[entry.id]) continue;
		seen.add(entry.id);
		order.push(known.get(entry.id) ?? entry);
	}
	for (const entry of assets.giftStore) if (!seen.has(entry.id)) {
		seen.add(entry.id);
		order.push(entry);
	}
	assets.giftStore = order;
}
var SERVER_JSON_URL = "https://cdn-s.ciliz.com/mobile/server.json";
var ASSETS_TO_VIRTUAL = 375 / 704 * 1.17;
var SPINE_DESIGN_TO_TABLE = .1 * (64 / 102);
var assetsPromise = null;
function loadCilizAssets() {
	if (assetsPromise) {
		assetsPromise.then(() => {
			completeLoadingStage("server");
			completeLoadingStage("assets");
		}, () => void 0);
		return assetsPromise;
	}
	assetsPromise = (async () => {
		const server = await (await fetch(SERVER_JSON_URL)).json();
		completeLoadingStage("server");
		const json = await (await fetch(server.assets.url)).json();
		completeLoadingStage("assets");
		const result = {
			bottles: Object.fromEntries(Object.entries(json.bottles).filter(([key]) => !key.startsWith("__"))),
			bottleStore: json.bottles.__store.flat(),
			bottle3d: json.bottle3d,
			gestures: Object.fromEntries(Object.entries(json.gestures ?? {}).filter(([key]) => !key.startsWith("__"))),
			gestureStore: (json.gestures?.__store_v3 ?? []).flat(),
			gifts: json.gifts,
			giftStore: (json.gifts.__store_v7 ?? json.gifts.__store).flat(),
			spines: json.spines,
			sfxUrl: server.assets.sfx_url_v2,
			frames: json.frames,
			stones: json.stones,
			decor: json.decor.__store,
			images: json.images,
			translation: azerbaijaniGameDictionary(json.translation.az ?? {}),
			achievements: json.achievement,
			boosters: json.boosters,
			leagues: json.leagues,
			bundles: server.assets.bundles_v2.table,
			dialogBundles: server.assets.bundles_v2.dlg
		};
		injectCustomFrames(result);
		injectSourceNormalGifts(result);
		injectSourcePremiumGifts(result);
		return result;
	})();
	assetsPromise.catch(() => {
		failGameLoading();
		assetsPromise = null;
	});
	return assetsPromise;
}
function translate(assets, key, ...args) {
	let text = assets.translation[key] ?? key;
	args.forEach((arg, index) => {
		text = text.replace(`%${index}`, arg);
	});
	return text;
}
function pickBundle(assets, targetSize) {
	const bundle = assets.bundles.find((bundle) => bundle.size >= targetSize) ?? assets.bundles.at(-1);
	if (!bundle) throw new Error("No table image bundles available");
	return bundle;
}
function dpr() {
	return typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
}
function bundleUrl(assets, name, ext, targetSize) {
	const custom = customFrameUrl(name);
	if (custom) return custom;
	const bundle = pickBundle(assets, targetSize ?? 375 * dpr());
	const premium = ext === "json" ? "" : premiumImageUrl(bundle.url, name);
	if (premium) return premium;
	return bundle.url.replace("${name}", `${name}.${ext}`);
}
var webpSupport = null;
/** Ciliz ImageMetaRegistry.bundleImage: WebP destekleniyorsa .webp, yoksa .png yüklenir. */
function hasWebP() {
	if (webpSupport === null) try {
		webpSupport = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0;
	} catch {
		webpSupport = false;
	}
	return webpSupport;
}
function virtualFrame(assets, name) {
	const meta = assets.images[name];
	if (!meta) return {
		width: 0,
		height: 0
	};
	const size = meta.size_v2 || meta.size;
	return {
		width: (size[2] ?? 0) * ASSETS_TO_VIRTUAL,
		height: (size[3] ?? 0) * ASSETS_TO_VIRTUAL
	};
}
/** ImageLoader.dlgData(): source and fitted size for an image shown in a dialog. */
function dialogImage(assets, name, w, h) {
	const bundle = assets.dialogBundles.find((entry) => entry.dpr >= dpr()) ?? assets.dialogBundles.at(-1);
	if (!bundle) throw new Error("No dialog image bundles available");
	const frame = virtualFrame(assets, name);
	const width = w ?? frame.width;
	const height = h ?? frame.height;
	const scale = frame.width && frame.height ? Math.min(width / frame.width, height / frame.height) : 1;
	return {
		src: customFrameUrl(name) || premiumImageUrl(bundle.url, name) || bundle.url.replace("${name}", `${name}.png`),
		width: Math.round(scale * frame.width),
		height: Math.round(scale * frame.height)
	};
}
function tableFrameSize(assets, name) {
	return virtualFrame(assets, name);
}
var TIERS = [
	[
		"Bürünc",
		"#f0b27a",
		"#8a4a1f",
		"#ffe0c2",
		"star"
	],
	[
		"Gümüş",
		"#eef3fa",
		"#7f8ea3",
		"#ffffff",
		"star"
	],
	[
		"Qızıl",
		"#ffe27a",
		"#c98a09",
		"#fff6c4",
		"gem"
	],
	[
		"Zümrüd",
		"#6ff5bb",
		"#0b7a4a",
		"#d2ffec",
		"gem"
	],
	[
		"Sapfir",
		"#7cc0ff",
		"#1c4fd6",
		"#dcefff",
		"crown"
	],
	[
		"Ametist",
		"#dba8ff",
		"#6d1fc4",
		"#f3e2ff",
		"crown"
	],
	[
		"Yaqut",
		"#ff8595",
		"#b0102a",
		"#ffdbe0",
		"wings"
	],
	[
		"Qızılgül",
		"#ffaad8",
		"#c21f7a",
		"#ffe4f3",
		"wings"
	],
	[
		"Brilyant",
		"#c4f7ff",
		"#2a8fd6",
		"#ffffff",
		"flame"
	],
	[
		"Əfsanə",
		"#ffd86b",
		"#ff2f6d",
		"#fff3c4",
		"flame"
	],
	[
		"Kosmos",
		"#9fb4ff",
		"#2a1b6e",
		"#e3e8ff",
		"star"
	],
	[
		"Aurora",
		"#8dffd8",
		"#3a2fb8",
		"#e6fff7",
		"gem"
	],
	[
		"Lava",
		"#ffb36b",
		"#c2210c",
		"#ffe5cc",
		"flame"
	],
	[
		"Okean",
		"#7ff0ff",
		"#0a5a8c",
		"#dffbff",
		"gem"
	],
	[
		"Şimşək",
		"#fff36b",
		"#6b4dff",
		"#fffbe0",
		"crown"
	],
	[
		"Kristal",
		"#e8f6ff",
		"#5f86c9",
		"#ffffff",
		"gem"
	],
	[
		"Feniks",
		"#ffcf5c",
		"#e0341d",
		"#fff0c8",
		"wings"
	],
	[
		"Ulduz tozu",
		"#ffe1fb",
		"#8a2be2",
		"#fff4fe",
		"star"
	],
	[
		"İmperator",
		"#ffe79a",
		"#7a1fa2",
		"#fff7d6",
		"crown"
	],
	[
		"Mütləq",
		"#fff3c4",
		"#ff2f6d",
		"#ffffff",
		"crown"
	]
];
var ENTRY_STYLES = [
	["spark", "rise"],
	["star4", "orbit"],
	["coin", "burst"],
	["leaf", "spiral"],
	["drop", "ripple"],
	["star5", "runes"],
	["flame", "rise"],
	["petal", "fall"],
	["shard", "burst"],
	["feather", "wings"],
	["star4", "spiral"],
	["leaf", "orbit"],
	["flame", "burst"],
	["drop", "spiral"],
	["shard", "runes"],
	["shard", "orbit"],
	["feather", "fall"],
	["star5", "orbit"],
	["coin", "wings"],
	["star5", "wings"]
];
var EXTRA_STYLES = [
	["star4", "orbit"],
	["star5", "runes"],
	["petal", "fall"],
	["shard", "burst"],
	["coin", "fall"]
];
function tier(level) {
	const z = Math.max(1, level | 0);
	const i = z <= 50 ? Math.min(9, Math.floor(z / 5)) : Math.min(TIERS.length - 1, 10 + Math.floor((z - 50 - 1) / 5));
	const t = TIERS[i];
	if (!t) throw new Error("Entry tier unavailable");
	return {
		i,
		name: t[0],
		c1: t[1],
		c2: t[2],
		rim: t[3],
		emblem: t[4]
	};
}
/** Ids present in `next` but not in `prev` (players who just sat down). */
function joinedIds(prev, next) {
	const before = new Set(prev.filter(Boolean));
	return [...new Set(next.filter((id) => Boolean(id) && !before.has(id)))];
}
var badges = {};
var EMBLEMS = {
	star: "<path d=\"M12 3.2l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.5l6-.7z\"/>",
	gem: "<path d=\"M6.5 5h11l3.5 4.6L12 20.5 3 9.6z\"/><path d=\"M3 9.6h18M9 5l-1.5 4.6L12 20.5 16.5 9.6 15 5\" fill=\"none\" stroke=\"rgba(0,0,0,.28)\" stroke-width=\"1\"/>",
	crown: "<path d=\"M3.5 18.5L2.8 8l5 4.2L12 5l4.2 7.2 5-4.2-.7 10.5z\"/><circle cx=\"12\" cy=\"4.3\" r=\"1.6\"/>",
	wings: "<path d=\"M12 10.5C9.5 6 5 5.2 1.5 6.8c2.6.6 4 2 4.6 3.6-1.8-.2-3.2.5-4 1.7 2.2-.3 4 .4 5 1.7-1.3.5-2 1.6-2 2.8 2.6-1.6 5-2.4 6.9-2.7zM12 10.5c2.5-4.5 7-5.3 10.5-3.7-2.6.6-4 2-4.6 3.6 1.8-.2 3.2.5 4 1.7-2.2-.3-4 .4-5 1.7 1.3.5 2 1.6 2 2.8-2.6-1.6-5-2.4-6.9-2.7z\"/><circle cx=\"12\" cy=\"12.6\" r=\"2.6\"/>",
	flame: "<path d=\"M12 2.5c1.6 4.2 6.3 5.8 5.9 11.4-.3 3.9-3 6.6-5.9 6.6s-5.7-2.3-5.9-6c-.2-3.3 2-5 2.6-7.8 1.5 1.3 1.9 3 1.8 4.6 1.6-2.2 2.1-5.3 1.5-8.8z\"/><path d=\"M12 12.5c1 1.8 2.6 2.5 2.4 4.6-.1 1.5-1.2 2.6-2.4 2.6s-2.3-1-2.4-2.4c-.1-1.5.9-2.3 1.2-3.5.5.6.7 1.2.7 1.8.6-.9.8-1.8.5-3.1z\" fill=\"rgba(255,255,255,.75)\"/>"
};
/** Original source SVG badge artwork, independent of browser globals. */
function entryBadge(Z) {
	Z = Math.max(1, Math.min(100, 0 | Z));
	const cached = badges[Z];
	if (cached) return cached;
	const J = tier(Z), tt = Z >= 100 ? 68 : Z >= 10 ? 60 : 52, Mt = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + tt + "\" height=\"24\" viewBox=\"0 0 " + tt + " 24\"><defs>" + (9 === J.i || J.i === TIERS.length - 1 ? "<linearGradient id=\"f\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffd86b\"/><stop offset=\".5\" stop-color=\"#ff2f6d\"/><stop offset=\"1\" stop-color=\"#7b2cff\"/></linearGradient>" : "<linearGradient id=\"f\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"" + J.c1 + "\"/><stop offset=\"1\" stop-color=\"" + J.c2 + "\"/></linearGradient>") + "<linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".55\"/><stop offset=\".55\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient></defs><rect x=\"1\" y=\"1\" width=\"" + (tt - 2) + "\" height=\"22\" rx=\"11\" fill=\"url(#f)\" stroke=\"" + J.rim + "\" stroke-width=\"1.5\"/><rect x=\"3\" y=\"2.5\" width=\"" + (tt - 6) + "\" height=\"9\" rx=\"4.5\" fill=\"url(#g)\"/><circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"rgba(0,0,0,.28)\"/><g transform=\"translate(3.6 3.6) scale(.7)\" fill=\"#fff\" stroke=\"rgba(0,0,0,.25)\" stroke-width=\".8\">" + EMBLEMS[J.emblem] + "</g><text x=\"" + (tt / 2 + 11) + "\" y=\"16.6\" text-anchor=\"middle\" font-family=\"Arial Black,Arial,sans-serif\" font-weight=\"900\" font-size=\"13\" fill=\"#fff\" stroke=\"rgba(0,0,0,.45)\" stroke-width=\"2.4\" paint-order=\"stroke\">" + Z + "</text></svg>";
	return badges[Z] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Mt);
}
function CreatorLabel({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `player-creator ${className}`,
		"aria-label": "Creator",
		children: "Creator"
	});
}
function PlayerName({ name, appearance = DEFAULT_APPEARANCE, showCreator = true, nameClass = "" }) {
	const band = appearance.level > 0 ? tier(appearance.level).i : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `player-name-card${band !== null ? ` player-name-card--t${band}` : ""}`,
		children: [
			appearance.level > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "player-level-badge",
				src: entryBadge(appearance.level),
				alt: `Səviyyə ${appearance.level}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `${nameClass} player-name-text player-name-text--${appearance.nameStyle}`,
				children: name
			}),
			showCreator && appearance.creator && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatorLabel, {})
		]
	});
}
//#endregion
export { translate as C, tier as S, hasWebP as _, LEVEL_FRAMES as a, loadCilizAssets as b, bundleUrl as c, customFrameLayout as d, customFrameUrl as f, getCustomFrame as g, failGameLoading as h, EXTRA_STYLES as i, completeLoadingStage as l, entryBadge as m, CreatorLabel as n, PlayerName as o, dialogImage as p, ENTRY_STYLES as r, SPINE_DESIGN_TO_TABLE as s, ASSETS_TO_VIRTUAL as t, customFrameImageName as u, isLevelFrameOpen as v, useGameLoading as w, tableFrameSize as x, joinedIds as y };
