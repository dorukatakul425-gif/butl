import { C as Sprite, F as Texture, H as Rectangle, ct as rgb2hex, dt as path, mt as settings, rt as sign, st as hex2string } from "./@pixi-spine/base+[...].mjs";
import { n as TextStyle } from "./pixi__prepare+pixi__text.mjs";
//#region ../../opt/butl/node_modules/@pixi/text-html/lib/HTMLTextStyle.mjs
var _HTMLTextStyle = class _HTMLTextStyle2 extends TextStyle {
	constructor() {
		super(...arguments), this._fonts = [], this._overrides = [], this._stylesheet = "", this.fontsDirty = !1;
	}
	/**
	* Convert a TextStyle to HTMLTextStyle
	* @param originalStyle
	* @example
	* import {TextStyle } from 'pixi.js';
	* import {HTMLTextStyle} from '@pixi/text-html';
	* const style = new TextStyle();
	* const htmlStyle = HTMLTextStyle.from(style);
	*/
	static from(originalStyle) {
		return new _HTMLTextStyle2(Object.keys(_HTMLTextStyle2.defaultOptions).reduce((obj, prop) => ({
			...obj,
			[prop]: originalStyle[prop]
		}), {}));
	}
	/** Clear the current font */
	cleanFonts() {
		this._fonts.length > 0 && (this._fonts.forEach((font) => {
			URL.revokeObjectURL(font.src), font.refs--, font.refs === 0 && (font.fontFace && document.fonts.delete(font.fontFace), delete _HTMLTextStyle2.availableFonts[font.originalUrl]);
		}), this.fontFamily = "Arial", this._fonts.length = 0, this.styleID++, this.fontsDirty = !0);
	}
	/**
	* Because of how HTMLText renders, fonts need to be imported
	* @param url
	* @param options
	*/
	loadFont(url, options = {}) {
		const { availableFonts } = _HTMLTextStyle2;
		if (availableFonts[url]) {
			const font = availableFonts[url];
			return this._fonts.push(font), font.refs++, this.styleID++, this.fontsDirty = !0, Promise.resolve();
		}
		return settings.ADAPTER.fetch(url).then((response) => response.blob()).then(async (blob) => new Promise((resolve, reject) => {
			const src = URL.createObjectURL(blob), reader = new FileReader();
			reader.onload = () => resolve([src, reader.result]), reader.onerror = reject, reader.readAsDataURL(blob);
		})).then(async ([src, dataSrc]) => {
			const font = Object.assign({
				family: path.basename(url, path.extname(url)),
				weight: "normal",
				style: "normal",
				display: "auto",
				src,
				dataSrc,
				refs: 1,
				originalUrl: url,
				fontFace: null
			}, options);
			availableFonts[url] = font, this._fonts.push(font), this.styleID++;
			const fontFace = new FontFace(font.family, `url(${font.src})`, {
				weight: font.weight,
				style: font.style,
				display: font.display
			});
			font.fontFace = fontFace, await fontFace.load(), document.fonts.add(fontFace), await document.fonts.ready, this.styleID++, this.fontsDirty = !0;
		});
	}
	/**
	* Add a style override, this can be any CSS property
	* it will override any built-in style. This is the
	* property and the value as a string (e.g., `color: red`).
	* This will override any other internal style.
	* @param {string} value - CSS style(s) to add.
	* @example
	* style.addOverride('background-color: red');
	*/
	addOverride(...value) {
		const toAdd = value.filter((v) => !this._overrides.includes(v));
		toAdd.length > 0 && (this._overrides.push(...toAdd), this.styleID++);
	}
	/**
	* Remove any overrides that match the value.
	* @param {string} value - CSS style to remove.
	* @example
	* style.removeOverride('background-color: red');
	*/
	removeOverride(...value) {
		const toRemove = value.filter((v) => this._overrides.includes(v));
		toRemove.length > 0 && (this._overrides = this._overrides.filter((v) => !toRemove.includes(v)), this.styleID++);
	}
	/**
	* Internally converts all of the style properties into CSS equivalents.
	* @param scale
	* @returns The CSS style string, for setting `style` property of root HTMLElement.
	*/
	toCSS(scale) {
		return [
			`transform: scale(${scale})`,
			"transform-origin: top left",
			"display: inline-block",
			`color: ${this.normalizeColor(this.fill)}`,
			`font-size: ${this.fontSize}px`,
			`font-family: ${this.fontFamily}`,
			`font-weight: ${this.fontWeight}`,
			`font-style: ${this.fontStyle}`,
			`font-variant: ${this.fontVariant}`,
			`letter-spacing: ${this.letterSpacing}px`,
			`text-align: ${this.align}`,
			`padding: ${this.padding}px`,
			`white-space: ${this.whiteSpace}`,
			...this.lineHeight ? [`line-height: ${this.lineHeight}px`] : [],
			...this.wordWrap ? [`word-wrap: ${this.breakWords ? "break-all" : "break-word"}`, `max-width: ${this.wordWrapWidth}px`] : [],
			...this.strokeThickness ? [
				`-webkit-text-stroke-width: ${this.strokeThickness}px`,
				`-webkit-text-stroke-color: ${this.normalizeColor(this.stroke)}`,
				`text-stroke-width: ${this.strokeThickness}px`,
				`text-stroke-color: ${this.normalizeColor(this.stroke)}`,
				"paint-order: stroke"
			] : [],
			...this.dropShadow ? [this.dropShadowToCSS()] : [],
			...this._overrides
		].join(";");
	}
	/** Get the font CSS styles from the loaded font, If available. */
	toGlobalCSS() {
		return this._fonts.reduce((result, font) => `${result}
            @font-face {
                font-family: "${font.family}";
                src: url('${font.dataSrc}');
                font-weight: ${font.weight};
                font-style: ${font.style};
                font-display: ${font.display};
            }`, this._stylesheet);
	}
	/** Internal stylesheet contents, useful for creating rules for rendering */
	get stylesheet() {
		return this._stylesheet;
	}
	set stylesheet(value) {
		this._stylesheet !== value && (this._stylesheet = value, this.styleID++);
	}
	/**
	* Convert numerical colors into hex-strings
	* @param color
	*/
	normalizeColor(color) {
		return Array.isArray(color) && (color = rgb2hex(color)), typeof color == "number" ? hex2string(color) : color;
	}
	/** Convert the internal drop-shadow settings to CSS text-shadow */
	dropShadowToCSS() {
		let color = this.normalizeColor(this.dropShadowColor);
		const alpha = this.dropShadowAlpha, x = Math.round(Math.cos(this.dropShadowAngle) * this.dropShadowDistance), y = Math.round(Math.sin(this.dropShadowAngle) * this.dropShadowDistance);
		color.startsWith("#") && alpha < 1 && (color += (alpha * 255 | 0).toString(16).padStart(2, "0"));
		const position = `${x}px ${y}px`;
		return this.dropShadowBlur > 0 ? `text-shadow: ${position} ${this.dropShadowBlur}px ${color}` : `text-shadow: ${position} ${color}`;
	}
	/** Resets all properties to the defaults specified in TextStyle.prototype._default */
	reset() {
		Object.assign(this, _HTMLTextStyle2.defaultOptions);
	}
	/**
	* Called after the image is loaded but before drawing to the canvas.
	* Mostly used to handle Safari's font loading bug.
	* @ignore
	*/
	onBeforeDraw() {
		const { fontsDirty: prevFontsDirty } = this;
		return this.fontsDirty = !1, this.isSafari && this._fonts.length > 0 && prevFontsDirty ? new Promise((resolve) => setTimeout(resolve, 100)) : Promise.resolve();
	}
	/**
	* Proving that Safari is the new IE
	* @ignore
	*/
	get isSafari() {
		const { userAgent } = settings.ADAPTER.getNavigator();
		return /^((?!chrome|android).)*safari/i.test(userAgent);
	}
	set fillGradientStops(_value) {
		console.warn("[HTMLTextStyle] fillGradientStops is not supported by HTMLText");
	}
	get fillGradientStops() {
		return super.fillGradientStops;
	}
	set fillGradientType(_value) {
		console.warn("[HTMLTextStyle] fillGradientType is not supported by HTMLText");
	}
	get fillGradientType() {
		return super.fillGradientType;
	}
	set miterLimit(_value) {
		console.warn("[HTMLTextStyle] miterLimit is not supported by HTMLText");
	}
	get miterLimit() {
		return super.miterLimit;
	}
	set trim(_value) {
		console.warn("[HTMLTextStyle] trim is not supported by HTMLText");
	}
	get trim() {
		return super.trim;
	}
	set textBaseline(_value) {
		console.warn("[HTMLTextStyle] textBaseline is not supported by HTMLText");
	}
	get textBaseline() {
		return super.textBaseline;
	}
	set leading(_value) {
		console.warn("[HTMLTextStyle] leading is not supported by HTMLText");
	}
	get leading() {
		return super.leading;
	}
	set lineJoin(_value) {
		console.warn("[HTMLTextStyle] lineJoin is not supported by HTMLText");
	}
	get lineJoin() {
		return super.lineJoin;
	}
};
_HTMLTextStyle.availableFonts = {}, _HTMLTextStyle.defaultOptions = {
	/** Align */
	align: "left",
	/** Break words */
	breakWords: !1,
	/** Drop shadow */
	dropShadow: !1,
	/** Drop shadow alpha */
	dropShadowAlpha: 1,
	/**
	* Drop shadow angle
	* @type {number}
	* @default Math.PI / 6
	*/
	dropShadowAngle: Math.PI / 6,
	/** Drop shadow blur */
	dropShadowBlur: 0,
	/** Drop shadow color */
	dropShadowColor: "black",
	/** Drop shadow distance */
	dropShadowDistance: 5,
	/** Fill */
	fill: "black",
	/** Font family */
	fontFamily: "Arial",
	/** Font size */
	fontSize: 26,
	/** Font style */
	fontStyle: "normal",
	/** Font variant */
	fontVariant: "normal",
	/** Font weight */
	fontWeight: "normal",
	/** Letter spacing */
	letterSpacing: 0,
	/** Line height */
	lineHeight: 0,
	/** Padding */
	padding: 0,
	/** Stroke */
	stroke: "black",
	/** Stroke thickness */
	strokeThickness: 0,
	/** White space */
	whiteSpace: "normal",
	/** Word wrap */
	wordWrap: !1,
	/** Word wrap width */
	wordWrapWidth: 100
};
var HTMLTextStyle = _HTMLTextStyle;
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-html/lib/HTMLText.mjs
var _HTMLText = class _HTMLText2 extends Sprite {
	/**
	* @param {string} [text] - Text contents
	* @param {PIXI.HTMLTextStyle|PIXI.TextStyle|PIXI.ITextStyle} [style] - Style setting to use.
	*        Strongly recommend using an HTMLTextStyle object. Providing a PIXI.TextStyle
	*        will convert the TextStyle to an HTMLTextStyle and will no longer be linked.
	*/
	constructor(text = "", style = {}) {
		super(Texture.EMPTY), this._text = null, this._style = null, this._autoResolution = !0, this.localStyleID = -1, this.dirty = !1, this._updateID = 0, this.ownsStyle = !1;
		const image = new Image(), texture = Texture.from(image, {
			scaleMode: settings.SCALE_MODE,
			resourceOptions: { autoLoad: !1 }
		});
		texture.orig = new Rectangle(), texture.trim = new Rectangle(), this.texture = texture;
		const nssvg = "http://www.w3.org/2000/svg", nsxhtml = "http://www.w3.org/1999/xhtml", svgRoot = document.createElementNS(nssvg, "svg"), foreignObject = document.createElementNS(nssvg, "foreignObject"), domElement = document.createElementNS(nsxhtml, "div"), styleElement = document.createElementNS(nsxhtml, "style");
		foreignObject.setAttribute("width", "10000"), foreignObject.setAttribute("height", "10000"), foreignObject.style.overflow = "hidden", svgRoot.appendChild(foreignObject), this.maxWidth = _HTMLText2.defaultMaxWidth, this.maxHeight = _HTMLText2.defaultMaxHeight, this._domElement = domElement, this._styleElement = styleElement, this._svgRoot = svgRoot, this._foreignObject = foreignObject, this._foreignObject.appendChild(styleElement), this._foreignObject.appendChild(domElement), this._image = image, this._loadImage = new Image(), this._autoResolution = _HTMLText2.defaultAutoResolution, this._resolution = _HTMLText2.defaultResolution ?? settings.RESOLUTION, this.text = text, this.style = style;
	}
	/**
	* Calculate the size of the output text without actually drawing it.
	* This includes the `padding` in the `style` object.
	* This can be used as a fast-pass to do things like text-fitting.
	* @param {object} [overrides] - Overrides for the text, style, and resolution.
	* @param {string} [overrides.text] - The text to measure, if not specified, the current text is used.
	* @param {PIXI.HTMLTextStyle} [overrides.style] - The style to measure, if not specified, the current style is used.
	* @param {number} [overrides.resolution] - The resolution to measure, if not specified, the current resolution is used.
	* @returns {PIXI.ISize} Width and height of the measured text.
	*/
	measureText(overrides) {
		const { text, style, resolution } = Object.assign({
			text: this._text,
			style: this._style,
			resolution: this._resolution
		}, overrides);
		Object.assign(this._domElement, {
			innerHTML: text,
			style: style.toCSS(resolution)
		}), this._styleElement.textContent = style.toGlobalCSS(), document.body.appendChild(this._svgRoot);
		const contentBounds = this._domElement.getBoundingClientRect();
		this._svgRoot.remove();
		const { width, height } = contentBounds;
		(width > this.maxWidth || height > this.maxHeight) && console.warn("[HTMLText] Large expanse of text, increase HTMLText.maxWidth or HTMLText.maxHeight property.");
		const contentWidth = Math.min(this.maxWidth, Math.ceil(width)), contentHeight = Math.min(this.maxHeight, Math.ceil(height));
		return this._svgRoot.setAttribute("width", contentWidth.toString()), this._svgRoot.setAttribute("height", contentHeight.toString()), text !== this._text && (this._domElement.innerHTML = this._text), style !== this._style && (Object.assign(this._domElement, { style: this._style?.toCSS(resolution) }), this._styleElement.textContent = this._style?.toGlobalCSS()), {
			width: contentWidth + style.padding * 2,
			height: contentHeight + style.padding * 2
		};
	}
	/**
	* Manually refresh the text.
	* @public
	* @param {boolean} respectDirty - Whether to abort updating the
	*        text if the Text isn't dirty and the function is called.
	*/
	async updateText(respectDirty = !0) {
		const { style, _image: image, _loadImage: loadImage } = this;
		if (this.localStyleID !== style.styleID && (this.dirty = !0, this.localStyleID = style.styleID), !this.dirty && respectDirty) return;
		const { width, height } = this.measureText();
		image.width = loadImage.width = Math.ceil(Math.max(1, width)), image.height = loadImage.height = Math.ceil(Math.max(1, height)), this._updateID++;
		const updateID = this._updateID;
		await new Promise((resolve) => {
			loadImage.onload = async () => {
				if (updateID < this._updateID) {
					resolve();
					return;
				}
				await style.onBeforeDraw(), image.src = loadImage.src, loadImage.onload = null, loadImage.src = "", this.updateTexture(), resolve();
			};
			const svgURL = new XMLSerializer().serializeToString(this._svgRoot);
			loadImage.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(svgURL)}`;
		});
	}
	/** The raw image element that is rendered under-the-hood. */
	get source() {
		return this._image;
	}
	/**
	* Update the texture resource.
	* @private
	*/
	updateTexture() {
		const { style, texture, _image: image, resolution } = this, { padding } = style, { baseTexture } = texture;
		texture.trim.width = texture._frame.width = image.width / resolution, texture.trim.height = texture._frame.height = image.height / resolution, texture.trim.x = -padding, texture.trim.y = -padding, texture.orig.width = texture._frame.width - padding * 2, texture.orig.height = texture._frame.height - padding * 2, this._onTextureUpdate(), baseTexture.setRealSize(image.width, image.height, resolution), this.dirty = !1;
	}
	/**
	* Renders the object using the WebGL renderer
	* @param {PIXI.Renderer} renderer - The renderer
	* @private
	*/
	_render(renderer) {
		this._autoResolution && this._resolution !== renderer.resolution && (this._resolution = renderer.resolution, this.dirty = !0), this.updateText(!0), super._render(renderer);
	}
	/**
	* Renders the object using the Canvas Renderer.
	* @private
	* @param {PIXI.CanvasRenderer} renderer - The renderer
	*/
	_renderCanvas(renderer) {
		this._autoResolution && this._resolution !== renderer.resolution && (this._resolution = renderer.resolution, this.dirty = !0), this.updateText(!0), super._renderCanvas(renderer);
	}
	/**
	* Get the local bounds.
	* @param {PIXI.Rectangle} rect - Input rectangle.
	* @returns {PIXI.Rectangle} Local bounds
	*/
	getLocalBounds(rect) {
		return this.updateText(!0), super.getLocalBounds(rect);
	}
	_calculateBounds() {
		this.updateText(!0), this.calculateVertices(), this._bounds.addQuad(this.vertexData);
	}
	/**
	* Handle dirty style changes
	* @private
	*/
	_onStyleChange() {
		this.dirty = !0;
	}
	/**
	* Destroy this Text object. Don't use after calling.
	* @param {boolean|object} options - Same as Sprite destroy options.
	*/
	destroy(options) {
		typeof options == "boolean" && (options = { children: options }), options = Object.assign({}, _HTMLText2.defaultDestroyOptions, options), super.destroy(options);
		const forceClear = null;
		this.ownsStyle && this._style?.cleanFonts(), this._style = forceClear, this._svgRoot?.remove(), this._svgRoot = forceClear, this._domElement?.remove(), this._domElement = forceClear, this._foreignObject?.remove(), this._foreignObject = forceClear, this._styleElement?.remove(), this._styleElement = forceClear, this._loadImage.src = "", this._loadImage.onload = null, this._loadImage = forceClear, this._image.src = "", this._image = forceClear;
	}
	/**
	* Get the width in pixels.
	* @member {number}
	*/
	get width() {
		return this.updateText(!0), Math.abs(this.scale.x) * this._image.width / this.resolution;
	}
	set width(value) {
		this.updateText(!0);
		const s = sign(this.scale.x) || 1;
		this.scale.x = s * value / this._image.width / this.resolution, this._width = value;
	}
	/**
	* Get the height in pixels.
	* @member {number}
	*/
	get height() {
		return this.updateText(!0), Math.abs(this.scale.y) * this._image.height / this.resolution;
	}
	set height(value) {
		this.updateText(!0);
		const s = sign(this.scale.y) || 1;
		this.scale.y = s * value / this._image.height / this.resolution, this._height = value;
	}
	/** The base style to render with text. */
	get style() {
		return this._style;
	}
	set style(style) {
		this._style !== style && (style = style || {}, style instanceof HTMLTextStyle ? (this.ownsStyle = !1, this._style = style) : style instanceof TextStyle ? (console.warn("[HTMLText] Cloning TextStyle, if this is not what you want, use HTMLTextStyle"), this.ownsStyle = !0, this._style = HTMLTextStyle.from(style)) : (this.ownsStyle = !0, this._style = new HTMLTextStyle(style)), this.localStyleID = -1, this.dirty = !0);
	}
	/**
	* Contents of text. This can be HTML text and include tags.
	* @example
	* const text = new HTMLText('This is a <em>styled</em> text!');
	* @member {string}
	*/
	get text() {
		return this._text;
	}
	set text(text) {
		text = String(text === "" || text === null || text === void 0 ? " " : text), text = this.sanitiseText(text), this._text !== text && (this._text = text, this.dirty = !0);
	}
	/**
	* The resolution / device pixel ratio of the canvas.
	* This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
	* @member {number}
	* @default 1
	*/
	get resolution() {
		return this._resolution;
	}
	set resolution(value) {
		this._autoResolution = !1, this._resolution !== value && (this._resolution = value, this.dirty = !0);
	}
	/**
	* Sanitise text - replace `<br>` with `<br/>`, `&nbsp;` with `&#160;`
	* @param text
	* @see https://www.sitepoint.com/community/t/xhtml-1-0-transitional-xml-parsing-error-entity-nbsp-not-defined/3392/3
	*/
	sanitiseText(text) {
		return text.replace(/<br>/gi, "<br/>").replace(/<hr>/gi, "<hr/>").replace(/&nbsp;/gi, "&#160;");
	}
};
_HTMLText.defaultDestroyOptions = {
	texture: !0,
	children: !1,
	baseTexture: !0
}, _HTMLText.defaultMaxWidth = 2024, _HTMLText.defaultMaxHeight = 2024, _HTMLText.defaultAutoResolution = !0;
//#endregion
export {};
