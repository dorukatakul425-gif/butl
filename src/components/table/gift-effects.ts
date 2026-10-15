// Browser-only source-derived VfxPresenter configs; SVG artwork is the original bundled artwork.
import { Emitter, type EmitterConfigV3 } from "@pixi/particle-emitter";
import { Container, Texture, type IRenderer } from "pixi.js";
import { giftEffectFallbacks } from "@/lib/gift-effect-fallbacks";
import v_balloon1_1 from "@/assets/vfx/v_balloon1_1.svg";
import v_balloon1_2 from "@/assets/vfx/v_balloon1_2.svg";
import v_balloon1_3 from "@/assets/vfx/v_balloon1_3.svg";
import v_balloon1_4 from "@/assets/vfx/v_balloon1_4.svg";
import v_balloon1_5 from "@/assets/vfx/v_balloon1_5.svg";
import v_balloon2_1 from "@/assets/vfx/v_balloon2_1.svg";
import v_balloon2_2 from "@/assets/vfx/v_balloon2_2.svg";
import v_balloon2_3 from "@/assets/vfx/v_balloon2_3.svg";
import v_balloon2_4 from "@/assets/vfx/v_balloon2_4.svg";
import v_confetti1 from "@/assets/vfx/v_confetti1.svg";
import v_confetti2 from "@/assets/vfx/v_confetti2.svg";
import v_confetti3 from "@/assets/vfx/v_confetti3.svg";
import v_confetti4 from "@/assets/vfx/v_confetti4.svg";
import v_fire1 from "@/assets/vfx/v_fire1.svg";
import v_fire2 from "@/assets/vfx/v_fire2.svg";
import v_fire3 from "@/assets/vfx/v_fire3.svg";
import v_fire4 from "@/assets/vfx/v_fire4.svg";
import v_flower1 from "@/assets/vfx/v_flower1.svg";
import v_flower2 from "@/assets/vfx/v_flower2.svg";
import v_flower3 from "@/assets/vfx/v_flower3.svg";
import v_flower4 from "@/assets/vfx/v_flower4.svg";
import v_ghost1 from "@/assets/vfx/v_ghost1.svg";
import v_ghost2 from "@/assets/vfx/v_ghost2.svg";
import v_ghost3 from "@/assets/vfx/v_ghost3.svg";
import v_ghost4 from "@/assets/vfx/v_ghost4.svg";
import v_heart1 from "@/assets/vfx/v_heart1.svg";
import v_heart2 from "@/assets/vfx/v_heart2.svg";
import v_heart3 from "@/assets/vfx/v_heart3.svg";
import v_heart4 from "@/assets/vfx/v_heart4.svg";
import v_heart5 from "@/assets/vfx/v_heart5.svg";
import v_heart6 from "@/assets/vfx/v_heart6.svg";
import v_heart7 from "@/assets/vfx/v_heart7.svg";
import v_heart8 from "@/assets/vfx/v_heart8.svg";
import v_heart9 from "@/assets/vfx/v_heart9.svg";
import v_heart2_1 from "@/assets/vfx/v_heart2_1.svg";
import v_heart2_2 from "@/assets/vfx/v_heart2_2.svg";
import v_heart2_3 from "@/assets/vfx/v_heart2_3.svg";
import v_leaf1 from "@/assets/vfx/v_leaf1.svg";
import v_leaf2 from "@/assets/vfx/v_leaf2.svg";
import v_leaf3 from "@/assets/vfx/v_leaf3.svg";
import v_leaf4 from "@/assets/vfx/v_leaf4.svg";
import v_leaf5 from "@/assets/vfx/v_leaf5.svg";
import v_magic1 from "@/assets/vfx/v_magic1.svg";
import v_magic2 from "@/assets/vfx/v_magic2.svg";
import v_magic3 from "@/assets/vfx/v_magic3.svg";
import v_magic4 from "@/assets/vfx/v_magic4.svg";
import v_pacifier1 from "@/assets/vfx/v_pacifier1.svg";
import v_pacifier2 from "@/assets/vfx/v_pacifier2.svg";
import v_pacifier3 from "@/assets/vfx/v_pacifier3.svg";
import v_photo1 from "@/assets/vfx/v_photo1.svg";
import v_photo2 from "@/assets/vfx/v_photo2.svg";
import v_photo3 from "@/assets/vfx/v_photo3.svg";
import v_roll1 from "@/assets/vfx/v_roll1.svg";
import v_roll2 from "@/assets/vfx/v_roll2.svg";
import v_roll3 from "@/assets/vfx/v_roll3.svg";
import v_snow1 from "@/assets/vfx/v_snow1.svg";
import v_snow2 from "@/assets/vfx/v_snow2.svg";
import v_snow3 from "@/assets/vfx/v_snow3.svg";
import v_sock1 from "@/assets/vfx/v_sock1.svg";
import v_sock2 from "@/assets/vfx/v_sock2.svg";
import v_sock3 from "@/assets/vfx/v_sock3.svg";
export const TABLE_EFFECT_NAMES = ["balloon1", "balloon2", "confetti", "flower", "ghost", "heart", "heart2", "leaf", "pacifier", "photo", "roll", "snow", "sock"] as const;
const tableVfxEmitterLifetimeSec: Record<string, number> = Object.fromEntries(TABLE_EFFECT_NAMES.map(name => [name, 24]));
const urls: Record<string, string[]> = {
balloon1: [v_balloon1_1, v_balloon1_2, v_balloon1_3, v_balloon1_4, v_balloon1_5],
balloon2: [v_balloon2_1, v_balloon2_2, v_balloon2_3, v_balloon2_4],
confetti: [v_confetti1, v_confetti2, v_confetti3, v_confetti4],
fire: [v_fire1, v_fire2, v_fire3, v_fire4],
flower: [v_flower1, v_flower2, v_flower3, v_flower4],
ghost: [v_ghost1, v_ghost2, v_ghost3, v_ghost4],
heart: [v_heart1, v_heart2, v_heart3, v_heart4, v_heart5, v_heart6, v_heart7, v_heart8, v_heart9],
heart2: [v_heart2_1, v_heart2_2, v_heart2_3],
leaf: [v_leaf1, v_leaf2, v_leaf3, v_leaf4, v_leaf5],
magic: [v_magic1, v_magic2, v_magic3, v_magic4],
pacifier: [v_pacifier1, v_pacifier2, v_pacifier3],
photo: [v_photo1, v_photo2, v_photo3],
roll: [v_roll1, v_roll2, v_roll3],
snow: [v_snow1, v_snow2, v_snow3],
sock: [v_sock1, v_sock2, v_sock3],
};

export class GiftEffects {
  private vfx: Record<string, Texture[]> = {};
  private ready = new Map<string, Promise<void>>();
  private emitters = new Set<Emitter>();
  private disposed = false;
  private layout = { pixiScale: 1, tableScale: 1, game: { width: 375, height: 375 }, header: { height: 0 }, isHeaderUp: false };

  constructor(private giftLayer: Container, private tableLayer: Container) {}
  setLayout(width: number, height: number) { this.layout.game = { width, height }; }
  preload(name: string) {
    let ready = this.ready.get(name);
    if (!ready) {
      ready = Promise.all((urls[name] ?? []).map(url => new Promise<Texture>((resolve, reject) => {
        const image = new Image(); image.crossOrigin = "anonymous";
        image.onload = () => resolve(Texture.from(image));
        let attempt = 0;
        image.onerror = () => {
          const fallback = giftEffectFallbacks[url.split("/").at(-1)?.split("?")[0] ?? ""];
          if (attempt++ === 0) image.src = `${url}${url.includes("?") ? "&" : "?"}r=${Date.now()}`;
          else if (fallback && image.src !== fallback) image.src = fallback;
          else reject(new Error(`Effect image unavailable: ${url}`));
        };
        image.src = url;
      }))).then(textures => {
        if (this.disposed) { textures.forEach(texture => texture.destroy(true)); return; }
        this.vfx[name] = textures;
      });
      this.ready.set(name, ready);
      ready.catch(() => this.ready.delete(name));
    }
    return ready;
  }
  create(name: string, table = false) {
    if (!this.vfx[name]?.length || this.disposed) return;
    const factory = (this as unknown as Record<string, (() => EmitterConfigV3) | undefined>)[`get${name[0]?.toUpperCase()}${name.slice(1)}EmitterConfig`];
    if (!factory) return;
    const emitter = new Emitter(table ? this.tableLayer : this.giftLayer, factory.call(this));
    emitter.emit = true;
    this.emitters.add(emitter);
    return emitter;
  }
  prepare(renderer: IRenderer, name: string) {
    return renderer.plugins["prepare"].upload(this.vfx[name] ?? []);
  }
  update(dt: number) {
    for (const emitter of this.emitters) {
      emitter.update(dt);
      if (!emitter.emit && emitter.particleCount === 0) this.remove(emitter);
    }
  }
  remove(emitter: Emitter) { if (this.emitters.delete(emitter)) emitter.destroy(); }
  destroy() {
    this.disposed = true;
    for (const emitter of this.emitters) emitter.destroy();
    this.emitters.clear();
    for (const textures of Object.values(this.vfx)) textures.forEach(texture => texture.destroy(true));
    this.vfx = {};
  }
getFireEmitterConfig() {
    return {
      lifetime: {
        min: 1,
        max: 1.25
      },
      frequency: 0.04,
      emitterLifetime: 5,
      maxParticles: 150,
      pos: {
        x: 0,
        y: 0
      },
      behaviors: [{
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale
            }, {
              time: 1,
              value: 0
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'torus',
          data: {
            x: 0,
            y: 0,
            radius: 10,
            innerRadius: 0,
            affectRotation: false
          }
        }
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['fire']
        }
      }]
    };
  }
getMagicEmitterConfig() {
    return {
      lifetime: {
        min: 2.3,
        max: 3
      },
      frequency: 0.04,
      emitterLifetime: 5,
      maxParticles: 150,
      pos: {
        x: 0,
        y: 0
      },
      behaviors: [{
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale
            }, {
              time: 1,
              value: 0
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          minSpeed: 120,
          maxSpeed: 160,
          minStart: 0,
          maxStart: 0
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'torus',
          data: {
            x: 0,
            y: 0,
            radius: 10,
            innerRadius: 0,
            affectRotation: false
          }
        }
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['magic']
        }
      }]
    };
  }
getBalloon1EmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.580,
      emitterLifetime: tableVfxEmitterLifetimeSec['balloon1'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: 30
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 50,
          max: 50
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.6
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.6
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 0,
          maxSpeed: 0,
          minStart: 265,
          maxStart: 275
        }
      }, {
        type: 'noRotation',
        config: {}
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['balloon1']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getBalloon2EmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.580,
      emitterLifetime: tableVfxEmitterLifetimeSec['balloon2'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: 30
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 50,
          max: 50
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.7
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.7
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 0,
          maxSpeed: 0,
          minStart: 265,
          maxStart: 275
        }
      }, {
        type: 'noRotation',
        config: {}
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['balloon2']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getConfettiEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.15,
      emitterLifetime: tableVfxEmitterLifetimeSec['confetti'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: -20
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 60,
          max: 60
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.45
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.45
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 40,
          maxSpeed: 100,
          minStart: 60,
          maxStart: 90
        }
      }, {
        type: 'noRotation',
        config: {}
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['confetti']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: -this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getFlowerEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.25,
      emitterLifetime: tableVfxEmitterLifetimeSec['flower'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: -20
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 40,
          max: 40
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.3
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.3
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 30,
          maxSpeed: 40,
          minStart: 85,
          maxStart: 95
        }
      }, {
        type: 'noRotation',
        config: {}
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['flower']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: -this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getGhostEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.6,
      emitterLifetime: tableVfxEmitterLifetimeSec['ghost'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: 30
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 50,
          max: 50
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.5
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.5
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 0,
          maxSpeed: 0,
          minStart: 260,
          maxStart: 280
        }
      }, {
        type: 'noRotation',
        config: {}
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['ghost']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getHeartEmitterConfig() {
    const emitterLifetime = tableVfxEmitterLifetimeSec['heart'] ?? 24;
    const animTimeSec = 4;
    const animationRepeats = emitterLifetime / animTimeSec;
    const getScaleValue = (s: number) => s / this.layout.pixiScale * 0.85;
    const getScaleTimeValue = (t: number) => t / (animTimeSec * 1000) / animationRepeats;
    const scaleKeyframes = [{
      time: 0,
      value: getScaleValue(0.95)
    }];
    const scaleAnimationPattern = [{
      time: getScaleTimeValue(165),
      value: getScaleValue(1.05)
    }, {
      time: getScaleTimeValue(165),
      value: getScaleValue(0.95)
    }, {
      time: getScaleTimeValue(165),
      value: getScaleValue(1.05)
    }, {
      time: getScaleTimeValue(165),
      value: getScaleValue(1.05)
    }, {
      time: getScaleTimeValue(165),
      value: getScaleValue(0.95)
    }, {
      time: getScaleTimeValue(1010),
      value: getScaleValue(1.05)
    }, {
      time: getScaleTimeValue(1000),
      value: getScaleValue(0.95)
    }, {
      time: getScaleTimeValue(1000),
      value: getScaleValue(0.95)
    }];
    let time = 0;
    for (let i = 0; i < animationRepeats; i++) {
      for (const step of scaleAnimationPattern) {
        time += step.time;
        scaleKeyframes.push({
          time,
          value: step.value
        });
      }
    }
    if ((scaleKeyframes.at(-1)?.time ?? 0) < 1) scaleKeyframes.push({
      time: 1,
      value: getScaleValue(0.95)
    });
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.192,
      emitterLifetime,
      maxParticles: 10000,
      pos: {
        x: 0,
        y: 0
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 25.5,
          max: 25.5
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: scaleKeyframes,
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 0,
          maxSpeed: 0,
          minStart: 260,
          maxStart: 280
        }
      }, {
        type: 'noRotation',
        config: {}
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['heart']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getHeart2EmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.575,
      emitterLifetime: tableVfxEmitterLifetimeSec['heart2'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: 20
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 50,
          max: 50
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.35
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.35
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 0,
          maxSpeed: 0,
          minStart: 265,
          maxStart: 275
        }
      }, {
        type: 'noRotation',
        config: {}
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['heart2']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getLeafEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.25,
      emitterLifetime: tableVfxEmitterLifetimeSec['leaf'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: -20
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 50,
          max: 50
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.35
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.35
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 0,
          maxSpeed: 20,
          minStart: 80,
          maxStart: 100
        }
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['leaf']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: -this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getPacifierEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.485,
      emitterLifetime: tableVfxEmitterLifetimeSec['pacifier'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: -20
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 75,
          max: 75
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.6
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.6
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 10,
          maxSpeed: 10,
          minStart: 90,
          maxStart: 90
        }
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['pacifier']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: -this.layout.game.height / this.layout.tableScale / 2 - (this.layout.isHeaderUp ? this.layout.header.height / this.layout.tableScale / 2 : 0),
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getPhotoEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.3,
      emitterLifetime: tableVfxEmitterLifetimeSec['photo'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: -32
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 80,
          max: 80
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.45
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.45
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 14,
          maxSpeed: 14,
          minStart: 90,
          maxStart: 90
        }
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['photo']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: -this.layout.game.height / this.layout.tableScale / 2,
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getRollEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.345,
      emitterLifetime: tableVfxEmitterLifetimeSec['roll'],
      maxParticles: 10000,
      pos: {
        x: -20,
        y: 0
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 85,
          max: 85
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.4
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.4
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 80,
          maxSpeed: 80,
          minStart: 0,
          maxStart: 0
        }
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['roll']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: -this.layout.game.height / this.layout.tableScale / 2,
            w: 0,
            h: this.layout.game.height / this.layout.tableScale
          }
        }
      }]
    };
  }
getSnowEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.064,
      emitterLifetime: tableVfxEmitterLifetimeSec['snow'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: 0
      },
      behaviors: [{
        type: 'alpha',
        config: {
          alpha: {
            list: [{
              time: 0,
              value: 1
            }, {
              time: 0.4,
              value: 1
            }, {
              time: 1,
              value: 0
            }]
          }
        }
      }, {
        type: 'moveSpeedStatic',
        config: {
          min: 25.5,
          max: 25.5
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.8
            }, {
              time: 1,
              value: 0.6 / this.layout.pixiScale * 0.8
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 0,
          maxSpeed: 50,
          minStart: 80,
          maxStart: 100
        }
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['snow']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: -this.layout.game.height / this.layout.tableScale / 2 - (this.layout.isHeaderUp ? this.layout.header.height / this.layout.tableScale / 2 : 0),
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
getSockEmitterConfig() {
    return {
      lifetime: {
        min: 16,
        max: 20
      },
      frequency: 0.3,
      emitterLifetime: tableVfxEmitterLifetimeSec['sock'],
      maxParticles: 10000,
      pos: {
        x: 0,
        y: 0
      },
      behaviors: [{
        type: 'moveSpeedStatic',
        config: {
          min: 80,
          max: 80
        }
      }, {
        type: 'scale',
        config: {
          scale: {
            list: [{
              time: 0,
              value: 1 / this.layout.pixiScale * 0.45
            }, {
              time: 1,
              value: 0.9 / this.layout.pixiScale * 0.45
            }],
            isStepped: false
          },
          minMult: 1
        }
      }, {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 5,
          maxSpeed: 20,
          minStart: 90,
          maxStart: 90
        }
      }, {
        type: 'noRotation',
        config: {}
      }, {
        type: 'textureRandom',
        config: {
          textures: this.vfx['sock']
        }
      }, {
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: {
            x: -this.layout.game.width / this.layout.tableScale / 2,
            y: -this.layout.game.height / this.layout.tableScale / 2 - (this.layout.isHeaderUp ? this.layout.header.height / this.layout.tableScale / 2 : 0),
            w: this.layout.game.width / this.layout.tableScale,
            h: 0
          }
        }
      }]
    };
  }
}
