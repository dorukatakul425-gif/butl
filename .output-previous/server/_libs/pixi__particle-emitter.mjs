import { C as Sprite, F as Texture, U as Point, gt as BLEND_MODES, j as Ticker } from "./@pixi-spine/base+[...].mjs";
//#region node_modules/@pixi/particle-emitter/lib/particle-emitter.es.js
/*!
* @pixi/particle-emitter - v5.0.8
* Compiled Mon, 28 Nov 2022 04:01:38 UTC
*
* @pixi/particle-emitter is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* A single node in a PropertyList.
*/
var PropertyNode = class PropertyNode {
	/**
	* @param value The value for this node
	* @param time The time for this node, between 0-1
	* @param [ease] Custom ease for this list. Only relevant for the first node.
	*/
	constructor(value, time, ease) {
		this.value = value;
		this.time = time;
		this.next = null;
		this.isStepped = false;
		if (ease) this.ease = typeof ease === "function" ? ease : generateEase(ease);
		else this.ease = null;
	}
	/**
	* Creates a list of property values from a data object {list, isStepped} with a list of objects in
	* the form {value, time}. Alternatively, the data object can be in the deprecated form of
	* {start, end}.
	* @param data The data for the list.
	* @param data.list The array of value and time objects.
	* @param data.isStepped If the list is stepped rather than interpolated.
	* @param data.ease Custom ease for this list.
	* @return The first node in the list
	*/
	static createList(data) {
		if ("list" in data) {
			const array = data.list;
			let node;
			const { value, time } = array[0];
			const first = node = new PropertyNode(typeof value === "string" ? hexToRGB(value) : value, time, data.ease);
			if (array.length > 2 || array.length === 2 && array[1].value !== value) for (let i = 1; i < array.length; ++i) {
				const { value, time } = array[i];
				node.next = new PropertyNode(typeof value === "string" ? hexToRGB(value) : value, time);
				node = node.next;
			}
			first.isStepped = !!data.isStepped;
			return first;
		}
		const start = new PropertyNode(typeof data.start === "string" ? hexToRGB(data.start) : data.start, 0);
		if (data.end !== data.start) start.next = new PropertyNode(typeof data.end === "string" ? hexToRGB(data.end) : data.end, 1);
		return start;
	}
};
/**
* The method used by behaviors to fetch textures. Defaults to Texture.from.
*/
var GetTextureFromString = Texture.from;
var DEG_TO_RADS = Math.PI / 180;
/**
* Rotates a point by a given angle.
* @param angle The angle to rotate by in radians
* @param p The point to rotate around 0,0.
*/
function rotatePoint(angle, p) {
	if (!angle) return;
	const s = Math.sin(angle);
	const c = Math.cos(angle);
	const xnew = p.x * c - p.y * s;
	const ynew = p.x * s + p.y * c;
	p.x = xnew;
	p.y = ynew;
}
/**
* Combines separate color components (0-255) into a single uint color.
* @param r The red value of the color
* @param g The green value of the color
* @param b The blue value of the color
* @return The color in the form of 0xRRGGBB
*/
function combineRGBComponents(r, g, b) {
	return r << 16 | g << 8 | b;
}
/**
* Returns the length (or magnitude) of this point.
* @param point The point to measure length
* @return The length of this point.
*/
function length(point) {
	return Math.sqrt(point.x * point.x + point.y * point.y);
}
/**
* Reduces the point to a length of 1.
* @param point The point to normalize
*/
function normalize(point) {
	const oneOverLen = 1 / length(point);
	point.x *= oneOverLen;
	point.y *= oneOverLen;
}
/**
* Multiplies the x and y values of this point by a value.
* @param point The point to scaleBy
* @param value The value to scale by.
*/
function scaleBy(point, value) {
	point.x *= value;
	point.y *= value;
}
/**
* Converts a hex string from "#AARRGGBB", "#RRGGBB", "0xAARRGGBB", "0xRRGGBB",
* "AARRGGBB", or "RRGGBB" to an object of ints of 0-255, as
* {r, g, b, (a)}.
* @param color The input color string.
* @param output An object to put the output in. If omitted, a new object is created.
* @return The object with r, g, and b properties, possibly with an a property.
*/
function hexToRGB(color, output) {
	if (!output) output = {};
	if (color.charAt(0) === "#") color = color.substr(1);
	else if (color.indexOf("0x") === 0) color = color.substr(2);
	let alpha;
	if (color.length === 8) {
		alpha = color.substr(0, 2);
		color = color.substr(2);
	}
	output.r = parseInt(color.substr(0, 2), 16);
	output.g = parseInt(color.substr(2, 2), 16);
	output.b = parseInt(color.substr(4, 2), 16);
	if (alpha) output.a = parseInt(alpha, 16);
	return output;
}
/**
* Generates a custom ease function, based on the GreenSock custom ease, as demonstrated
* by the related tool at http://www.greensock.com/customease/.
* @param segments An array of segments, as created by
* http://www.greensock.com/customease/.
* @return A function that calculates the percentage of change at
*                    a given point in time (0-1 inclusive).
*/
function generateEase(segments) {
	const qty = segments.length;
	const oneOverQty = 1 / qty;
	return function(time) {
		const i = qty * time | 0;
		const t = (time - i * oneOverQty) * qty;
		const s = segments[i] || segments[qty - 1];
		return s.s + t * (2 * (1 - t) * (s.cp - s.s) + t * (s.e - s.s));
	};
}
/**
* Gets a blend mode, ensuring that it is valid.
* @param name The name of the blend mode to get.
* @return The blend mode as specified in the PIXI.BLEND_MODES enumeration.
*/
function getBlendMode(name) {
	if (!name) return BLEND_MODES.NORMAL;
	name = name.toUpperCase().replace(/ /g, "_");
	return BLEND_MODES[name] || BLEND_MODES.NORMAL;
}
/**
* An individual particle image. You shouldn't have to deal with these.
*/
var Particle = class extends Sprite {
	/**
	* @param emitter The emitter that controls this particle.
	*/
	constructor(emitter) {
		super();
		this.prevChild = this.nextChild = null;
		this.emitter = emitter;
		this.config = {};
		this.anchor.x = this.anchor.y = .5;
		this.maxLife = 0;
		this.age = 0;
		this.agePercent = 0;
		this.oneOverLife = 0;
		this.next = null;
		this.prev = null;
		this.init = this.init;
		this.kill = this.kill;
	}
	/**
	* Initializes the particle for use, based on the properties that have to
	* have been set already on the particle.
	*/
	init(maxLife) {
		this.maxLife = maxLife;
		this.age = this.agePercent = 0;
		this.rotation = 0;
		this.position.x = this.position.y = 0;
		this.scale.x = this.scale.y = 1;
		this.tint = 16777215;
		this.alpha = 1;
		this.oneOverLife = 1 / this.maxLife;
		this.visible = true;
	}
	/**
	* Kills the particle, removing it from the display list
	* and telling the emitter to recycle it.
	*/
	kill() {
		this.emitter.recycle(this);
	}
	/**
	* Destroys the particle, removing references and preventing future use.
	*/
	destroy() {
		if (this.parent) this.parent.removeChild(this);
		this.emitter = this.next = this.prev = null;
		super.destroy();
	}
};
/**
* Standard behavior order values, specifying when/how they are used. Other numeric values can be used,
* but only the Spawn value will be handled in a special way. All other values will be sorted numerically.
* Behaviors with the same value will not be given any specific sort order, as they are assumed to not
* interfere with each other.
*/
var BehaviorOrder;
(function(BehaviorOrder) {
	/**
	* Spawn - initial placement and/or rotation. This happens before rotation/translation due to
	* emitter rotation/position is applied.
	*/
	BehaviorOrder[BehaviorOrder["Spawn"] = 0] = "Spawn";
	/**
	* Normal priority, for things that don't matter when they are applied.
	*/
	BehaviorOrder[BehaviorOrder["Normal"] = 2] = "Normal";
	/**
	* Delayed priority, for things that need to read other values in order to act correctly.
	*/
	BehaviorOrder[BehaviorOrder["Late"] = 5] = "Late";
})(BehaviorOrder || (BehaviorOrder = {}));
/**
* @hidden
*/
var ticker = Ticker.shared;
/**
* Key used in sorted order to determine when to set particle position from the emitter position
* and rotation.
*/
var PositionParticle = Symbol("Position particle per emitter position");
/**
* A particle emitter.
*/
var Emitter = class Emitter {
	/**
	* @param particleParent The container to add the particles to.
	* @param particleImages A texture or array of textures to use
	*                       for the particles. Strings will be turned
	*                       into textures via Texture.from().
	* @param config A configuration object containing settings for the emitter.
	* @param config.emit If config.emit is explicitly passed as false, the
	*                    Emitter will start disabled.
	* @param config.autoUpdate If config.autoUpdate is explicitly passed as
	*                          true, the Emitter will automatically call
	*                          update via the PIXI shared ticker.
	*/
	constructor(particleParent, config) {
		this.initBehaviors = [];
		this.updateBehaviors = [];
		this.recycleBehaviors = [];
		this.minLifetime = 0;
		this.maxLifetime = 0;
		this.customEase = null;
		this._frequency = 1;
		this.spawnChance = 1;
		this.maxParticles = 1e3;
		this.emitterLifetime = -1;
		this.spawnPos = new Point();
		this.particlesPerWave = 1;
		this.rotation = 0;
		this.ownerPos = new Point();
		this._prevEmitterPos = new Point();
		this._prevPosIsValid = false;
		this._posChanged = false;
		this._parent = null;
		this.addAtBack = false;
		this.particleCount = 0;
		this._emit = false;
		this._spawnTimer = 0;
		this._emitterLife = -1;
		this._activeParticlesFirst = null;
		this._activeParticlesLast = null;
		this._poolFirst = null;
		this._origConfig = null;
		this._autoUpdate = false;
		this._destroyWhenComplete = false;
		this._completeCallback = null;
		this.parent = particleParent;
		if (config) this.init(config);
		this.recycle = this.recycle;
		this.update = this.update;
		this.rotate = this.rotate;
		this.updateSpawnPos = this.updateSpawnPos;
		this.updateOwnerPos = this.updateOwnerPos;
	}
	/**
	* Registers a new behavior, so that it will be recognized when initializing emitters.
	* Behaviors registered later with duplicate types will override older ones, although there is no limit on
	* the allowed types.
	* @param constructor The behavior class to register.
	*/
	static registerBehavior(constructor) {
		Emitter.knownBehaviors[constructor.type] = constructor;
	}
	/**
	* Time between particle spawns in seconds. If this value is not a number greater than 0,
	* it will be set to 1 (particle per second) to prevent infinite loops.
	*/
	get frequency() {
		return this._frequency;
	}
	set frequency(value) {
		if (typeof value === "number" && value > 0) this._frequency = value;
		else this._frequency = 1;
	}
	/**
	* The container to add particles to. Settings this will dump any active particles.
	*/
	get parent() {
		return this._parent;
	}
	set parent(value) {
		this.cleanup();
		this._parent = value;
	}
	/**
	* Sets up the emitter based on the config settings.
	* @param config A configuration object containing settings for the emitter.
	*/
	init(config) {
		if (!config) return;
		this.cleanup();
		this._origConfig = config;
		this.minLifetime = config.lifetime.min;
		this.maxLifetime = config.lifetime.max;
		if (config.ease) this.customEase = typeof config.ease === "function" ? config.ease : generateEase(config.ease);
		else this.customEase = null;
		this.particlesPerWave = 1;
		if (config.particlesPerWave && config.particlesPerWave > 1) this.particlesPerWave = config.particlesPerWave;
		this.frequency = config.frequency;
		this.spawnChance = typeof config.spawnChance === "number" && config.spawnChance > 0 ? config.spawnChance : 1;
		this.emitterLifetime = config.emitterLifetime || -1;
		this.maxParticles = config.maxParticles > 0 ? config.maxParticles : 1e3;
		this.addAtBack = !!config.addAtBack;
		this.rotation = 0;
		this.ownerPos.set(0);
		if (config.pos) this.spawnPos.copyFrom(config.pos);
		else this.spawnPos.set(0);
		this._prevEmitterPos.copyFrom(this.spawnPos);
		this._prevPosIsValid = false;
		this._spawnTimer = 0;
		this.emit = config.emit === void 0 ? true : !!config.emit;
		this.autoUpdate = !!config.autoUpdate;
		const behaviors = config.behaviors.map((data) => {
			const constructor = Emitter.knownBehaviors[data.type];
			if (!constructor) {
				console.error(`Unknown behavior: ${data.type}`);
				return null;
			}
			return new constructor(data.config);
		}).filter((b) => !!b);
		behaviors.push(PositionParticle);
		behaviors.sort((a, b) => {
			if (a === PositionParticle) return b.order === BehaviorOrder.Spawn ? 1 : -1;
			else if (b === PositionParticle) return a.order === BehaviorOrder.Spawn ? -1 : 1;
			return a.order - b.order;
		});
		this.initBehaviors = behaviors.slice();
		this.updateBehaviors = behaviors.filter((b) => b !== PositionParticle && b.updateParticle);
		this.recycleBehaviors = behaviors.filter((b) => b !== PositionParticle && b.recycleParticle);
	}
	/**
	* Gets the instantiated behavior of the specified type, if it is present on this emitter.
	* @param type The behavior type to find.
	*/
	getBehavior(type) {
		if (!Emitter.knownBehaviors[type]) return null;
		return this.initBehaviors.find((b) => b instanceof Emitter.knownBehaviors[type]) || null;
	}
	/**
	* Fills the pool with the specified number of particles, so that they don't have to be instantiated later.
	* @param count The number of particles to create.
	*/
	fillPool(count) {
		for (; count > 0; --count) {
			const p = new Particle(this);
			p.next = this._poolFirst;
			this._poolFirst = p;
		}
	}
	/**
	* Recycles an individual particle. For internal use only.
	* @param particle The particle to recycle.
	* @param fromCleanup If this is being called to manually clean up all particles.
	* @internal
	*/
	recycle(particle, fromCleanup = false) {
		for (let i = 0; i < this.recycleBehaviors.length; ++i) this.recycleBehaviors[i].recycleParticle(particle, !fromCleanup);
		if (particle.next) particle.next.prev = particle.prev;
		if (particle.prev) particle.prev.next = particle.next;
		if (particle === this._activeParticlesLast) this._activeParticlesLast = particle.prev;
		if (particle === this._activeParticlesFirst) this._activeParticlesFirst = particle.next;
		particle.prev = null;
		particle.next = this._poolFirst;
		this._poolFirst = particle;
		if (particle.parent) particle.parent.removeChild(particle);
		--this.particleCount;
	}
	/**
	* Sets the rotation of the emitter to a new value. This rotates the spawn position in addition
	* to particle direction.
	* @param newRot The new rotation, in degrees.
	*/
	rotate(newRot) {
		if (this.rotation === newRot) return;
		const diff = newRot - this.rotation;
		this.rotation = newRot;
		rotatePoint(diff, this.spawnPos);
		this._posChanged = true;
	}
	/**
	* Changes the spawn position of the emitter.
	* @param x The new x value of the spawn position for the emitter.
	* @param y The new y value of the spawn position for the emitter.
	*/
	updateSpawnPos(x, y) {
		this._posChanged = true;
		this.spawnPos.x = x;
		this.spawnPos.y = y;
	}
	/**
	* Changes the position of the emitter's owner. You should call this if you are adding
	* particles to the world container that your emitter's owner is moving around in.
	* @param x The new x value of the emitter's owner.
	* @param y The new y value of the emitter's owner.
	*/
	updateOwnerPos(x, y) {
		this._posChanged = true;
		this.ownerPos.x = x;
		this.ownerPos.y = y;
	}
	/**
	* Prevents emitter position interpolation in the next update.
	* This should be used if you made a major position change of your emitter's owner
	* that was not normal movement.
	*/
	resetPositionTracking() {
		this._prevPosIsValid = false;
	}
	/**
	* If particles should be emitted during update() calls. Setting this to false
	* stops new particles from being created, but allows existing ones to die out.
	*/
	get emit() {
		return this._emit;
	}
	set emit(value) {
		this._emit = !!value;
		this._emitterLife = this.emitterLifetime;
	}
	/**
	* If the update function is called automatically from the shared ticker.
	* Setting this to false requires calling the update function manually.
	*/
	get autoUpdate() {
		return this._autoUpdate;
	}
	set autoUpdate(value) {
		if (this._autoUpdate && !value) ticker.remove(this.update, this);
		else if (!this._autoUpdate && value) ticker.add(this.update, this);
		this._autoUpdate = !!value;
	}
	/**
	* Starts emitting particles, sets autoUpdate to true, and sets up the Emitter to destroy itself
	* when particle emission is complete.
	* @param callback Callback for when emission is complete (all particles have died off)
	*/
	playOnceAndDestroy(callback) {
		this.autoUpdate = true;
		this.emit = true;
		this._destroyWhenComplete = true;
		this._completeCallback = callback;
	}
	/**
	* Starts emitting particles and optionally calls a callback when particle emission is complete.
	* @param callback Callback for when emission is complete (all particles have died off)
	*/
	playOnce(callback) {
		this.emit = true;
		this._completeCallback = callback;
	}
	/**
	* Updates all particles spawned by this emitter and emits new ones.
	* @param delta Time elapsed since the previous frame, in __seconds__.
	*/
	update(delta) {
		if (this._autoUpdate) delta = ticker.elapsedMS * .001;
		if (!this._parent) return;
		for (let particle = this._activeParticlesFirst, next; particle; particle = next) {
			next = particle.next;
			particle.age += delta;
			if (particle.age > particle.maxLife || particle.age < 0) this.recycle(particle);
			else {
				let lerp = particle.age * particle.oneOverLife;
				if (this.customEase) if (this.customEase.length === 4) lerp = this.customEase(lerp, 0, 1, 1);
				else lerp = this.customEase(lerp);
				particle.agePercent = lerp;
				for (let i = 0; i < this.updateBehaviors.length; ++i) if (this.updateBehaviors[i].updateParticle(particle, delta)) {
					this.recycle(particle);
					break;
				}
			}
		}
		let prevX;
		let prevY;
		if (this._prevPosIsValid) {
			prevX = this._prevEmitterPos.x;
			prevY = this._prevEmitterPos.y;
		}
		const curX = this.ownerPos.x + this.spawnPos.x;
		const curY = this.ownerPos.y + this.spawnPos.y;
		if (this._emit) {
			this._spawnTimer -= delta < 0 ? 0 : delta;
			while (this._spawnTimer <= 0) {
				if (this._emitterLife >= 0) {
					this._emitterLife -= this._frequency;
					if (this._emitterLife <= 0) {
						this._spawnTimer = 0;
						this._emitterLife = 0;
						this.emit = false;
						break;
					}
				}
				if (this.particleCount >= this.maxParticles) {
					this._spawnTimer += this._frequency;
					continue;
				}
				let emitPosX;
				let emitPosY;
				if (this._prevPosIsValid && this._posChanged) {
					const lerp = 1 + this._spawnTimer / delta;
					emitPosX = (curX - prevX) * lerp + prevX;
					emitPosY = (curY - prevY) * lerp + prevY;
				} else {
					emitPosX = curX;
					emitPosY = curY;
				}
				let waveFirst = null;
				let waveLast = null;
				for (let len = Math.min(this.particlesPerWave, this.maxParticles - this.particleCount), i = 0; i < len; ++i) {
					if (this.spawnChance < 1 && Math.random() >= this.spawnChance) continue;
					let lifetime;
					if (this.minLifetime === this.maxLifetime) lifetime = this.minLifetime;
					else lifetime = Math.random() * (this.maxLifetime - this.minLifetime) + this.minLifetime;
					if (-this._spawnTimer >= lifetime) continue;
					let p;
					if (this._poolFirst) {
						p = this._poolFirst;
						this._poolFirst = this._poolFirst.next;
						p.next = null;
					} else p = new Particle(this);
					p.init(lifetime);
					if (this.addAtBack) this._parent.addChildAt(p, 0);
					else this._parent.addChild(p);
					if (waveFirst) {
						waveLast.next = p;
						p.prev = waveLast;
						waveLast = p;
					} else waveLast = waveFirst = p;
					++this.particleCount;
				}
				if (waveFirst) {
					if (this._activeParticlesLast) {
						this._activeParticlesLast.next = waveFirst;
						waveFirst.prev = this._activeParticlesLast;
						this._activeParticlesLast = waveLast;
					} else {
						this._activeParticlesFirst = waveFirst;
						this._activeParticlesLast = waveLast;
					}
					for (let i = 0; i < this.initBehaviors.length; ++i) {
						const behavior = this.initBehaviors[i];
						if (behavior === PositionParticle) for (let particle = waveFirst, next; particle; particle = next) {
							next = particle.next;
							if (this.rotation !== 0) {
								rotatePoint(this.rotation, particle.position);
								particle.rotation += this.rotation;
							}
							particle.position.x += emitPosX;
							particle.position.y += emitPosY;
							particle.age += -this._spawnTimer;
							let lerp = particle.age * particle.oneOverLife;
							if (this.customEase) if (this.customEase.length === 4) lerp = this.customEase(lerp, 0, 1, 1);
							else lerp = this.customEase(lerp);
							particle.agePercent = lerp;
						}
						else behavior.initParticles(waveFirst);
					}
					for (let particle = waveFirst, next; particle; particle = next) {
						next = particle.next;
						for (let i = 0; i < this.updateBehaviors.length; ++i) if (this.updateBehaviors[i].updateParticle(particle, -this._spawnTimer)) {
							this.recycle(particle);
							break;
						}
					}
				}
				this._spawnTimer += this._frequency;
			}
		}
		if (this._posChanged) {
			this._prevEmitterPos.x = curX;
			this._prevEmitterPos.y = curY;
			this._prevPosIsValid = true;
			this._posChanged = false;
		}
		if (!this._emit && !this._activeParticlesFirst) {
			if (this._completeCallback) {
				const cb = this._completeCallback;
				this._completeCallback = null;
				cb();
			}
			if (this._destroyWhenComplete) this.destroy();
		}
	}
	/**
	* Emits a single wave of particles, using standard spawnChance & particlesPerWave settings. Does not affect
	* regular spawning through the frequency, and ignores the emit property. The max particle count is respected, however,
	* so if there are already too many particles then nothing will happen.
	*/
	emitNow() {
		const emitPosX = this.ownerPos.x + this.spawnPos.x;
		const emitPosY = this.ownerPos.y + this.spawnPos.y;
		let waveFirst = null;
		let waveLast = null;
		for (let len = Math.min(this.particlesPerWave, this.maxParticles - this.particleCount), i = 0; i < len; ++i) {
			if (this.spawnChance < 1 && Math.random() >= this.spawnChance) continue;
			let p;
			if (this._poolFirst) {
				p = this._poolFirst;
				this._poolFirst = this._poolFirst.next;
				p.next = null;
			} else p = new Particle(this);
			let lifetime;
			if (this.minLifetime === this.maxLifetime) lifetime = this.minLifetime;
			else lifetime = Math.random() * (this.maxLifetime - this.minLifetime) + this.minLifetime;
			p.init(lifetime);
			if (this.addAtBack) this._parent.addChildAt(p, 0);
			else this._parent.addChild(p);
			if (waveFirst) {
				waveLast.next = p;
				p.prev = waveLast;
				waveLast = p;
			} else waveLast = waveFirst = p;
			++this.particleCount;
		}
		if (waveFirst) {
			if (this._activeParticlesLast) {
				this._activeParticlesLast.next = waveFirst;
				waveFirst.prev = this._activeParticlesLast;
				this._activeParticlesLast = waveLast;
			} else {
				this._activeParticlesFirst = waveFirst;
				this._activeParticlesLast = waveLast;
			}
			for (let i = 0; i < this.initBehaviors.length; ++i) {
				const behavior = this.initBehaviors[i];
				if (behavior === PositionParticle) for (let particle = waveFirst, next; particle; particle = next) {
					next = particle.next;
					if (this.rotation !== 0) {
						rotatePoint(this.rotation, particle.position);
						particle.rotation += this.rotation;
					}
					particle.position.x += emitPosX;
					particle.position.y += emitPosY;
				}
				else behavior.initParticles(waveFirst);
			}
		}
	}
	/**
	* Kills all active particles immediately.
	*/
	cleanup() {
		let particle;
		let next;
		for (particle = this._activeParticlesFirst; particle; particle = next) {
			next = particle.next;
			this.recycle(particle, true);
		}
		this._activeParticlesFirst = this._activeParticlesLast = null;
		this.particleCount = 0;
	}
	/**
	* If this emitter has been destroyed. Note that a destroyed emitter can still be reused, after
	* having a new parent set and being reinitialized.
	*/
	get destroyed() {
		return !(this._parent && this.initBehaviors.length);
	}
	/**
	* Destroys the emitter and all of its particles.
	*/
	destroy() {
		this.autoUpdate = false;
		this.cleanup();
		let next;
		for (let particle = this._poolFirst; particle; particle = next) {
			next = particle.next;
			particle.destroy();
		}
		this._poolFirst = this._parent = this.spawnPos = this.ownerPos = this.customEase = this._completeCallback = null;
		this.initBehaviors.length = this.updateBehaviors.length = this.recycleBehaviors.length = 0;
	}
};
Emitter.knownBehaviors = {};
/**
* A SpawnShape that randomly picks locations inside a rectangle.
*
* Example config:
* ```javascript
* {
*     type: 'rect',
*     data: {
*          x: 0,
*          y: 0,
*          w: 10,
*          h: 100
*     }
* }
* ```
*/
var Rectangle = class {
	constructor(config) {
		this.x = config.x;
		this.y = config.y;
		this.w = config.w;
		this.h = config.h;
	}
	getRandPos(particle) {
		particle.x = Math.random() * this.w + this.x;
		particle.y = Math.random() * this.h + this.y;
	}
};
Rectangle.type = "rect";
Rectangle.editorConfig = null;
/**
* A class for spawning particles in a circle or ring.
* Can optionally apply rotation to particles so that they are aimed away from the center of the circle.
*
* Example config:
* ```javascript
* {
*     type: 'torus',
*     data: {
*          radius: 30,
*          x: 0,
*          y: 0,
*          innerRadius: 10,
*          rotation: true
*     }
* }
* ```
*/
var Torus = class {
	constructor(config) {
		this.x = config.x || 0;
		this.y = config.y || 0;
		this.radius = config.radius;
		this.innerRadius = config.innerRadius || 0;
		this.rotation = !!config.affectRotation;
	}
	getRandPos(particle) {
		if (this.innerRadius !== this.radius) particle.x = Math.random() * (this.radius - this.innerRadius) + this.innerRadius;
		else particle.x = this.radius;
		particle.y = 0;
		const angle = Math.random() * Math.PI * 2;
		if (this.rotation) particle.rotation += angle;
		rotatePoint(angle, particle.position);
		particle.position.x += this.x;
		particle.position.y += this.y;
	}
};
Torus.type = "torus";
Torus.editorConfig = null;
/**
* A spawn shape that picks a random position along a series of line segments. If those
* line segments form a polygon, particles will only be placed on the perimeter of that polygon.
*
* Example config:
* ```javascript
* {
*      type: 'polygonalChain',
*      data: [
*          [{x: 0, y: 0}, {x: 10, y: 10}, {x: 20, y: 0}],
*          [{x: 0, y, -10}, {x: 10, y: 0}, {x: 20, y: -10}]
*      ]
* }
* ```
*/
var PolygonalChain = class {
	/**
	* @param data Point data for polygon chains. Either a list of points for a single chain, or a list of chains.
	*/
	constructor(data) {
		this.segments = [];
		this.countingLengths = [];
		this.totalLength = 0;
		this.init(data);
	}
	/**
	* @param data Point data for polygon chains. Either a list of points for a single chain, or a list of chains.
	*/
	init(data) {
		if (!data || !data.length) this.segments.push({
			p1: {
				x: 0,
				y: 0
			},
			p2: {
				x: 0,
				y: 0
			},
			l: 0
		});
		else if (Array.isArray(data[0])) for (let i = 0; i < data.length; ++i) {
			const chain = data[i];
			let prevPoint = chain[0];
			for (let j = 1; j < chain.length; ++j) {
				const second = chain[j];
				this.segments.push({
					p1: prevPoint,
					p2: second,
					l: 0
				});
				prevPoint = second;
			}
		}
		else {
			let prevPoint = data[0];
			for (let i = 1; i < data.length; ++i) {
				const second = data[i];
				this.segments.push({
					p1: prevPoint,
					p2: second,
					l: 0
				});
				prevPoint = second;
			}
		}
		for (let i = 0; i < this.segments.length; ++i) {
			const { p1, p2 } = this.segments[i];
			const segLength = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
			this.segments[i].l = segLength;
			this.totalLength += segLength;
			this.countingLengths.push(this.totalLength);
		}
	}
	/**
	* Gets a random point in the chain.
	* @param out The point to store the selected position in.
	*/
	getRandPos(out) {
		const rand = Math.random() * this.totalLength;
		let chosenSeg;
		let lerp;
		if (this.segments.length === 1) {
			chosenSeg = this.segments[0];
			lerp = rand;
		} else for (let i = 0; i < this.countingLengths.length; ++i) if (rand < this.countingLengths[i]) {
			chosenSeg = this.segments[i];
			lerp = i === 0 ? rand : rand - this.countingLengths[i - 1];
			break;
		}
		lerp /= chosenSeg.l || 1;
		const { p1, p2 } = chosenSeg;
		out.x = p1.x + lerp * (p2.x - p1.x);
		out.y = p1.y + lerp * (p2.y - p1.y);
	}
};
PolygonalChain.type = "polygonalChain";
PolygonalChain.editorConfig = null;
/**
* A Movement behavior that handles movement by applying a constant acceleration to all particles.
*
* Example configuration:
* ```javascript
* {
*     "type": "moveAcceleration",
*     "config": {
*          "accel": {
*               "x": 0,
*               "y": 2000
*          },
*          "minStart": 600,
*          "maxStart": 600,
*          "rotate": true
*     }
*}
* ```
*/
var AccelerationBehavior = class {
	constructor(config) {
		var _a;
		this.order = BehaviorOrder.Late;
		this.minStart = config.minStart;
		this.maxStart = config.maxStart;
		this.accel = config.accel;
		this.rotate = !!config.rotate;
		this.maxSpeed = (_a = config.maxSpeed) !== null && _a !== void 0 ? _a : 0;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			const speed = Math.random() * (this.maxStart - this.minStart) + this.minStart;
			if (!next.config.velocity) next.config.velocity = new Point(speed, 0);
			else next.config.velocity.set(speed, 0);
			rotatePoint(next.rotation, next.config.velocity);
			next = next.next;
		}
	}
	updateParticle(particle, deltaSec) {
		const vel = particle.config.velocity;
		const oldVX = vel.x;
		const oldVY = vel.y;
		vel.x += this.accel.x * deltaSec;
		vel.y += this.accel.y * deltaSec;
		if (this.maxSpeed) {
			const currentSpeed = length(vel);
			if (currentSpeed > this.maxSpeed) scaleBy(vel, this.maxSpeed / currentSpeed);
		}
		particle.x += (oldVX + vel.x) / 2 * deltaSec;
		particle.y += (oldVY + vel.y) / 2 * deltaSec;
		if (this.rotate) particle.rotation = Math.atan2(vel.y, vel.x);
	}
};
AccelerationBehavior.type = "moveAcceleration";
AccelerationBehavior.editorConfig = null;
function intValueSimple(lerp) {
	if (this.ease) lerp = this.ease(lerp);
	return (this.first.next.value - this.first.value) * lerp + this.first.value;
}
function intColorSimple(lerp) {
	if (this.ease) lerp = this.ease(lerp);
	const curVal = this.first.value;
	const nextVal = this.first.next.value;
	return combineRGBComponents((nextVal.r - curVal.r) * lerp + curVal.r, (nextVal.g - curVal.g) * lerp + curVal.g, (nextVal.b - curVal.b) * lerp + curVal.b);
}
function intValueComplex(lerp) {
	if (this.ease) lerp = this.ease(lerp);
	let current = this.first;
	let next = current.next;
	while (lerp > next.time) {
		current = next;
		next = next.next;
	}
	lerp = (lerp - current.time) / (next.time - current.time);
	return (next.value - current.value) * lerp + current.value;
}
function intColorComplex(lerp) {
	if (this.ease) lerp = this.ease(lerp);
	let current = this.first;
	let next = current.next;
	while (lerp > next.time) {
		current = next;
		next = next.next;
	}
	lerp = (lerp - current.time) / (next.time - current.time);
	const curVal = current.value;
	const nextVal = next.value;
	return combineRGBComponents((nextVal.r - curVal.r) * lerp + curVal.r, (nextVal.g - curVal.g) * lerp + curVal.g, (nextVal.b - curVal.b) * lerp + curVal.b);
}
function intValueStepped(lerp) {
	if (this.ease) lerp = this.ease(lerp);
	let current = this.first;
	while (current.next && lerp > current.next.time) current = current.next;
	return current.value;
}
function intColorStepped(lerp) {
	if (this.ease) lerp = this.ease(lerp);
	let current = this.first;
	while (current.next && lerp > current.next.time) current = current.next;
	const curVal = current.value;
	return combineRGBComponents(curVal.r, curVal.g, curVal.b);
}
/**
* Singly linked list container for keeping track of interpolated properties for particles.
* Each Particle will have one of these for each interpolated property.
*/
var PropertyList = class {
	/**
	* @param isColor If this list handles color values
	*/
	constructor(isColor = false) {
		this.first = null;
		this.isColor = !!isColor;
		this.interpolate = null;
		this.ease = null;
	}
	/**
	* Resets the list for use.
	* @param first The first node in the list.
	* @param first.isStepped If the values should be stepped instead of interpolated linearly.
	*/
	reset(first) {
		this.first = first;
		if (first.next && first.next.time >= 1) this.interpolate = this.isColor ? intColorSimple : intValueSimple;
		else if (first.isStepped) this.interpolate = this.isColor ? intColorStepped : intValueStepped;
		else this.interpolate = this.isColor ? intColorComplex : intValueComplex;
		this.ease = this.first.ease;
	}
};
/**
* An Alpha behavior that applies an interpolated or stepped list of values to the particle's opacity.
*
* Example config:
* ```javascript
* {
*     type: 'alpha',
*     config: {
*         alpha: {
*              list: [{value: 0, time: 0}, {value: 1, time: 0.25}, {value: 0, time: 1}]
*         },
*     }
* }
* ```
*/
var AlphaBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.list = new PropertyList(false);
		this.list.reset(PropertyNode.createList(config.alpha));
	}
	initParticles(first) {
		let next = first;
		while (next) {
			next.alpha = this.list.first.value;
			next = next.next;
		}
	}
	updateParticle(particle) {
		particle.alpha = this.list.interpolate(particle.agePercent);
	}
};
AlphaBehavior.type = "alpha";
AlphaBehavior.editorConfig = null;
/**
* An Alpha behavior that applies a static value to the particle's opacity at particle initialization.
*
* Example config:
* ```javascript
* {
*     type: 'alphaStatic',
*     config: {
*         alpha: 0.75,
*     }
* }
* ```
*/
var StaticAlphaBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.value = config.alpha;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			next.alpha = this.value;
			next = next.next;
		}
	}
};
StaticAlphaBehavior.type = "alphaStatic";
StaticAlphaBehavior.editorConfig = null;
function getTextures(textures) {
	const outTextures = [];
	for (let j = 0; j < textures.length; ++j) {
		let tex = textures[j];
		if (typeof tex === "string") outTextures.push(GetTextureFromString(tex));
		else if (tex instanceof Texture) outTextures.push(tex);
		else {
			let dupe = tex.count || 1;
			if (typeof tex.texture === "string") tex = GetTextureFromString(tex.texture);
			else tex = tex.texture;
			for (; dupe > 0; --dupe) outTextures.push(tex);
		}
	}
	return outTextures;
}
/**
* A Texture behavior that picks a random animation for each particle to play.
* See {@link AnimatedParticleArt} for detailed configuration info.
*
* Example config:
* ```javascript
* {
*     type: 'animatedRandom',
*     config: {
*         anims: [
*              {
*                  framerate: 25,
*                  loop: true,
*                  textures: ['frame1', 'frame2', 'frame3']
*              },
*              {
*                  framerate: 25,
*                  loop: true,
*                  textures: ['frame3', 'frame2', 'frame1']
*              }
*         ],
*     }
* }
* ```
*/
var RandomAnimatedTextureBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.anims = [];
		for (let i = 0; i < config.anims.length; ++i) {
			const anim = config.anims[i];
			const textures = getTextures(anim.textures);
			const framerate = anim.framerate < 0 ? -1 : anim.framerate > 0 ? anim.framerate : 60;
			const parsedAnim = {
				textures,
				duration: framerate > 0 ? textures.length / framerate : 0,
				framerate,
				loop: framerate > 0 ? !!anim.loop : false
			};
			this.anims.push(parsedAnim);
		}
	}
	initParticles(first) {
		let next = first;
		while (next) {
			const index = Math.floor(Math.random() * this.anims.length);
			const anim = next.config.anim = this.anims[index];
			next.texture = anim.textures[0];
			next.config.animElapsed = 0;
			if (anim.framerate === -1) {
				next.config.animDuration = next.maxLife;
				next.config.animFramerate = anim.textures.length / next.maxLife;
			} else {
				next.config.animDuration = anim.duration;
				next.config.animFramerate = anim.framerate;
			}
			next = next.next;
		}
	}
	updateParticle(particle, deltaSec) {
		const config = particle.config;
		const anim = config.anim;
		config.animElapsed += deltaSec;
		if (config.animElapsed >= config.animDuration) if (config.anim.loop) config.animElapsed = config.animElapsed % config.animDuration;
		else config.animElapsed = config.animDuration - 1e-6;
		const frame = config.animElapsed * config.animFramerate + 1e-7 | 0;
		particle.texture = anim.textures[frame] || anim.textures[anim.textures.length - 1] || Texture.EMPTY;
	}
};
RandomAnimatedTextureBehavior.type = "animatedRandom";
RandomAnimatedTextureBehavior.editorConfig = null;
/**
* A Texture behavior that uses a single animation for each particle to play.
* See {@link AnimatedParticleArt} for detailed configuration info.
*
* Example config:
* ```javascript
* {
*     type: 'animatedSingle',
*     config: {
*         anim: {
*              framerate: 25,
*              loop: true,
*              textures: ['frame1', 'frame2', 'frame3']
*         }
*     }
* }
* ```
*/
var SingleAnimatedTextureBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		const anim = config.anim;
		const textures = getTextures(anim.textures);
		const framerate = anim.framerate < 0 ? -1 : anim.framerate > 0 ? anim.framerate : 60;
		this.anim = {
			textures,
			duration: framerate > 0 ? textures.length / framerate : 0,
			framerate,
			loop: framerate > 0 ? !!anim.loop : false
		};
	}
	initParticles(first) {
		let next = first;
		const anim = this.anim;
		while (next) {
			next.texture = anim.textures[0];
			next.config.animElapsed = 0;
			if (anim.framerate === -1) {
				next.config.animDuration = next.maxLife;
				next.config.animFramerate = anim.textures.length / next.maxLife;
			} else {
				next.config.animDuration = anim.duration;
				next.config.animFramerate = anim.framerate;
			}
			next = next.next;
		}
	}
	updateParticle(particle, deltaSec) {
		const anim = this.anim;
		const config = particle.config;
		config.animElapsed += deltaSec;
		if (config.animElapsed >= config.animDuration) if (anim.loop) config.animElapsed = config.animElapsed % config.animDuration;
		else config.animElapsed = config.animDuration - 1e-6;
		const frame = config.animElapsed * config.animFramerate + 1e-7 | 0;
		particle.texture = anim.textures[frame] || anim.textures[anim.textures.length - 1] || Texture.EMPTY;
	}
};
SingleAnimatedTextureBehavior.type = "animatedSingle";
SingleAnimatedTextureBehavior.editorConfig = null;
/**
* A Blend Mode behavior that applies a blend mode value to the particle at initialization.
*
* Example config:
* ```javascript
* {
*     type: 'blendMode',
*     config: {
*         blendMode: 'multiply',
*     }
* }
* ```
*/
var BlendModeBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.value = config.blendMode;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			next.blendMode = getBlendMode(this.value);
			next = next.next;
		}
	}
};
BlendModeBehavior.type = "blendMode";
BlendModeBehavior.editorConfig = null;
/**
* A Spawn behavior that sends particles out from a single point or ring, and is capable of evenly spacing
* the particle's starting angles.
*
* Example config:
* ```javascript
* {
*     type: 'spawnBurst',
*     config: {
*          spacing: 90,
*          start: 0,
*          distance: 40,
*     }
* }
* ```
*/
var BurstSpawnBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Spawn;
		this.spacing = config.spacing * DEG_TO_RADS;
		this.start = config.start * DEG_TO_RADS;
		this.distance = config.distance;
	}
	initParticles(first) {
		let count = 0;
		let next = first;
		while (next) {
			let angle;
			if (this.spacing) angle = this.start + this.spacing * count;
			else angle = Math.random() * Math.PI * 2;
			next.rotation = angle;
			if (this.distance) {
				next.position.x = this.distance;
				rotatePoint(angle, next.position);
			}
			next = next.next;
			++count;
		}
	}
};
BurstSpawnBehavior.type = "spawnBurst";
BurstSpawnBehavior.editorConfig = null;
/**
* A Color behavior that applies an interpolated or stepped list of values to the particle's tint property.
*
* Example config:
* ```javascript
* {
*     type: 'color',
*     config: {
*         color: {
*              list: [{value: '#ff0000' time: 0}, {value: '#00ff00', time: 0.5}, {value: '#0000ff', time: 1}]
*         },
*     }
* }
* ```
*/
var ColorBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.list = new PropertyList(true);
		this.list.reset(PropertyNode.createList(config.color));
	}
	initParticles(first) {
		let next = first;
		const color = this.list.first.value;
		const tint = combineRGBComponents(color.r, color.g, color.b);
		while (next) {
			next.tint = tint;
			next = next.next;
		}
	}
	updateParticle(particle) {
		particle.tint = this.list.interpolate(particle.agePercent);
	}
};
ColorBehavior.type = "color";
ColorBehavior.editorConfig = null;
/**
* A Color behavior that applies a single color to the particle's tint property at initialization.
*
* Example config:
* ```javascript
* {
*     type: 'colorStatic',
*     config: {
*         color: '#ffff00',
*     }
* }
* ```
*/
var StaticColorBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		let color = config.color;
		if (color.charAt(0) === "#") color = color.substr(1);
		else if (color.indexOf("0x") === 0) color = color.substr(2);
		this.value = parseInt(color, 16);
	}
	initParticles(first) {
		let next = first;
		while (next) {
			next.tint = this.value;
			next = next.next;
		}
	}
};
StaticColorBehavior.type = "colorStatic";
StaticColorBehavior.editorConfig = null;
/**
* A Texture behavior that assigns a texture to each particle from its list, in order, before looping around to the first
* texture again. String values will be converted to textures with {@link ParticleUtils.GetTextureFromString}.
*
* Example config:
* ```javascript
* {
*     type: 'textureOrdered',
*     config: {
*         textures: ["myTex1Id", "myTex2Id", "myTex3Id", "myTex4Id"],
*     }
* }
* ```
*/
var OrderedTextureBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.index = 0;
		this.textures = config.textures.map((tex) => typeof tex === "string" ? GetTextureFromString(tex) : tex);
	}
	initParticles(first) {
		let next = first;
		while (next) {
			next.texture = this.textures[this.index];
			if (++this.index >= this.textures.length) this.index = 0;
			next = next.next;
		}
	}
};
OrderedTextureBehavior.type = "textureOrdered";
OrderedTextureBehavior.editorConfig = null;
/**
* A helper point for math things.
* @hidden
*/
var helperPoint = new Point();
/**
* A hand picked list of Math functions (and a couple properties) that are
* allowable. They should be used without the preceding "Math."
* @hidden
*/
var MATH_FUNCS = [
	"E",
	"LN2",
	"LN10",
	"LOG2E",
	"LOG10E",
	"PI",
	"SQRT1_2",
	"SQRT2",
	"abs",
	"acos",
	"acosh",
	"asin",
	"asinh",
	"atan",
	"atanh",
	"atan2",
	"cbrt",
	"ceil",
	"cos",
	"cosh",
	"exp",
	"expm1",
	"floor",
	"fround",
	"hypot",
	"log",
	"log1p",
	"log10",
	"log2",
	"max",
	"min",
	"pow",
	"random",
	"round",
	"sign",
	"sin",
	"sinh",
	"sqrt",
	"tan",
	"tanh"
];
/**
* create an actual regular expression object from the string
* @hidden
*/
var WHITELISTER = new RegExp(["[01234567890\\.\\*\\-\\+\\/\\(\\)x ,]"].concat(MATH_FUNCS).join("|"), "g");
/**
* Parses a string into a function for path following.
* This involves whitelisting the string for safety, inserting "Math." to math function
* names, and using `new Function()` to generate a function.
* @hidden
* @param pathString The string to parse.
* @return The path function - takes x, outputs y.
*/
function parsePath(pathString) {
	const matches = pathString.match(WHITELISTER);
	for (let i = matches.length - 1; i >= 0; --i) if (MATH_FUNCS.indexOf(matches[i]) >= 0) matches[i] = `Math.${matches[i]}`;
	pathString = matches.join("");
	return new Function("x", `return ${pathString};`);
}
/**
* A particle that follows a path defined by an algebraic expression, e.g. "sin(x)" or
* "5x + 3".
* To use this class, the behavior config must have a "path" string or function.
*
* A string should have "x" in it to represent movement (from the
* speed settings of the behavior). It may have numbers, parentheses, the four basic
* operations, and any Math functions or properties (without the preceding "Math.").
* The overall movement of the particle and the expression value become x and y positions for
* the particle, respectively. The final position is rotated by the spawn rotation/angle of
* the particle.
*
* A function merely needs to accept the "x" argument and output the a corresponding "y" value.
*
* Some example paths:
*
* * `"sin(x/10) * 20"` A sine wave path.
* * `"cos(x/100) * 30"` Particles curve counterclockwise (for medium speed/low lifetime particles)
* * `"pow(x/10, 2) / 2"` Particles curve clockwise (remember, +y is down).
* * `(x) => Math.floor(x) * 3` Supplying an existing function should look like this
*
* Example configuration:
* ```javascript
* {
*     "type": "movePath",
*     "config": {
*          "path": "round(sin(x) * 2",
*          "speed": {
*              "list": [{value: 10, time: 0}, {value: 100, time: 0.25}, {value: 0, time: 1}],
*          },
*          "minMult": 0.8
*     }
*}
*/
var PathBehavior = class {
	constructor(config) {
		var _a;
		this.order = BehaviorOrder.Late;
		if (config.path) if (typeof config.path === "function") this.path = config.path;
		else try {
			this.path = parsePath(config.path);
		} catch (e) {
			this.path = null;
		}
		else this.path = (x) => x;
		this.list = new PropertyList(false);
		this.list.reset(PropertyNode.createList(config.speed));
		this.minMult = (_a = config.minMult) !== null && _a !== void 0 ? _a : 1;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			next.config.initRotation = next.rotation;
			if (!next.config.initPosition) next.config.initPosition = new Point(next.x, next.y);
			else next.config.initPosition.copyFrom(next.position);
			next.config.movement = 0;
			const mult = Math.random() * (1 - this.minMult) + this.minMult;
			next.config.speedMult = mult;
			next = next.next;
		}
	}
	updateParticle(particle, deltaSec) {
		const speed = this.list.interpolate(particle.agePercent) * particle.config.speedMult;
		particle.config.movement += speed * deltaSec;
		helperPoint.x = particle.config.movement;
		helperPoint.y = this.path(helperPoint.x);
		rotatePoint(particle.config.initRotation, helperPoint);
		particle.position.x = particle.config.initPosition.x + helperPoint.x;
		particle.position.y = particle.config.initPosition.y + helperPoint.y;
	}
};
PathBehavior.type = "movePath";
PathBehavior.editorConfig = null;
/**
* A Spawn behavior that sends particles out from a single point at the emitter's position.
*
* Example config:
* ```javascript
* {
*     type: 'spawnPoint',
*     config: {}
* }
* ```
*/
var PointSpawnBehavior = class {
	constructor() {
		this.order = BehaviorOrder.Spawn;
	}
	initParticles(_first) {}
};
PointSpawnBehavior.type = "spawnPoint";
PointSpawnBehavior.editorConfig = null;
/**
* A Texture behavior that assigns a random texture to each particle from its list.
* String values will be converted to textures with {@link ParticleUtils.GetTextureFromString}.
*
* Example config:
* ```javascript
* {
*     type: 'textureRandom',
*     config: {
*         textures: ["myTex1Id", "myTex2Id", "myTex3Id", "myTex4Id"],
*     }
* }
* ```
*/
var RandomTextureBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.textures = config.textures.map((tex) => typeof tex === "string" ? GetTextureFromString(tex) : tex);
	}
	initParticles(first) {
		let next = first;
		while (next) {
			const index = Math.floor(Math.random() * this.textures.length);
			next.texture = this.textures[index];
			next = next.next;
		}
	}
};
RandomTextureBehavior.type = "textureRandom";
RandomTextureBehavior.editorConfig = null;
/**
* A Rotation behavior that handles starting rotation, rotation speed, and rotational acceleration.
*
* Example configuration:
* ```javascript
* {
*     "type": "rotation",
*     "config": {
*          "minStart": 0,
*          "maxStart": 180,
*          "minSpeed": 30,
*          "maxSpeed": 45,
*          "accel": 20
*     }
*}
* ```
*/
var RotationBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.minStart = config.minStart * DEG_TO_RADS;
		this.maxStart = config.maxStart * DEG_TO_RADS;
		this.minSpeed = config.minSpeed * DEG_TO_RADS;
		this.maxSpeed = config.maxSpeed * DEG_TO_RADS;
		this.accel = config.accel * DEG_TO_RADS;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			if (this.minStart === this.maxStart) next.rotation += this.maxStart;
			else next.rotation += Math.random() * (this.maxStart - this.minStart) + this.minStart;
			next.config.rotSpeed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
			next = next.next;
		}
	}
	updateParticle(particle, deltaSec) {
		if (this.accel) {
			const oldSpeed = particle.config.rotSpeed;
			particle.config.rotSpeed += this.accel * deltaSec;
			particle.rotation += (particle.config.rotSpeed + oldSpeed) / 2 * deltaSec;
		} else particle.rotation += particle.config.rotSpeed * deltaSec;
	}
};
RotationBehavior.type = "rotation";
RotationBehavior.editorConfig = null;
/**
* A Rotation behavior that handles starting rotation.
*
* Example configuration:
* ```javascript
* {
*     "type": "rotationStatic",
*     "config": {
*          "min": 0,
*          "max": 180,
*     }
*}
* ```
*/
var StaticRotationBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.min = config.min * DEG_TO_RADS;
		this.max = config.max * DEG_TO_RADS;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			if (this.min === this.max) next.rotation += this.max;
			else next.rotation += Math.random() * (this.max - this.min) + this.min;
			next = next.next;
		}
	}
};
StaticRotationBehavior.type = "rotationStatic";
StaticRotationBehavior.editorConfig = null;
/**
* A Rotation behavior that blocks all rotation caused by spawn settings,
* by resetting it to the specified rotation (or 0).
*
* Example configuration:
* ```javascript
* {
*     "type": "noRotation",
*     "config": {
*          "rotation": 0
*     }
*}
* ```
*/
var NoRotationBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Late + 1;
		this.rotation = (config.rotation || 0) * DEG_TO_RADS;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			next.rotation = this.rotation;
			next = next.next;
		}
	}
};
NoRotationBehavior.type = "noRotation";
NoRotationBehavior.editorConfig = null;
/**
* A Scale behavior that applies an interpolated or stepped list of values to the particle's x & y scale.
*
* Example config:
* ```javascript
* {
*     type: 'scale',
*     config: {
*          scale: {
*              list: [{value: 0, time: 0}, {value: 1, time: 0.25}, {value: 0, time: 1}],
*              isStepped: true
*          },
*          minMult: 0.5
*     }
* }
* ```
*/
var ScaleBehavior = class {
	constructor(config) {
		var _a;
		this.order = BehaviorOrder.Normal;
		this.list = new PropertyList(false);
		this.list.reset(PropertyNode.createList(config.scale));
		this.minMult = (_a = config.minMult) !== null && _a !== void 0 ? _a : 1;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			const mult = Math.random() * (1 - this.minMult) + this.minMult;
			next.config.scaleMult = mult;
			next.scale.x = next.scale.y = this.list.first.value * mult;
			next = next.next;
		}
	}
	updateParticle(particle) {
		particle.scale.x = particle.scale.y = this.list.interpolate(particle.agePercent) * particle.config.scaleMult;
	}
};
ScaleBehavior.type = "scale";
ScaleBehavior.editorConfig = null;
/**
* A Scale behavior that applies a randomly picked value to the particle's x & y scale at initialization.
*
* Example config:
* ```javascript
* {
*     type: 'scaleStatic',
*     config: {
*         min: 0.25,
*         max: 0.75,
*     }
* }
* ```
*/
var StaticScaleBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.min = config.min;
		this.max = config.max;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			const scale = Math.random() * (this.max - this.min) + this.min;
			next.scale.x = next.scale.y = scale;
			next = next.next;
		}
	}
};
StaticScaleBehavior.type = "scaleStatic";
StaticScaleBehavior.editorConfig = null;
/**
* A Spawn behavior that places (and optionally rotates) particles according to a
* specified shape. Additional shapes can be registered with {@link registerShape | SpawnShape.registerShape()}.
* Additional shapes must implement the {@link SpawnShape} interface, and their class must match the
* {@link SpawnShapeClass} interface.
* Shapes included by default are:
* * {@link Rectangle}
* * {@link Torus}
* * {@link PolygonalChain}
*
* Example config:
* ```javascript
* {
*     type: 'spawnShape',
*     config: {
*          type: 'rect',
*          data: {
*              x: 0,
*              y: 0,
*              width: 20,
*              height: 300,
*          }
*     }
* }
* ```
*/
var ShapeSpawnBehavior = class ShapeSpawnBehavior {
	constructor(config) {
		this.order = BehaviorOrder.Spawn;
		const ShapeClass = ShapeSpawnBehavior.shapes[config.type];
		if (!ShapeClass) throw new Error(`No shape found with type '${config.type}'`);
		this.shape = new ShapeClass(config.data);
	}
	/**
	* Registers a shape to be used by the ShapeSpawn behavior.
	* @param constructor The shape class constructor to use, with a static `type` property to reference it by.
	* @param typeOverride An optional type override, primarily for registering a shape under multiple names.
	*/
	static registerShape(constructor, typeOverride) {
		ShapeSpawnBehavior.shapes[typeOverride || constructor.type] = constructor;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			this.shape.getRandPos(next);
			next = next.next;
		}
	}
};
ShapeSpawnBehavior.type = "spawnShape";
ShapeSpawnBehavior.editorConfig = null;
/**
* Dictionary of all registered shape classes.
*/
ShapeSpawnBehavior.shapes = {};
ShapeSpawnBehavior.registerShape(PolygonalChain);
ShapeSpawnBehavior.registerShape(Rectangle);
ShapeSpawnBehavior.registerShape(Torus);
ShapeSpawnBehavior.registerShape(Torus, "circle");
/**
* A Textuure behavior that assigns a single texture to each particle.
* String values will be converted to textures with {@link ParticleUtils.GetTextureFromString}.
*
* Example config:
* ```javascript
* {
*     type: 'textureSingle',
*     config: {
*         texture: Texture.from('myTexId'),
*     }
* }
* ```
*/
var SingleTextureBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Normal;
		this.texture = typeof config.texture === "string" ? GetTextureFromString(config.texture) : config.texture;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			next.texture = this.texture;
			next = next.next;
		}
	}
};
SingleTextureBehavior.type = "textureSingle";
SingleTextureBehavior.editorConfig = null;
/**
* A Movement behavior that uses an interpolated or stepped list of values for a particles speed at any given moment.
* Movement direction is controlled by the particle's starting rotation.
*
* Example config:
* ```javascript
* {
*     type: 'moveSpeed',
*     config: {
*          speed: {
*              list: [{value: 10, time: 0}, {value: 100, time: 0.25}, {value: 0, time: 1}],
*          },
*          minMult: 0.8
*     }
* }
* ```
*/
var SpeedBehavior = class {
	constructor(config) {
		var _a;
		this.order = BehaviorOrder.Late;
		this.list = new PropertyList(false);
		this.list.reset(PropertyNode.createList(config.speed));
		this.minMult = (_a = config.minMult) !== null && _a !== void 0 ? _a : 1;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			const mult = Math.random() * (1 - this.minMult) + this.minMult;
			next.config.speedMult = mult;
			if (!next.config.velocity) next.config.velocity = new Point(this.list.first.value * mult, 0);
			else next.config.velocity.set(this.list.first.value * mult, 0);
			rotatePoint(next.rotation, next.config.velocity);
			next = next.next;
		}
	}
	updateParticle(particle, deltaSec) {
		const speed = this.list.interpolate(particle.agePercent) * particle.config.speedMult;
		const vel = particle.config.velocity;
		normalize(vel);
		scaleBy(vel, speed);
		particle.x += vel.x * deltaSec;
		particle.y += vel.y * deltaSec;
	}
};
SpeedBehavior.type = "moveSpeed";
SpeedBehavior.editorConfig = null;
/**
* A Movement behavior that uses a randomly picked constant speed throughout a particle's lifetime.
* Movement direction is controlled by the particle's starting rotation.
*
* Example config:
* ```javascript
* {
*     type: 'moveSpeedStatic',
*     config: {
*          min: 100,
*          max: 150
*     }
* }
* ```
*/
var StaticSpeedBehavior = class {
	constructor(config) {
		this.order = BehaviorOrder.Late;
		this.min = config.min;
		this.max = config.max;
	}
	initParticles(first) {
		let next = first;
		while (next) {
			const speed = Math.random() * (this.max - this.min) + this.min;
			if (!next.config.velocity) next.config.velocity = new Point(speed, 0);
			else next.config.velocity.set(speed, 0);
			rotatePoint(next.rotation, next.config.velocity);
			next = next.next;
		}
	}
	updateParticle(particle, deltaSec) {
		const velocity = particle.config.velocity;
		particle.x += velocity.x * deltaSec;
		particle.y += velocity.y * deltaSec;
	}
};
StaticSpeedBehavior.type = "moveSpeedStatic";
StaticSpeedBehavior.editorConfig = null;
Emitter.registerBehavior(AccelerationBehavior);
Emitter.registerBehavior(AlphaBehavior);
Emitter.registerBehavior(StaticAlphaBehavior);
Emitter.registerBehavior(RandomAnimatedTextureBehavior);
Emitter.registerBehavior(SingleAnimatedTextureBehavior);
Emitter.registerBehavior(BlendModeBehavior);
Emitter.registerBehavior(BurstSpawnBehavior);
Emitter.registerBehavior(ColorBehavior);
Emitter.registerBehavior(StaticColorBehavior);
Emitter.registerBehavior(OrderedTextureBehavior);
Emitter.registerBehavior(PathBehavior);
Emitter.registerBehavior(PointSpawnBehavior);
Emitter.registerBehavior(RandomTextureBehavior);
Emitter.registerBehavior(RotationBehavior);
Emitter.registerBehavior(StaticRotationBehavior);
Emitter.registerBehavior(NoRotationBehavior);
Emitter.registerBehavior(ScaleBehavior);
Emitter.registerBehavior(StaticScaleBehavior);
Emitter.registerBehavior(ShapeSpawnBehavior);
Emitter.registerBehavior(SingleTextureBehavior);
Emitter.registerBehavior(SpeedBehavior);
Emitter.registerBehavior(StaticSpeedBehavior);
//#endregion
export { Emitter as t };
