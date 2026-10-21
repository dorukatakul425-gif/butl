import { C as Sprite, F as Texture, H as Rectangle, K as BaseTexture, M as UPDATE_PRIORITY, S as Graphics, X as ExtensionType, Z as extensions, et as trimCanvas, ft as deprecation, j as Ticker, lt as Color, mt as settings, rt as sign, w as Container } from "./@pixi-spine/base+[...].mjs";
//#region node_modules/@pixi/text/lib/const.mjs
var TEXT_GRADIENT = /* @__PURE__ */ ((TEXT_GRADIENT2) => (TEXT_GRADIENT2[TEXT_GRADIENT2.LINEAR_VERTICAL = 0] = "LINEAR_VERTICAL", TEXT_GRADIENT2[TEXT_GRADIENT2.LINEAR_HORIZONTAL = 1] = "LINEAR_HORIZONTAL", TEXT_GRADIENT2))(TEXT_GRADIENT || {});
//#endregion
//#region node_modules/@pixi/text/lib/TextMetrics.mjs
var contextSettings = { willReadFrequently: !0 };
var _TextMetrics = class _TextMetrics2 {
	/**
	* Checking that we can use modern canvas 2D API.
	*
	* Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
	* @see PIXI.TextMetrics.experimentalLetterSpacing
	* @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing
	* @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
	*/
	static get experimentalLetterSpacingSupported() {
		let result = _TextMetrics2._experimentalLetterSpacingSupported;
		if (result !== void 0) {
			const proto = settings.ADAPTER.getCanvasRenderingContext2D().prototype;
			result = _TextMetrics2._experimentalLetterSpacingSupported = "letterSpacing" in proto || "textLetterSpacing" in proto;
		}
		return result;
	}
	/**
	* @param text - the text that was measured
	* @param style - the style that was measured
	* @param width - the measured width of the text
	* @param height - the measured height of the text
	* @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
	* @param lineWidths - an array of the line widths for each line matched to `lines`
	* @param lineHeight - the measured line height for this style
	* @param maxLineWidth - the maximum line width for all measured lines
	* @param {PIXI.IFontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
	*/
	constructor(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
		this.text = text, this.style = style, this.width = width, this.height = height, this.lines = lines, this.lineWidths = lineWidths, this.lineHeight = lineHeight, this.maxLineWidth = maxLineWidth, this.fontProperties = fontProperties;
	}
	/**
	* Measures the supplied string of text and returns a Rectangle.
	* @param text - The text to measure.
	* @param style - The text style to use for measuring
	* @param wordWrap - Override for if word-wrap should be applied to the text.
	* @param canvas - optional specification of the canvas to use for measuring.
	* @returns Measured width and height of the text.
	*/
	static measureText(text, style, wordWrap, canvas = _TextMetrics2._canvas) {
		wordWrap = wordWrap ?? style.wordWrap;
		const font = style.toFontString(), fontProperties = _TextMetrics2.measureFont(font);
		fontProperties.fontSize === 0 && (fontProperties.fontSize = style.fontSize, fontProperties.ascent = style.fontSize);
		const context = canvas.getContext("2d", contextSettings);
		context.font = font;
		const lines = (wordWrap ? _TextMetrics2.wordWrap(text, style, canvas) : text).split(/(?:\r\n|\r|\n)/), lineWidths = new Array(lines.length);
		let maxLineWidth = 0;
		for (let i = 0; i < lines.length; i++) {
			const lineWidth = _TextMetrics2._measureText(lines[i], style.letterSpacing, context);
			lineWidths[i] = lineWidth, maxLineWidth = Math.max(maxLineWidth, lineWidth);
		}
		let width = maxLineWidth + style.strokeThickness;
		style.dropShadow && (width += style.dropShadowDistance);
		const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
		let height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness * 2) + style.leading + (lines.length - 1) * (lineHeight + style.leading);
		return style.dropShadow && (height += style.dropShadowDistance), new _TextMetrics2(text, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
	}
	static _measureText(text, letterSpacing, context) {
		let useExperimentalLetterSpacing = !1;
		_TextMetrics2.experimentalLetterSpacingSupported && (_TextMetrics2.experimentalLetterSpacing ? (context.letterSpacing = `${letterSpacing}px`, context.textLetterSpacing = `${letterSpacing}px`, useExperimentalLetterSpacing = !0) : (context.letterSpacing = "0px", context.textLetterSpacing = "0px"));
		let width = context.measureText(text).width;
		return width > 0 && (useExperimentalLetterSpacing ? width -= letterSpacing : width += (_TextMetrics2.graphemeSegmenter(text).length - 1) * letterSpacing), width;
	}
	/**
	* Applies newlines to a string to have it optimally fit into the horizontal
	* bounds set by the Text object's wordWrapWidth property.
	* @param text - String to apply word wrapping to
	* @param style - the style to use when wrapping
	* @param canvas - optional specification of the canvas to use for measuring.
	* @returns New string with new lines applied where required
	*/
	static wordWrap(text, style, canvas = _TextMetrics2._canvas) {
		const context = canvas.getContext("2d", contextSettings);
		let width = 0, line = "", lines = "";
		const cache = /* @__PURE__ */ Object.create(null), { letterSpacing, whiteSpace } = style, collapseSpaces = _TextMetrics2.collapseSpaces(whiteSpace), collapseNewlines = _TextMetrics2.collapseNewlines(whiteSpace);
		let canPrependSpaces = !collapseSpaces;
		const wordWrapWidth = style.wordWrapWidth + letterSpacing, tokens = _TextMetrics2.tokenize(text);
		for (let i = 0; i < tokens.length; i++) {
			let token = tokens[i];
			if (_TextMetrics2.isNewline(token)) {
				if (!collapseNewlines) {
					lines += _TextMetrics2.addLine(line), canPrependSpaces = !collapseSpaces, line = "", width = 0;
					continue;
				}
				token = " ";
			}
			if (collapseSpaces) {
				const currIsBreakingSpace = _TextMetrics2.isBreakingSpace(token), lastIsBreakingSpace = _TextMetrics2.isBreakingSpace(line[line.length - 1]);
				if (currIsBreakingSpace && lastIsBreakingSpace) continue;
			}
			const tokenWidth = _TextMetrics2.getFromCache(token, letterSpacing, cache, context);
			if (tokenWidth > wordWrapWidth) if (line !== "" && (lines += _TextMetrics2.addLine(line), line = "", width = 0), _TextMetrics2.canBreakWords(token, style.breakWords)) {
				const characters = _TextMetrics2.wordWrapSplit(token);
				for (let j = 0; j < characters.length; j++) {
					let char = characters[j], lastChar = char, k = 1;
					for (; characters[j + k];) {
						const nextChar = characters[j + k];
						if (!_TextMetrics2.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) char += nextChar;
						else break;
						lastChar = nextChar, k++;
					}
					j += k - 1;
					const characterWidth = _TextMetrics2.getFromCache(char, letterSpacing, cache, context);
					characterWidth + width > wordWrapWidth && (lines += _TextMetrics2.addLine(line), canPrependSpaces = !1, line = "", width = 0), line += char, width += characterWidth;
				}
			} else {
				line.length > 0 && (lines += _TextMetrics2.addLine(line), line = "", width = 0);
				const isLastToken = i === tokens.length - 1;
				lines += _TextMetrics2.addLine(token, !isLastToken), canPrependSpaces = !1, line = "", width = 0;
			}
			else tokenWidth + width > wordWrapWidth && (canPrependSpaces = !1, lines += _TextMetrics2.addLine(line), line = "", width = 0), (line.length > 0 || !_TextMetrics2.isBreakingSpace(token) || canPrependSpaces) && (line += token, width += tokenWidth);
		}
		return lines += _TextMetrics2.addLine(line, !1), lines;
	}
	/**
	* Convienience function for logging each line added during the wordWrap method.
	* @param line    - The line of text to add
	* @param newLine - Add new line character to end
	* @returns A formatted line
	*/
	static addLine(line, newLine = !0) {
		return line = _TextMetrics2.trimRight(line), line = newLine ? `${line}
` : line, line;
	}
	/**
	* Gets & sets the widths of calculated characters in a cache object
	* @param key            - The key
	* @param letterSpacing  - The letter spacing
	* @param cache          - The cache
	* @param context        - The canvas context
	* @returns The from cache.
	*/
	static getFromCache(key, letterSpacing, cache, context) {
		let width = cache[key];
		return typeof width != "number" && (width = _TextMetrics2._measureText(key, letterSpacing, context) + letterSpacing, cache[key] = width), width;
	}
	/**
	* Determines whether we should collapse breaking spaces.
	* @param whiteSpace - The TextStyle property whiteSpace
	* @returns Should collapse
	*/
	static collapseSpaces(whiteSpace) {
		return whiteSpace === "normal" || whiteSpace === "pre-line";
	}
	/**
	* Determines whether we should collapse newLine chars.
	* @param whiteSpace - The white space
	* @returns should collapse
	*/
	static collapseNewlines(whiteSpace) {
		return whiteSpace === "normal";
	}
	/**
	* Trims breaking whitespaces from string.
	* @param text - The text
	* @returns Trimmed string
	*/
	static trimRight(text) {
		if (typeof text != "string") return "";
		for (let i = text.length - 1; i >= 0; i--) {
			const char = text[i];
			if (!_TextMetrics2.isBreakingSpace(char)) break;
			text = text.slice(0, -1);
		}
		return text;
	}
	/**
	* Determines if char is a newline.
	* @param char - The character
	* @returns True if newline, False otherwise.
	*/
	static isNewline(char) {
		return typeof char != "string" ? !1 : _TextMetrics2._newlines.includes(char.charCodeAt(0));
	}
	/**
	* Determines if char is a breaking whitespace.
	*
	* It allows one to determine whether char should be a breaking whitespace
	* For example certain characters in CJK langs or numbers.
	* It must return a boolean.
	* @param char - The character
	* @param [_nextChar] - The next character
	* @returns True if whitespace, False otherwise.
	*/
	static isBreakingSpace(char, _nextChar) {
		return typeof char != "string" ? !1 : _TextMetrics2._breakingSpaces.includes(char.charCodeAt(0));
	}
	/**
	* Splits a string into words, breaking-spaces and newLine characters
	* @param text - The text
	* @returns A tokenized array
	*/
	static tokenize(text) {
		const tokens = [];
		let token = "";
		if (typeof text != "string") return tokens;
		for (let i = 0; i < text.length; i++) {
			const char = text[i], nextChar = text[i + 1];
			if (_TextMetrics2.isBreakingSpace(char, nextChar) || _TextMetrics2.isNewline(char)) {
				token !== "" && (tokens.push(token), token = ""), tokens.push(char);
				continue;
			}
			token += char;
		}
		return token !== "" && tokens.push(token), tokens;
	}
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It allows one to customise which words should break
	* Examples are if the token is CJK or numbers.
	* It must return a boolean.
	* @param _token - The token
	* @param breakWords - The style attr break words
	* @returns Whether to break word or not
	*/
	static canBreakWords(_token, breakWords) {
		return breakWords;
	}
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It allows one to determine whether a pair of characters
	* should be broken by newlines
	* For example certain characters in CJK langs or numbers.
	* It must return a boolean.
	* @param _char - The character
	* @param _nextChar - The next character
	* @param _token - The token/word the characters are from
	* @param _index - The index in the token of the char
	* @param _breakWords - The style attr break words
	* @returns whether to break word or not
	*/
	static canBreakChars(_char, _nextChar, _token, _index, _breakWords) {
		return !0;
	}
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It is called when a token (usually a word) has to be split into separate pieces
	* in order to determine the point to break a word.
	* It must return an array of characters.
	* @param token - The token to split
	* @returns The characters of the token
	* @see TextMetrics.graphemeSegmenter
	*/
	static wordWrapSplit(token) {
		return _TextMetrics2.graphemeSegmenter(token);
	}
	/**
	* Calculates the ascent, descent and fontSize of a given font-style
	* @param font - String representing the style of the font
	* @returns Font properties object
	*/
	static measureFont(font) {
		if (_TextMetrics2._fonts[font]) return _TextMetrics2._fonts[font];
		const properties = {
			ascent: 0,
			descent: 0,
			fontSize: 0
		}, canvas = _TextMetrics2._canvas, context = _TextMetrics2._context;
		context.font = font;
		const metricsString = _TextMetrics2.METRICS_STRING + _TextMetrics2.BASELINE_SYMBOL, width = Math.ceil(context.measureText(metricsString).width);
		let baseline = Math.ceil(context.measureText(_TextMetrics2.BASELINE_SYMBOL).width);
		const height = Math.ceil(_TextMetrics2.HEIGHT_MULTIPLIER * baseline);
		if (baseline = baseline * _TextMetrics2.BASELINE_MULTIPLIER | 0, width === 0 || height === 0) return _TextMetrics2._fonts[font] = properties, properties;
		canvas.width = width, canvas.height = height, context.fillStyle = "#f00", context.fillRect(0, 0, width, height), context.font = font, context.textBaseline = "alphabetic", context.fillStyle = "#000", context.fillText(metricsString, 0, baseline);
		const imagedata = context.getImageData(0, 0, width, height).data, pixels = imagedata.length, line = width * 4;
		let i = 0, idx = 0, stop = !1;
		for (i = 0; i < baseline; ++i) {
			for (let j = 0; j < line; j += 4) if (imagedata[idx + j] !== 255) {
				stop = !0;
				break;
			}
			if (!stop) idx += line;
			else break;
		}
		for (properties.ascent = baseline - i, idx = pixels - line, stop = !1, i = height; i > baseline; --i) {
			for (let j = 0; j < line; j += 4) if (imagedata[idx + j] !== 255) {
				stop = !0;
				break;
			}
			if (!stop) idx -= line;
			else break;
		}
		return properties.descent = i - baseline, properties.fontSize = properties.ascent + properties.descent, _TextMetrics2._fonts[font] = properties, properties;
	}
	/**
	* Clear font metrics in metrics cache.
	* @param {string} [font] - font name. If font name not set then clear cache for all fonts.
	*/
	static clearMetrics(font = "") {
		font ? delete _TextMetrics2._fonts[font] : _TextMetrics2._fonts = {};
	}
	/**
	* Cached canvas element for measuring text
	* TODO: this should be private, but isn't because of backward compat, will fix later.
	* @ignore
	*/
	static get _canvas() {
		if (!_TextMetrics2.__canvas) {
			let canvas;
			try {
				const c = new OffscreenCanvas(0, 0);
				if (c.getContext("2d", contextSettings)?.measureText) return _TextMetrics2.__canvas = c, c;
				canvas = settings.ADAPTER.createCanvas();
			} catch {
				canvas = settings.ADAPTER.createCanvas();
			}
			canvas.width = canvas.height = 10, _TextMetrics2.__canvas = canvas;
		}
		return _TextMetrics2.__canvas;
	}
	/**
	* TODO: this should be private, but isn't because of backward compat, will fix later.
	* @ignore
	*/
	static get _context() {
		return _TextMetrics2.__context || (_TextMetrics2.__context = _TextMetrics2._canvas.getContext("2d", contextSettings)), _TextMetrics2.__context;
	}
};
_TextMetrics.METRICS_STRING = "|ÉqÅ", _TextMetrics.BASELINE_SYMBOL = "M", _TextMetrics.BASELINE_MULTIPLIER = 1.4, _TextMetrics.HEIGHT_MULTIPLIER = 2, _TextMetrics.graphemeSegmenter = (() => {
	if (typeof Intl?.Segmenter == "function") {
		const segmenter = new Intl.Segmenter();
		return (s) => [...segmenter.segment(s)].map((x) => x.segment);
	}
	return (s) => [...s];
})(), _TextMetrics.experimentalLetterSpacing = !1, _TextMetrics._fonts = {}, _TextMetrics._newlines = [10, 13], _TextMetrics._breakingSpaces = [
	9,
	32,
	8192,
	8193,
	8194,
	8195,
	8196,
	8197,
	8198,
	8200,
	8201,
	8202,
	8287,
	12288
];
var TextMetrics = _TextMetrics;
//#endregion
//#region node_modules/@pixi/text/lib/TextStyle.mjs
var genericFontFamilies = [
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui"
];
var _TextStyle = class _TextStyle2 {
	/**
	* @param style - TextStyle properties to be set on the text. See {@link PIXI.TextStyle.defaultStyle}
	*       for the default values.
	*/
	constructor(style) {
		this.styleID = 0, this.reset(), deepCopyProperties(this, style, style);
	}
	/**
	* Creates a new TextStyle object with the same values as this one.
	* Note that the only the properties of the object are cloned.
	*
	* @return New cloned TextStyle object
	*/
	clone() {
		const clonedProperties = {};
		return deepCopyProperties(clonedProperties, this, _TextStyle2.defaultStyle), new _TextStyle2(clonedProperties);
	}
	/** Resets all properties to the defaults specified in TextStyle.prototype._default */
	reset() {
		deepCopyProperties(this, _TextStyle2.defaultStyle, _TextStyle2.defaultStyle);
	}
	/**
	* Alignment for multiline text, does not affect single line text.
	*
	* @member {'left'|'center'|'right'|'justify'}
	*/
	get align() {
		return this._align;
	}
	set align(align) {
		this._align !== align && (this._align = align, this.styleID++);
	}
	/** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
	get breakWords() {
		return this._breakWords;
	}
	set breakWords(breakWords) {
		this._breakWords !== breakWords && (this._breakWords = breakWords, this.styleID++);
	}
	/** Set a drop shadow for the text. */
	get dropShadow() {
		return this._dropShadow;
	}
	set dropShadow(dropShadow) {
		this._dropShadow !== dropShadow && (this._dropShadow = dropShadow, this.styleID++);
	}
	/** Set alpha for the drop shadow. */
	get dropShadowAlpha() {
		return this._dropShadowAlpha;
	}
	set dropShadowAlpha(dropShadowAlpha) {
		this._dropShadowAlpha !== dropShadowAlpha && (this._dropShadowAlpha = dropShadowAlpha, this.styleID++);
	}
	/** Set a angle of the drop shadow. */
	get dropShadowAngle() {
		return this._dropShadowAngle;
	}
	set dropShadowAngle(dropShadowAngle) {
		this._dropShadowAngle !== dropShadowAngle && (this._dropShadowAngle = dropShadowAngle, this.styleID++);
	}
	/** Set a shadow blur radius. */
	get dropShadowBlur() {
		return this._dropShadowBlur;
	}
	set dropShadowBlur(dropShadowBlur) {
		this._dropShadowBlur !== dropShadowBlur && (this._dropShadowBlur = dropShadowBlur, this.styleID++);
	}
	/** A fill style to be used on the dropshadow e.g., 'red', '#00FF00'. */
	get dropShadowColor() {
		return this._dropShadowColor;
	}
	set dropShadowColor(dropShadowColor) {
		const outputColor = getColor(dropShadowColor);
		this._dropShadowColor !== outputColor && (this._dropShadowColor = outputColor, this.styleID++);
	}
	/** Set a distance of the drop shadow. */
	get dropShadowDistance() {
		return this._dropShadowDistance;
	}
	set dropShadowDistance(dropShadowDistance) {
		this._dropShadowDistance !== dropShadowDistance && (this._dropShadowDistance = dropShadowDistance, this.styleID++);
	}
	/**
	* A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
	*
	* Can be an array to create a gradient e.g., `['#000000','#FFFFFF']`
	* {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
	*
	* @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
	*/
	get fill() {
		return this._fill;
	}
	set fill(fill) {
		const outputColor = getColor(fill);
		this._fill !== outputColor && (this._fill = outputColor, this.styleID++);
	}
	/**
	* If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
	*
	* @type {PIXI.TEXT_GRADIENT}
	*/
	get fillGradientType() {
		return this._fillGradientType;
	}
	set fillGradientType(fillGradientType) {
		this._fillGradientType !== fillGradientType && (this._fillGradientType = fillGradientType, this.styleID++);
	}
	/**
	* If fill is an array of colours to create a gradient, this array can set the stop points
	* (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
	*/
	get fillGradientStops() {
		return this._fillGradientStops;
	}
	set fillGradientStops(fillGradientStops) {
		areArraysEqual(this._fillGradientStops, fillGradientStops) || (this._fillGradientStops = fillGradientStops, this.styleID++);
	}
	/**
	* The font family, can be a single font name, or a list of names where the first
	* is the preferred font.
	*/
	get fontFamily() {
		return this._fontFamily;
	}
	set fontFamily(fontFamily) {
		this.fontFamily !== fontFamily && (this._fontFamily = fontFamily, this.styleID++);
	}
	/**
	* The font size
	* (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
	*/
	get fontSize() {
		return this._fontSize;
	}
	set fontSize(fontSize) {
		this._fontSize !== fontSize && (this._fontSize = fontSize, this.styleID++);
	}
	/**
	* The font style.
	*
	* @member {'normal'|'italic'|'oblique'}
	*/
	get fontStyle() {
		return this._fontStyle;
	}
	set fontStyle(fontStyle) {
		this._fontStyle !== fontStyle && (this._fontStyle = fontStyle, this.styleID++);
	}
	/**
	* The font variant.
	*
	* @member {'normal'|'small-caps'}
	*/
	get fontVariant() {
		return this._fontVariant;
	}
	set fontVariant(fontVariant) {
		this._fontVariant !== fontVariant && (this._fontVariant = fontVariant, this.styleID++);
	}
	/**
	* The font weight.
	*
	* @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
	*/
	get fontWeight() {
		return this._fontWeight;
	}
	set fontWeight(fontWeight) {
		this._fontWeight !== fontWeight && (this._fontWeight = fontWeight, this.styleID++);
	}
	/** The amount of spacing between letters, default is 0. */
	get letterSpacing() {
		return this._letterSpacing;
	}
	set letterSpacing(letterSpacing) {
		this._letterSpacing !== letterSpacing && (this._letterSpacing = letterSpacing, this.styleID++);
	}
	/** The line height, a number that represents the vertical space that a letter uses. */
	get lineHeight() {
		return this._lineHeight;
	}
	set lineHeight(lineHeight) {
		this._lineHeight !== lineHeight && (this._lineHeight = lineHeight, this.styleID++);
	}
	/** The space between lines. */
	get leading() {
		return this._leading;
	}
	set leading(leading) {
		this._leading !== leading && (this._leading = leading, this.styleID++);
	}
	/**
	* The lineJoin property sets the type of corner created, it can resolve spiked text issues.
	* Default is 'miter' (creates a sharp corner).
	*
	* @member {'miter'|'round'|'bevel'}
	*/
	get lineJoin() {
		return this._lineJoin;
	}
	set lineJoin(lineJoin) {
		this._lineJoin !== lineJoin && (this._lineJoin = lineJoin, this.styleID++);
	}
	/**
	* The miter limit to use when using the 'miter' lineJoin mode.
	*
	* This can reduce or increase the spikiness of rendered text.
	*/
	get miterLimit() {
		return this._miterLimit;
	}
	set miterLimit(miterLimit) {
		this._miterLimit !== miterLimit && (this._miterLimit = miterLimit, this.styleID++);
	}
	/**
	* Occasionally some fonts are cropped. Adding some padding will prevent this from happening
	* by adding padding to all sides of the text.
	*/
	get padding() {
		return this._padding;
	}
	set padding(padding) {
		this._padding !== padding && (this._padding = padding, this.styleID++);
	}
	/**
	* A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'
	*/
	get stroke() {
		return this._stroke;
	}
	set stroke(stroke) {
		const outputColor = getColor(stroke);
		this._stroke !== outputColor && (this._stroke = outputColor, this.styleID++);
	}
	/**
	* A number that represents the thickness of the stroke.
	*
	* @default 0
	*/
	get strokeThickness() {
		return this._strokeThickness;
	}
	set strokeThickness(strokeThickness) {
		this._strokeThickness !== strokeThickness && (this._strokeThickness = strokeThickness, this.styleID++);
	}
	/**
	* The baseline of the text that is rendered.
	*
	* @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
	*/
	get textBaseline() {
		return this._textBaseline;
	}
	set textBaseline(textBaseline) {
		this._textBaseline !== textBaseline && (this._textBaseline = textBaseline, this.styleID++);
	}
	/** Trim transparent borders. */
	get trim() {
		return this._trim;
	}
	set trim(trim) {
		this._trim !== trim && (this._trim = trim, this.styleID++);
	}
	/**
	* How newlines and spaces should be handled.
	* Default is 'pre' (preserve, preserve).
	*
	*  value       | New lines     |   Spaces
	*  ---         | ---           |   ---
	* 'normal'     | Collapse      |   Collapse
	* 'pre'        | Preserve      |   Preserve
	* 'pre-line'   | Preserve      |   Collapse
	*
	* @member {'normal'|'pre'|'pre-line'}
	*/
	get whiteSpace() {
		return this._whiteSpace;
	}
	set whiteSpace(whiteSpace) {
		this._whiteSpace !== whiteSpace && (this._whiteSpace = whiteSpace, this.styleID++);
	}
	/** Indicates if word wrap should be used. */
	get wordWrap() {
		return this._wordWrap;
	}
	set wordWrap(wordWrap) {
		this._wordWrap !== wordWrap && (this._wordWrap = wordWrap, this.styleID++);
	}
	/** The width at which text will wrap, it needs wordWrap to be set to true. */
	get wordWrapWidth() {
		return this._wordWrapWidth;
	}
	set wordWrapWidth(wordWrapWidth) {
		this._wordWrapWidth !== wordWrapWidth && (this._wordWrapWidth = wordWrapWidth, this.styleID++);
	}
	/**
	* Generates a font style string to use for `TextMetrics.measureFont()`.
	*
	* @return Font style string, for passing to `TextMetrics.measureFont()`
	*/
	toFontString() {
		const fontSizeString = typeof this.fontSize == "number" ? `${this.fontSize}px` : this.fontSize;
		let fontFamilies = this.fontFamily;
		Array.isArray(this.fontFamily) || (fontFamilies = this.fontFamily.split(","));
		for (let i = fontFamilies.length - 1; i >= 0; i--) {
			let fontFamily = fontFamilies[i].trim();
			!/([\"\'])[^\'\"]+\1/.test(fontFamily) && !genericFontFamilies.includes(fontFamily) && (fontFamily = `"${fontFamily}"`), fontFamilies[i] = fontFamily;
		}
		return `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${fontSizeString} ${fontFamilies.join(",")}`;
	}
};
_TextStyle.defaultStyle = {
	/**
	* See {@link PIXI.TextStyle.align}
	* @type {'left'|'center'|'right'|'justify'}
	*/
	align: "left",
	/** See {@link PIXI.TextStyle.breakWords} */
	breakWords: !1,
	/** See {@link PIXI.TextStyle.dropShadow} */
	dropShadow: !1,
	/** See {@link PIXI.TextStyle.dropShadowAlpha} */
	dropShadowAlpha: 1,
	/**
	* See {@link PIXI.TextStyle.dropShadowAngle}
	* @type {number}
	* @default Math.PI / 6
	*/
	dropShadowAngle: Math.PI / 6,
	/** See {@link PIXI.TextStyle.dropShadowBlur} */
	dropShadowBlur: 0,
	/**
	* See {@link PIXI.TextStyle.dropShadowColor}
	* @type {string|number}
	*/
	dropShadowColor: "black",
	/** See {@link PIXI.TextStyle.dropShadowDistance} */
	dropShadowDistance: 5,
	/**
	* See {@link PIXI.TextStyle.fill}
	* @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
	*/
	fill: "black",
	/**
	* See {@link PIXI.TextStyle.fillGradientType}
	* @type {PIXI.TEXT_GRADIENT}
	* @default PIXI.TEXT_GRADIENT.LINEAR_VERTICAL
	*/
	fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
	/**
	* See {@link PIXI.TextStyle.fillGradientStops}
	* @type {number[]}
	* @default []
	*/
	fillGradientStops: [],
	/**
	* See {@link PIXI.TextStyle.fontFamily}
	* @type {string|string[]}
	*/
	fontFamily: "Arial",
	/**
	* See {@link PIXI.TextStyle.fontSize}
	* @type {number|string} 
	*/
	fontSize: 26,
	/**
	* See {@link PIXI.TextStyle.fontStyle}
	* @type {'normal'|'italic'|'oblique'}
	*/
	fontStyle: "normal",
	/**
	* See {@link PIXI.TextStyle.fontVariant}
	* @type {'normal'|'small-caps'}
	*/
	fontVariant: "normal",
	/**
	* See {@link PIXI.TextStyle.fontWeight}
	* @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
	*/
	fontWeight: "normal",
	/** See {@link PIXI.TextStyle.leading} */
	leading: 0,
	/** See {@link PIXI.TextStyle.letterSpacing} */
	letterSpacing: 0,
	/** See {@link PIXI.TextStyle.lineHeight} */
	lineHeight: 0,
	/**
	* See {@link PIXI.TextStyle.lineJoin}
	* @type {'miter'|'round'|'bevel'}
	*/
	lineJoin: "miter",
	/** See {@link PIXI.TextStyle.miterLimit} */
	miterLimit: 10,
	/** See {@link PIXI.TextStyle.padding} */
	padding: 0,
	/**
	* See {@link PIXI.TextStyle.stroke}
	* @type {string|number}
	*/
	stroke: "black",
	/** See {@link PIXI.TextStyle.strokeThickness} */
	strokeThickness: 0,
	/**
	* See {@link PIXI.TextStyle.textBaseline} 
	* @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
	*/
	textBaseline: "alphabetic",
	/** See {@link PIXI.TextStyle.trim} */
	trim: !1,
	/**
	* See {@link PIXI.TextStyle.whiteSpace}
	* @type {'normal'|'pre'|'pre-line'}
	*/
	whiteSpace: "pre",
	/** See {@link PIXI.TextStyle.wordWrap} */
	wordWrap: !1,
	/** See {@link PIXI.TextStyle.wordWrapWidth} */
	wordWrapWidth: 100
};
var TextStyle = _TextStyle;
function getColor(color) {
	const temp = Color.shared, format = (color2) => {
		const res = temp.setValue(color2);
		return res.alpha === 1 ? res.toHex() : res.toRgbaString();
	};
	return Array.isArray(color) ? color.map(format) : format(color);
}
function areArraysEqual(array1, array2) {
	if (!Array.isArray(array1) || !Array.isArray(array2) || array1.length !== array2.length) return !1;
	for (let i = 0; i < array1.length; ++i) if (array1[i] !== array2[i]) return !1;
	return !0;
}
function deepCopyProperties(target, source, propertyObj) {
	for (const prop in propertyObj) Array.isArray(source[prop]) ? target[prop] = source[prop].slice() : target[prop] = source[prop];
}
//#endregion
//#region node_modules/@pixi/text/lib/Text.mjs
var defaultDestroyOptions = {
	texture: !0,
	children: !1,
	baseTexture: !0
};
var _Text = class _Text2 extends Sprite {
	/**
	* @param text - The string that you would like the text to display
	* @param style - The style parameters
	* @param canvas - The canvas element for drawing text
	*/
	constructor(text, style, canvas) {
		let ownCanvas = !1;
		canvas || (canvas = settings.ADAPTER.createCanvas(), ownCanvas = !0), canvas.width = 3, canvas.height = 3;
		const texture = Texture.from(canvas);
		texture.orig = new Rectangle(), texture.trim = new Rectangle(), super(texture), this._ownCanvas = ownCanvas, this.canvas = canvas, this.context = canvas.getContext("2d", { willReadFrequently: !0 }), this._resolution = _Text2.defaultResolution ?? settings.RESOLUTION, this._autoResolution = _Text2.defaultAutoResolution, this._text = null, this._style = null, this._styleListener = null, this._font = "", this.text = text, this.style = style, this.localStyleID = -1;
	}
	/**
	* @see PIXI.TextMetrics.experimentalLetterSpacing
	* @deprecated since 7.1.0
	*/
	static get experimentalLetterSpacing() {
		return TextMetrics.experimentalLetterSpacing;
	}
	static set experimentalLetterSpacing(value) {
		deprecation("7.1.0", "Text.experimentalLetterSpacing is deprecated, use TextMetrics.experimentalLetterSpacing"), TextMetrics.experimentalLetterSpacing = value;
	}
	/**
	* Renders text to its canvas, and updates its texture.
	*
	* By default this is used internally to ensure the texture is correct before rendering,
	* but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
	* and then shared across multiple Sprites.
	* @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
	*/
	updateText(respectDirty) {
		const style = this._style;
		if (this.localStyleID !== style.styleID && (this.dirty = !0, this.localStyleID = style.styleID), !this.dirty && respectDirty) return;
		this._font = this._style.toFontString();
		const context = this.context, measured = TextMetrics.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas), width = measured.width, height = measured.height, lines = measured.lines, lineHeight = measured.lineHeight, lineWidths = measured.lineWidths, maxLineWidth = measured.maxLineWidth, fontProperties = measured.fontProperties;
		this.canvas.width = Math.ceil(Math.ceil(Math.max(1, width) + style.padding * 2) * this._resolution), this.canvas.height = Math.ceil(Math.ceil(Math.max(1, height) + style.padding * 2) * this._resolution), context.scale(this._resolution, this._resolution), context.clearRect(0, 0, this.canvas.width, this.canvas.height), context.font = this._font, context.lineWidth = style.strokeThickness, context.textBaseline = style.textBaseline, context.lineJoin = style.lineJoin, context.miterLimit = style.miterLimit;
		let linePositionX, linePositionY;
		const passesCount = style.dropShadow ? 2 : 1;
		for (let i = 0; i < passesCount; ++i) {
			const isShadowPass = style.dropShadow && i === 0, dsOffsetText = isShadowPass ? Math.ceil(Math.max(1, height) + style.padding * 2) : 0, dsOffsetShadow = dsOffsetText * this._resolution;
			if (isShadowPass) {
				context.fillStyle = "black", context.strokeStyle = "black";
				const dropShadowColor = style.dropShadowColor, dropShadowBlur = style.dropShadowBlur * this._resolution, dropShadowDistance = style.dropShadowDistance * this._resolution;
				context.shadowColor = Color.shared.setValue(dropShadowColor).setAlpha(style.dropShadowAlpha).toRgbaString(), context.shadowBlur = dropShadowBlur, context.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance, context.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance + dsOffsetShadow;
			} else context.fillStyle = this._generateFillStyle(style, lines, measured), context.strokeStyle = style.stroke, context.shadowColor = "black", context.shadowBlur = 0, context.shadowOffsetX = 0, context.shadowOffsetY = 0;
			let linePositionYShift = (lineHeight - fontProperties.fontSize) / 2;
			lineHeight - fontProperties.fontSize < 0 && (linePositionYShift = 0);
			for (let i2 = 0; i2 < lines.length; i2++) linePositionX = style.strokeThickness / 2, linePositionY = style.strokeThickness / 2 + i2 * lineHeight + fontProperties.ascent + linePositionYShift, style.align === "right" ? linePositionX += maxLineWidth - lineWidths[i2] : style.align === "center" && (linePositionX += (maxLineWidth - lineWidths[i2]) / 2), style.stroke && style.strokeThickness && this.drawLetterSpacing(lines[i2], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText, !0), style.fill && this.drawLetterSpacing(lines[i2], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText);
		}
		this.updateTexture();
	}
	/**
	* Render the text with letter-spacing.
	* @param text - The text to draw
	* @param x - Horizontal position to draw the text
	* @param y - Vertical position to draw the text
	* @param isStroke - Is this drawing for the outside stroke of the
	*  text? If not, it's for the inside fill
	*/
	drawLetterSpacing(text, x, y, isStroke = !1) {
		const letterSpacing = this._style.letterSpacing;
		let useExperimentalLetterSpacing = !1;
		if (TextMetrics.experimentalLetterSpacingSupported && (TextMetrics.experimentalLetterSpacing ? (this.context.letterSpacing = `${letterSpacing}px`, this.context.textLetterSpacing = `${letterSpacing}px`, useExperimentalLetterSpacing = !0) : (this.context.letterSpacing = "0px", this.context.textLetterSpacing = "0px")), letterSpacing === 0 || useExperimentalLetterSpacing) {
			isStroke ? this.context.strokeText(text, x, y) : this.context.fillText(text, x, y);
			return;
		}
		let currentPosition = x;
		const stringArray = TextMetrics.graphemeSegmenter(text);
		let previousWidth = this.context.measureText(text).width, currentWidth = 0;
		for (let i = 0; i < stringArray.length; ++i) {
			const currentChar = stringArray[i];
			isStroke ? this.context.strokeText(currentChar, currentPosition, y) : this.context.fillText(currentChar, currentPosition, y);
			let textStr = "";
			for (let j = i + 1; j < stringArray.length; ++j) textStr += stringArray[j];
			currentWidth = this.context.measureText(textStr).width, currentPosition += previousWidth - currentWidth + letterSpacing, previousWidth = currentWidth;
		}
	}
	/** Updates texture size based on canvas size. */
	updateTexture() {
		const canvas = this.canvas;
		if (this._style.trim) {
			const trimmed = trimCanvas(canvas);
			trimmed.data && (canvas.width = trimmed.width, canvas.height = trimmed.height, this.context.putImageData(trimmed.data, 0, 0));
		}
		const texture = this._texture, style = this._style, padding = style.trim ? 0 : style.padding, baseTexture = texture.baseTexture;
		texture.trim.width = texture._frame.width = canvas.width / this._resolution, texture.trim.height = texture._frame.height = canvas.height / this._resolution, texture.trim.x = -padding, texture.trim.y = -padding, texture.orig.width = texture._frame.width - padding * 2, texture.orig.height = texture._frame.height - padding * 2, this._onTextureUpdate(), baseTexture.setRealSize(canvas.width, canvas.height, this._resolution), texture.updateUvs(), this.dirty = !1;
	}
	/**
	* Renders the object using the WebGL renderer
	* @param renderer - The renderer
	*/
	_render(renderer) {
		this._autoResolution && this._resolution !== renderer.resolution && (this._resolution = renderer.resolution, this.dirty = !0), this.updateText(!0), super._render(renderer);
	}
	/** Updates the transform on all children of this container for rendering. */
	updateTransform() {
		this.updateText(!0), super.updateTransform();
	}
	getBounds(skipUpdate, rect) {
		return this.updateText(!0), this._textureID === -1 && (skipUpdate = !1), super.getBounds(skipUpdate, rect);
	}
	/**
	* Gets the local bounds of the text object.
	* @param rect - The output rectangle.
	* @returns The bounds.
	*/
	getLocalBounds(rect) {
		return this.updateText(!0), super.getLocalBounds.call(this, rect);
	}
	/** Calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account. */
	_calculateBounds() {
		this.calculateVertices(), this._bounds.addQuad(this.vertexData);
	}
	/**
	* Generates the fill style. Can automatically generate a gradient based on the fill style being an array
	* @param style - The style.
	* @param lines - The lines of text.
	* @param metrics
	* @returns The fill style
	*/
	_generateFillStyle(style, lines, metrics) {
		const fillStyle = style.fill;
		if (Array.isArray(fillStyle)) {
			if (fillStyle.length === 1) return fillStyle[0];
		} else return fillStyle;
		let gradient;
		const dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0, padding = style.padding || 0, width = this.canvas.width / this._resolution - dropShadowCorrection - padding * 2, height = this.canvas.height / this._resolution - dropShadowCorrection - padding * 2, fill = fillStyle.slice(), fillGradientStops = style.fillGradientStops.slice();
		if (!fillGradientStops.length) {
			const lengthPlus1 = fill.length + 1;
			for (let i = 1; i < lengthPlus1; ++i) fillGradientStops.push(i / lengthPlus1);
		}
		if (fill.unshift(fillStyle[0]), fillGradientStops.unshift(0), fill.push(fillStyle[fillStyle.length - 1]), fillGradientStops.push(1), style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
			gradient = this.context.createLinearGradient(width / 2, padding, width / 2, height + padding);
			const textHeight = metrics.fontProperties.fontSize + style.strokeThickness;
			for (let i = 0; i < lines.length; i++) {
				const lastLineBottom = metrics.lineHeight * (i - 1) + textHeight, thisLineTop = metrics.lineHeight * i;
				let thisLineGradientStart = thisLineTop;
				i > 0 && lastLineBottom > thisLineTop && (thisLineGradientStart = (thisLineTop + lastLineBottom) / 2);
				const thisLineBottom = thisLineTop + textHeight, nextLineTop = metrics.lineHeight * (i + 1);
				let thisLineGradientEnd = thisLineBottom;
				i + 1 < lines.length && nextLineTop < thisLineBottom && (thisLineGradientEnd = (thisLineBottom + nextLineTop) / 2);
				const gradStopLineHeight = (thisLineGradientEnd - thisLineGradientStart) / height;
				for (let j = 0; j < fill.length; j++) {
					let lineStop = 0;
					typeof fillGradientStops[j] == "number" ? lineStop = fillGradientStops[j] : lineStop = j / fill.length;
					let globalStop = Math.min(1, Math.max(0, thisLineGradientStart / height + lineStop * gradStopLineHeight));
					globalStop = Number(globalStop.toFixed(5)), gradient.addColorStop(globalStop, fill[j]);
				}
			}
		} else {
			gradient = this.context.createLinearGradient(padding, height / 2, width + padding, height / 2);
			const totalIterations = fill.length + 1;
			let currentIteration = 1;
			for (let i = 0; i < fill.length; i++) {
				let stop;
				typeof fillGradientStops[i] == "number" ? stop = fillGradientStops[i] : stop = currentIteration / totalIterations, gradient.addColorStop(stop, fill[i]), currentIteration++;
			}
		}
		return gradient;
	}
	/**
	* Destroys this text object.
	*
	* Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
	* the majority of the time the texture will not be shared with any other Sprites.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param {boolean} [options.children=false] - if set to true, all the children will have their
	*  destroy method called as well. 'options' will be passed on to those calls.
	* @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
	* @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
	*/
	destroy(options) {
		typeof options == "boolean" && (options = { children: options }), options = Object.assign({}, defaultDestroyOptions, options), super.destroy(options), this._ownCanvas && (this.canvas.height = this.canvas.width = 0), this.context = null, this.canvas = null, this._style = null;
	}
	/** The width of the Text, setting this will actually modify the scale to achieve the value set. */
	get width() {
		return this.updateText(!0), Math.abs(this.scale.x) * this._texture.orig.width;
	}
	set width(value) {
		this.updateText(!0);
		const s = sign(this.scale.x) || 1;
		this.scale.x = s * value / this._texture.orig.width, this._width = value;
	}
	/** The height of the Text, setting this will actually modify the scale to achieve the value set. */
	get height() {
		return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height;
	}
	set height(value) {
		this.updateText(!0);
		const s = sign(this.scale.y) || 1;
		this.scale.y = s * value / this._texture.orig.height, this._height = value;
	}
	/**
	* Set the style of the text.
	*
	* Set up an event listener to listen for changes on the style object and mark the text as dirty.
	*
	* If setting the `style` can also be partial {@link PIXI.ITextStyle}.
	*/
	get style() {
		return this._style;
	}
	set style(style) {
		style = style || {}, style instanceof TextStyle ? this._style = style : this._style = new TextStyle(style), this.localStyleID = -1, this.dirty = !0;
	}
	/** Set the copy for the text object. To split a line you can use '\n'. */
	get text() {
		return this._text;
	}
	set text(text) {
		text = String(text ?? ""), this._text !== text && (this._text = text, this.dirty = !0);
	}
	/**
	* The resolution / device pixel ratio of the canvas.
	*
	* This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
	* @default 1
	*/
	get resolution() {
		return this._resolution;
	}
	set resolution(value) {
		this._autoResolution = !1, this._resolution !== value && (this._resolution = value, this.dirty = !0);
	}
};
_Text.defaultAutoResolution = !0;
var Text = _Text;
//#endregion
//#region node_modules/@pixi/prepare/lib/CountLimiter.mjs
var CountLimiter = class {
	/**
	* @param maxItemsPerFrame - The maximum number of items that can be prepared each frame.
	*/
	constructor(maxItemsPerFrame) {
		this.maxItemsPerFrame = maxItemsPerFrame, this.itemsLeft = 0;
	}
	/** Resets any counting properties to start fresh on a new frame. */
	beginFrame() {
		this.itemsLeft = this.maxItemsPerFrame;
	}
	/**
	* Checks to see if another item can be uploaded. This should only be called once per item.
	* @returns If the item is allowed to be uploaded.
	*/
	allowedToUpload() {
		return this.itemsLeft-- > 0;
	}
};
//#endregion
//#region node_modules/@pixi/prepare/lib/BasePrepare.mjs
function findMultipleBaseTextures(item, queue) {
	let result = !1;
	if (item?._textures?.length) {
		for (let i = 0; i < item._textures.length; i++) if (item._textures[i] instanceof Texture) {
			const baseTexture = item._textures[i].baseTexture;
			queue.includes(baseTexture) || (queue.push(baseTexture), result = !0);
		}
	}
	return result;
}
function findBaseTexture(item, queue) {
	if (item.baseTexture instanceof BaseTexture) {
		const texture = item.baseTexture;
		return queue.includes(texture) || queue.push(texture), !0;
	}
	return !1;
}
function findTexture(item, queue) {
	if (item._texture && item._texture instanceof Texture) {
		const texture = item._texture.baseTexture;
		return queue.includes(texture) || queue.push(texture), !0;
	}
	return !1;
}
function drawText(_helper, item) {
	return item instanceof Text ? (item.updateText(!0), !0) : !1;
}
function calculateTextStyle(_helper, item) {
	if (item instanceof TextStyle) {
		const font = item.toFontString();
		return TextMetrics.measureFont(font), !0;
	}
	return !1;
}
function findText(item, queue) {
	if (item instanceof Text) {
		queue.includes(item.style) || queue.push(item.style), queue.includes(item) || queue.push(item);
		const texture = item._texture.baseTexture;
		return queue.includes(texture) || queue.push(texture), !0;
	}
	return !1;
}
function findTextStyle(item, queue) {
	return item instanceof TextStyle ? (queue.includes(item) || queue.push(item), !0) : !1;
}
var _BasePrepare = class _BasePrepare2 {
	/**
	* @param {PIXI.IRenderer} renderer - A reference to the current renderer
	*/
	constructor(renderer) {
		this.limiter = new CountLimiter(_BasePrepare2.uploadsPerFrame), this.renderer = renderer, this.uploadHookHelper = null, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.delayedTick = () => {
			this.queue && this.prepareItems();
		}, this.registerFindHook(findText), this.registerFindHook(findTextStyle), this.registerFindHook(findMultipleBaseTextures), this.registerFindHook(findBaseTexture), this.registerFindHook(findTexture), this.registerUploadHook(drawText), this.registerUploadHook(calculateTextStyle);
	}
	/**
	* Upload all the textures and graphics to the GPU.
	* @method PIXI.BasePrepare#upload
	* @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text} [item] -
	*        Container or display object to search for items to upload or the items to upload themselves,
	*        or optionally ommitted, if items have been added using {@link PIXI.BasePrepare#add `prepare.add`}.
	*/
	upload(item) {
		return new Promise((resolve) => {
			item && this.add(item), this.queue.length ? (this.completes.push(resolve), this.ticking || (this.ticking = !0, Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY))) : resolve();
		});
	}
	/**
	* Handle tick update
	* @private
	*/
	tick() {
		setTimeout(this.delayedTick, 0);
	}
	/**
	* Actually prepare items. This is handled outside of the tick because it will take a while
	* and we do NOT want to block the current animation frame from rendering.
	* @private
	*/
	prepareItems() {
		for (this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload();) {
			const item = this.queue[0];
			let uploaded = !1;
			if (item && !item._destroyed) {
				for (let i = 0, len = this.uploadHooks.length; i < len; i++) if (this.uploadHooks[i](this.uploadHookHelper, item)) {
					this.queue.shift(), uploaded = !0;
					break;
				}
			}
			uploaded || this.queue.shift();
		}
		if (this.queue.length) Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY);
		else {
			this.ticking = !1;
			const completes = this.completes.slice(0);
			this.completes.length = 0;
			for (let i = 0, len = completes.length; i < len; i++) completes[i]();
		}
	}
	/**
	* Adds hooks for finding items.
	* @param {Function} addHook - Function call that takes two parameters: `item:*, queue:Array`
	*          function must return `true` if it was able to add item to the queue.
	* @returns Instance of plugin for chaining.
	*/
	registerFindHook(addHook) {
		return addHook && this.addHooks.push(addHook), this;
	}
	/**
	* Adds hooks for uploading items.
	* @param {Function} uploadHook - Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and
	*          function must return `true` if it was able to handle upload of item.
	* @returns Instance of plugin for chaining.
	*/
	registerUploadHook(uploadHook) {
		return uploadHook && this.uploadHooks.push(uploadHook), this;
	}
	/**
	* Manually add an item to the uploading queue.
	* @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text|*} item - Object to
	*        add to the queue
	* @returns Instance of plugin for chaining.
	*/
	add(item) {
		for (let i = 0, len = this.addHooks.length; i < len && !this.addHooks[i](item, this.queue); i++);
		if (item instanceof Container) for (let i = item.children.length - 1; i >= 0; i--) this.add(item.children[i]);
		return this;
	}
	/** Destroys the plugin, don't use after this. */
	destroy() {
		this.ticking && Ticker.system.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null, this.limiter = null, this.uploadHookHelper = null;
	}
};
_BasePrepare.uploadsPerFrame = 4;
var BasePrepare = _BasePrepare;
//#endregion
//#region node_modules/@pixi/prepare/lib/settings.mjs
Object.defineProperties(settings, { 
/**
* Default number of uploads per frame using prepare plugin.
* @static
* @memberof PIXI.settings
* @name UPLOADS_PER_FRAME
* @deprecated since 7.1.0
* @see PIXI.BasePrepare.uploadsPerFrame
* @type {number}
*/
UPLOADS_PER_FRAME: {
	get() {
		return BasePrepare.uploadsPerFrame;
	},
	set(value) {
		deprecation("7.1.0", "settings.UPLOADS_PER_FRAME is deprecated, use prepare.BasePrepare.uploadsPerFrame"), BasePrepare.uploadsPerFrame = value;
	}
} });
//#endregion
//#region node_modules/@pixi/prepare/lib/Prepare.mjs
function uploadBaseTextures(renderer, item) {
	return item instanceof BaseTexture ? (item._glTextures[renderer.CONTEXT_UID] || renderer.texture.bind(item), !0) : !1;
}
function uploadGraphics(renderer, item) {
	if (!(item instanceof Graphics)) return !1;
	const { geometry } = item;
	item.finishPoly(), geometry.updateBatches();
	const { batches } = geometry;
	for (let i = 0; i < batches.length; i++) {
		const { texture } = batches[i].style;
		texture && uploadBaseTextures(renderer, texture.baseTexture);
	}
	return geometry.batchable || renderer.geometry.bind(geometry, item._resolveDirectShader(renderer)), !0;
}
function findGraphics(item, queue) {
	return item instanceof Graphics ? (queue.push(item), !0) : !1;
}
var Prepare = class extends BasePrepare {
	/**
	* @param {PIXI.Renderer} renderer - A reference to the current renderer
	*/
	constructor(renderer) {
		super(renderer), this.uploadHookHelper = this.renderer, this.registerFindHook(findGraphics), this.registerUploadHook(uploadBaseTextures), this.registerUploadHook(uploadGraphics);
	}
};
Prepare.extension = {
	name: "prepare",
	type: ExtensionType.RendererSystem
};
extensions.add(Prepare);
//#endregion
export { TEXT_GRADIENT as i, TextStyle as n, TextMetrics as r, Text as t };
