import { $ as getResolutionOfUrl, F as Texture, H as Rectangle, K as BaseTexture, X as ExtensionType, Z as extensions, dt as path, mt as settings } from "./@pixi-spine/base+[...].mjs";
import { n as LoaderParserPriority, r as copySearchParams } from "./pixi__assets.mjs";
//#region node_modules/@pixi/spritesheet/lib/Spritesheet.mjs
var _Spritesheet = class _Spritesheet2 {
	/** @ignore */
	constructor(optionsOrTexture, arg1, arg2) {
		this.linkedSheets = [], (optionsOrTexture instanceof BaseTexture || optionsOrTexture instanceof Texture) && (optionsOrTexture = {
			texture: optionsOrTexture,
			data: arg1,
			resolutionFilename: arg2
		});
		const { texture, data, resolutionFilename = null, cachePrefix = "" } = optionsOrTexture;
		this.cachePrefix = cachePrefix, this._texture = texture instanceof Texture ? texture : null, this.baseTexture = texture instanceof BaseTexture ? texture : this._texture.baseTexture, this.textures = {}, this.animations = {}, this.data = data;
		const resource = this.baseTexture.resource;
		this.resolution = this._updateResolution(resolutionFilename || (resource ? resource.url : null)), this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
	}
	/**
	* Generate the resolution from the filename or fallback
	* to the meta.scale field of the JSON data.
	* @param resolutionFilename - The filename to use for resolving
	*        the default resolution.
	* @returns Resolution to use for spritesheet.
	*/
	_updateResolution(resolutionFilename = null) {
		const { scale } = this.data.meta;
		let resolution = getResolutionOfUrl(resolutionFilename, null);
		return resolution === null && (resolution = typeof scale == "number" ? scale : parseFloat(scale ?? "1")), resolution !== 1 && this.baseTexture.setResolution(resolution), resolution;
	}
	/**
	* Parser spritesheet from loaded data. This is done asynchronously
	* to prevent creating too many Texture within a single process.
	* @method PIXI.Spritesheet#parse
	*/
	parse() {
		return new Promise((resolve) => {
			this._callback = resolve, this._batchIndex = 0, this._frameKeys.length <= _Spritesheet2.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
		});
	}
	/**
	* Process a batch of frames
	* @param initialFrameIndex - The index of frame to start.
	*/
	_processFrames(initialFrameIndex) {
		let frameIndex = initialFrameIndex;
		const maxFrames = _Spritesheet2.BATCH_SIZE;
		for (; frameIndex - initialFrameIndex < maxFrames && frameIndex < this._frameKeys.length;) {
			const i = this._frameKeys[frameIndex], data = this._frames[i], rect = data.frame;
			if (rect) {
				let frame = null, trim = null;
				const sourceSize = data.trimmed !== !1 && data.sourceSize ? data.sourceSize : data.frame, orig = new Rectangle(0, 0, Math.floor(sourceSize.w) / this.resolution, Math.floor(sourceSize.h) / this.resolution);
				data.rotated ? frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.h) / this.resolution, Math.floor(rect.w) / this.resolution) : frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution), data.trimmed !== !1 && data.spriteSourceSize && (trim = new Rectangle(Math.floor(data.spriteSourceSize.x) / this.resolution, Math.floor(data.spriteSourceSize.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution)), this.textures[i] = new Texture(this.baseTexture, frame, orig, trim, data.rotated ? 2 : 0, data.anchor, data.borders), Texture.addToCache(this.textures[i], this.cachePrefix + i.toString());
			}
			frameIndex++;
		}
	}
	/** Parse animations config. */
	_processAnimations() {
		const animations = this.data.animations || {};
		for (const animName in animations) {
			this.animations[animName] = [];
			for (let i = 0; i < animations[animName].length; i++) {
				const frameName = animations[animName][i];
				this.animations[animName].push(this.textures[frameName]);
			}
		}
	}
	/** The parse has completed. */
	_parseComplete() {
		const callback = this._callback;
		this._callback = null, this._batchIndex = 0, callback.call(this, this.textures);
	}
	/** Begin the next batch of textures. */
	_nextBatch() {
		this._processFrames(this._batchIndex * _Spritesheet2.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
			this._batchIndex * _Spritesheet2.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
		}, 0);
	}
	/**
	* Destroy Spritesheet and don't use after this.
	* @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
	*/
	destroy(destroyBase = !1) {
		for (const i in this.textures) this.textures[i].destroy();
		this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, destroyBase && (this._texture?.destroy(), this.baseTexture.destroy()), this._texture = null, this.baseTexture = null, this.linkedSheets = [];
	}
};
_Spritesheet.BATCH_SIZE = 1e3;
var Spritesheet = _Spritesheet;
//#endregion
//#region node_modules/@pixi/spritesheet/lib/spritesheetAsset.mjs
var validImages = [
	"jpg",
	"png",
	"jpeg",
	"avif",
	"webp",
	"s3tc",
	"s3tc_sRGB",
	"etc",
	"etc1",
	"pvrtc",
	"atc",
	"astc",
	"bptc"
];
function getCacheableAssets(keys, asset, ignoreMultiPack) {
	const out = {};
	if (keys.forEach((key) => {
		out[key] = asset;
	}), Object.keys(asset.textures).forEach((key) => {
		out[`${asset.cachePrefix}${key}`] = asset.textures[key];
	}), !ignoreMultiPack) {
		const basePath = path.dirname(keys[0]);
		asset.linkedSheets.forEach((item, i) => {
			Object.assign(out, getCacheableAssets([`${basePath}/${asset.data.meta.related_multi_packs[i]}`], item, !0));
		});
	}
	return out;
}
var spritesheetAsset = {
	extension: ExtensionType.Asset,
	/** Handle the caching of the related Spritesheet Textures */
	cache: {
		test: (asset) => asset instanceof Spritesheet,
		getCacheableAssets: (keys, asset) => getCacheableAssets(keys, asset, !1)
	},
	/** Resolve the the resolution of the asset. */
	resolver: {
		test: (value) => {
			const split = value.split("?")[0].split("."), extension = split.pop(), format = split.pop();
			return extension === "json" && validImages.includes(format);
		},
		parse: (value) => {
			const split = value.split(".");
			return {
				resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
				format: split[split.length - 2],
				src: value
			};
		}
	},
	/**
	* Loader plugin that parses sprite sheets!
	* once the JSON has been loaded this checks to see if the JSON is spritesheet data.
	* If it is, we load the spritesheets image and parse the data into PIXI.Spritesheet
	* All textures in the sprite sheet are then added to the cache
	* @ignore
	*/
	loader: {
		name: "spritesheetLoader",
		extension: {
			type: ExtensionType.LoadParser,
			priority: LoaderParserPriority.Normal
		},
		async testParse(asset, options) {
			return path.extname(options.src).toLowerCase() === ".json" && !!asset.frames;
		},
		async parse(asset, options, loader) {
			const { texture: imageTexture, imageFilename, cachePrefix } = options?.data ?? {};
			let basePath = path.dirname(options.src);
			basePath && basePath.lastIndexOf("/") !== basePath.length - 1 && (basePath += "/");
			let texture;
			if (imageTexture && imageTexture.baseTexture) texture = imageTexture;
			else {
				const imagePath = copySearchParams(basePath + (imageFilename ?? asset.meta.image), options.src);
				texture = (await loader.load([imagePath]))[imagePath];
			}
			const spritesheet = new Spritesheet({
				texture: texture.baseTexture,
				data: asset,
				resolutionFilename: options.src,
				cachePrefix
			});
			await spritesheet.parse();
			const multiPacks = asset?.meta?.related_multi_packs;
			if (Array.isArray(multiPacks)) {
				const promises = [];
				for (const item of multiPacks) {
					if (typeof item != "string") continue;
					let itemUrl = basePath + item;
					options.data?.ignoreMultiPack || (itemUrl = copySearchParams(itemUrl, options.src), promises.push(loader.load({
						src: itemUrl,
						data: { ignoreMultiPack: !0 }
					})));
				}
				const res = await Promise.all(promises);
				spritesheet.linkedSheets = res, res.forEach((item) => {
					item.linkedSheets = [spritesheet].concat(spritesheet.linkedSheets.filter((sp) => sp !== item));
				});
			}
			return spritesheet;
		},
		unload(spritesheet) {
			spritesheet.destroy(!0);
		}
	}
};
extensions.add(spritesheetAsset);
//#endregion
export {};
