import { $ as getResolutionOfUrl, B as ObservablePoint, F as Texture, H as Rectangle, K as BaseTexture, U as Point, X as ExtensionType, Z as extensions, b as MeshGeometry, dt as path, gt as BLEND_MODES, ht as ALPHA_MODES, it as removeItems, lt as Color, mt as settings, w as Container, x as Mesh, y as MeshMaterial, yt as MIPMAP_MODES, z as Program } from "./@pixi-spine/base+[...].mjs";
import { n as LoaderParserPriority, r as copySearchParams } from "./pixi__assets.mjs";
import { i as TEXT_GRADIENT, n as TextStyle, r as TextMetrics } from "./pixi__prepare+pixi__text.mjs";
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/BitmapFontData.mjs
var BitmapFontData = class {
	constructor() {
		this.info = [], this.common = [], this.page = [], this.char = [], this.kerning = [], this.distanceField = [];
	}
};
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/formats/TextFormat.mjs
var TextFormat = class {
	/**
	* Check if resource refers to txt font data.
	* @param data
	* @returns - True if resource could be treated as font data, false otherwise.
	*/
	static test(data) {
		return typeof data == "string" && data.startsWith("info face=");
	}
	/**
	* Convert text font data to a javascript object.
	* @param txt - Raw string data to be converted
	* @returns - Parsed font data
	*/
	static parse(txt) {
		const items = txt.match(/^[a-z]+\s+.+$/gm), rawData = {
			info: [],
			common: [],
			page: [],
			char: [],
			chars: [],
			kerning: [],
			kernings: [],
			distanceField: []
		};
		for (const i in items) {
			const name = items[i].match(/^[a-z]+/gm)[0], attributeList = items[i].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), itemData = {};
			for (const i2 in attributeList) {
				const split = attributeList[i2].split("="), key = split[0], strValue = split[1].replace(/"/gm, ""), floatValue = parseFloat(strValue);
				itemData[key] = isNaN(floatValue) ? strValue : floatValue;
			}
			rawData[name].push(itemData);
		}
		const font = new BitmapFontData();
		return rawData.info.forEach((info) => font.info.push({
			face: info.face,
			size: parseInt(info.size, 10)
		})), rawData.common.forEach((common) => font.common.push({ lineHeight: parseInt(common.lineHeight, 10) })), rawData.page.forEach((page) => font.page.push({
			id: parseInt(page.id, 10),
			file: page.file
		})), rawData.char.forEach((char) => font.char.push({
			id: parseInt(char.id, 10),
			page: parseInt(char.page, 10),
			x: parseInt(char.x, 10),
			y: parseInt(char.y, 10),
			width: parseInt(char.width, 10),
			height: parseInt(char.height, 10),
			xoffset: parseInt(char.xoffset, 10),
			yoffset: parseInt(char.yoffset, 10),
			xadvance: parseInt(char.xadvance, 10)
		})), rawData.kerning.forEach((kerning) => font.kerning.push({
			first: parseInt(kerning.first, 10),
			second: parseInt(kerning.second, 10),
			amount: parseInt(kerning.amount, 10)
		})), rawData.distanceField.forEach((df) => font.distanceField.push({
			distanceRange: parseInt(df.distanceRange, 10),
			fieldType: df.fieldType
		})), font;
	}
};
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/formats/XMLFormat.mjs
var XMLFormat = class {
	/**
	* Check if resource refers to xml font data.
	* @param data
	* @returns - True if resource could be treated as font data, false otherwise.
	*/
	static test(data) {
		const xml = data;
		return typeof data != "string" && "getElementsByTagName" in data && xml.getElementsByTagName("page").length && xml.getElementsByTagName("info")[0].getAttribute("face") !== null;
	}
	/**
	* Convert the XML into BitmapFontData that we can use.
	* @param xml
	* @returns - Data to use for BitmapFont
	*/
	static parse(xml) {
		const data = new BitmapFontData(), info = xml.getElementsByTagName("info"), common = xml.getElementsByTagName("common"), page = xml.getElementsByTagName("page"), char = xml.getElementsByTagName("char"), kerning = xml.getElementsByTagName("kerning"), distanceField = xml.getElementsByTagName("distanceField");
		for (let i = 0; i < info.length; i++) data.info.push({
			face: info[i].getAttribute("face"),
			size: parseInt(info[i].getAttribute("size"), 10)
		});
		for (let i = 0; i < common.length; i++) data.common.push({ lineHeight: parseInt(common[i].getAttribute("lineHeight"), 10) });
		for (let i = 0; i < page.length; i++) data.page.push({
			id: parseInt(page[i].getAttribute("id"), 10) || 0,
			file: page[i].getAttribute("file")
		});
		for (let i = 0; i < char.length; i++) {
			const letter = char[i];
			data.char.push({
				id: parseInt(letter.getAttribute("id"), 10),
				page: parseInt(letter.getAttribute("page"), 10) || 0,
				x: parseInt(letter.getAttribute("x"), 10),
				y: parseInt(letter.getAttribute("y"), 10),
				width: parseInt(letter.getAttribute("width"), 10),
				height: parseInt(letter.getAttribute("height"), 10),
				xoffset: parseInt(letter.getAttribute("xoffset"), 10),
				yoffset: parseInt(letter.getAttribute("yoffset"), 10),
				xadvance: parseInt(letter.getAttribute("xadvance"), 10)
			});
		}
		for (let i = 0; i < kerning.length; i++) data.kerning.push({
			first: parseInt(kerning[i].getAttribute("first"), 10),
			second: parseInt(kerning[i].getAttribute("second"), 10),
			amount: parseInt(kerning[i].getAttribute("amount"), 10)
		});
		for (let i = 0; i < distanceField.length; i++) data.distanceField.push({
			fieldType: distanceField[i].getAttribute("fieldType"),
			distanceRange: parseInt(distanceField[i].getAttribute("distanceRange"), 10)
		});
		return data;
	}
};
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/formats/XMLStringFormat.mjs
var XMLStringFormat = class {
	/**
	* Check if resource refers to text xml font data.
	* @param data
	* @returns - True if resource could be treated as font data, false otherwise.
	*/
	static test(data) {
		return typeof data == "string" && data.includes("<font>") ? XMLFormat.test(settings.ADAPTER.parseXML(data)) : !1;
	}
	/**
	* Convert the text XML into BitmapFontData that we can use.
	* @param xmlTxt
	* @returns - Data to use for BitmapFont
	*/
	static parse(xmlTxt) {
		return XMLFormat.parse(settings.ADAPTER.parseXML(xmlTxt));
	}
};
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/formats/index.mjs
var formats = [
	TextFormat,
	XMLFormat,
	XMLStringFormat
];
function autoDetectFormat(data) {
	for (let i = 0; i < formats.length; i++) if (formats[i].test(data)) return formats[i];
	return null;
}
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/utils/generateFillStyle.mjs
function generateFillStyle(canvas, context, style, resolution, lines, metrics) {
	const fillStyle = style.fill;
	if (Array.isArray(fillStyle)) {
		if (fillStyle.length === 1) return fillStyle[0];
	} else return fillStyle;
	let gradient;
	const dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0, padding = style.padding || 0, width = canvas.width / resolution - dropShadowCorrection - padding * 2, height = canvas.height / resolution - dropShadowCorrection - padding * 2, fill = fillStyle.slice(), fillGradientStops = style.fillGradientStops.slice();
	if (!fillGradientStops.length) {
		const lengthPlus1 = fill.length + 1;
		for (let i = 1; i < lengthPlus1; ++i) fillGradientStops.push(i / lengthPlus1);
	}
	if (fill.unshift(fillStyle[0]), fillGradientStops.unshift(0), fill.push(fillStyle[fillStyle.length - 1]), fillGradientStops.push(1), style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
		gradient = context.createLinearGradient(width / 2, padding, width / 2, height + padding);
		let lastIterationStop = 0;
		const gradStopLineHeight = (metrics.fontProperties.fontSize + style.strokeThickness) / height;
		for (let i = 0; i < lines.length; i++) {
			const thisLineTop = metrics.lineHeight * i;
			for (let j = 0; j < fill.length; j++) {
				let lineStop = 0;
				typeof fillGradientStops[j] == "number" ? lineStop = fillGradientStops[j] : lineStop = j / fill.length;
				const globalStop = thisLineTop / height + lineStop * gradStopLineHeight;
				let clampedStop = Math.max(lastIterationStop, globalStop);
				clampedStop = Math.min(clampedStop, 1), gradient.addColorStop(clampedStop, fill[j]), lastIterationStop = clampedStop;
			}
		}
	} else {
		gradient = context.createLinearGradient(padding, height / 2, width + padding, height / 2);
		const totalIterations = fill.length + 1;
		let currentIteration = 1;
		for (let i = 0; i < fill.length; i++) {
			let stop;
			typeof fillGradientStops[i] == "number" ? stop = fillGradientStops[i] : stop = currentIteration / totalIterations, gradient.addColorStop(stop, fill[i]), currentIteration++;
		}
	}
	return gradient;
}
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/utils/drawGlyph.mjs
function drawGlyph(canvas, context, metrics, x, y, resolution, style) {
	const char = metrics.text, fontProperties = metrics.fontProperties;
	context.translate(x, y), context.scale(resolution, resolution);
	const tx = style.strokeThickness / 2, ty = -(style.strokeThickness / 2);
	if (context.font = style.toFontString(), context.lineWidth = style.strokeThickness, context.textBaseline = style.textBaseline, context.lineJoin = style.lineJoin, context.miterLimit = style.miterLimit, context.fillStyle = generateFillStyle(canvas, context, style, resolution, [char], metrics), context.strokeStyle = style.stroke, style.dropShadow) {
		const dropShadowColor = style.dropShadowColor, dropShadowBlur = style.dropShadowBlur * resolution, dropShadowDistance = style.dropShadowDistance * resolution;
		context.shadowColor = Color.shared.setValue(dropShadowColor).setAlpha(style.dropShadowAlpha).toRgbaString(), context.shadowBlur = dropShadowBlur, context.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance, context.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance;
	} else context.shadowColor = "black", context.shadowBlur = 0, context.shadowOffsetX = 0, context.shadowOffsetY = 0;
	style.stroke && style.strokeThickness && context.strokeText(char, tx, ty + metrics.lineHeight - fontProperties.descent), style.fill && context.fillText(char, tx, ty + metrics.lineHeight - fontProperties.descent), context.setTransform(1, 0, 0, 1, 0, 0), context.fillStyle = "rgba(0, 0, 0, 0)";
}
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/utils/extractCharCode.mjs
function extractCharCode(str) {
	return str.codePointAt ? str.codePointAt(0) : str.charCodeAt(0);
}
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/utils/splitTextToCharacters.mjs
function splitTextToCharacters(text) {
	return Array.from ? Array.from(text) : text.split("");
}
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/utils/resolveCharacters.mjs
function resolveCharacters(chars) {
	typeof chars == "string" && (chars = [chars]);
	const result = [];
	for (let i = 0, j = chars.length; i < j; i++) {
		const item = chars[i];
		if (Array.isArray(item)) {
			if (item.length !== 2) throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${item.length}.`);
			const startCode = item[0].charCodeAt(0), endCode = item[1].charCodeAt(0);
			if (endCode < startCode) throw new Error("[BitmapFont]: Invalid character range.");
			for (let i2 = startCode, j2 = endCode; i2 <= j2; i2++) result.push(String.fromCharCode(i2));
		} else result.push(...splitTextToCharacters(item));
	}
	if (result.length === 0) throw new Error("[BitmapFont]: Empty set when resolving characters.");
	return result;
}
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/BitmapFont.mjs
var _BitmapFont = class _BitmapFont2 {
	/**
	* @param data
	* @param textures
	* @param ownsTextures - Setting to `true` will destroy page textures
	*        when the font is uninstalled.
	*/
	constructor(data, textures, ownsTextures) {
		const [info] = data.info, [common] = data.common, [page] = data.page, [distanceField] = data.distanceField, res = getResolutionOfUrl(page.file), pageTextures = {};
		this._ownsTextures = ownsTextures, this.font = info.face, this.size = info.size, this.lineHeight = common.lineHeight / res, this.chars = {}, this.pageTextures = pageTextures;
		for (let i = 0; i < data.page.length; i++) {
			const { id, file } = data.page[i];
			pageTextures[id] = textures instanceof Array ? textures[i] : textures[file], distanceField?.fieldType && distanceField.fieldType !== "none" && (pageTextures[id].baseTexture.alphaMode = ALPHA_MODES.NO_PREMULTIPLIED_ALPHA, pageTextures[id].baseTexture.mipmap = MIPMAP_MODES.OFF);
		}
		for (let i = 0; i < data.char.length; i++) {
			const { id, page: page2 } = data.char[i];
			let { x, y, width, height, xoffset, yoffset, xadvance } = data.char[i];
			x /= res, y /= res, width /= res, height /= res, xoffset /= res, yoffset /= res, xadvance /= res;
			const rect = new Rectangle(x + pageTextures[page2].frame.x / res, y + pageTextures[page2].frame.y / res, width, height);
			this.chars[id] = {
				xOffset: xoffset,
				yOffset: yoffset,
				xAdvance: xadvance,
				kerning: {},
				texture: new Texture(pageTextures[page2].baseTexture, rect),
				page: page2
			};
		}
		for (let i = 0; i < data.kerning.length; i++) {
			let { first, second, amount } = data.kerning[i];
			first /= res, second /= res, amount /= res, this.chars[second] && (this.chars[second].kerning[first] = amount);
		}
		this.distanceFieldRange = distanceField?.distanceRange, this.distanceFieldType = distanceField?.fieldType?.toLowerCase() ?? "none";
	}
	/** Remove references to created glyph textures. */
	destroy() {
		for (const id in this.chars) this.chars[id].texture.destroy(), this.chars[id].texture = null;
		for (const id in this.pageTextures) this._ownsTextures && this.pageTextures[id].destroy(!0), this.pageTextures[id] = null;
		this.chars = null, this.pageTextures = null;
	}
	/**
	* Register a new bitmap font.
	* @param data - The
	*        characters map that could be provided as xml or raw string.
	* @param textures - List of textures for each page.
	* @param ownsTextures - Set to `true` to destroy page textures
	*        when the font is uninstalled. By default fonts created with
	*        `BitmapFont.from` or from the `BitmapFontLoader` are `true`.
	* @returns {PIXI.BitmapFont} Result font object with font, size, lineHeight
	*         and char fields.
	*/
	static install(data, textures, ownsTextures) {
		let fontData;
		if (data instanceof BitmapFontData) fontData = data;
		else {
			const format = autoDetectFormat(data);
			if (!format) throw new Error("Unrecognized data format for font.");
			fontData = format.parse(data);
		}
		textures instanceof Texture && (textures = [textures]);
		const font = new _BitmapFont2(fontData, textures, ownsTextures);
		return _BitmapFont2.available[font.font] = font, font;
	}
	/**
	* Remove bitmap font by name.
	* @param name - Name of the font to uninstall.
	*/
	static uninstall(name) {
		const font = _BitmapFont2.available[name];
		if (!font) throw new Error(`No font found named '${name}'`);
		font.destroy(), delete _BitmapFont2.available[name];
	}
	/**
	* Generates a bitmap-font for the given style and character set. This does not support
	* kernings yet. With `style` properties, only the following non-layout properties are used:
	*
	* - {@link PIXI.TextStyle#dropShadow|dropShadow}
	* - {@link PIXI.TextStyle#dropShadowDistance|dropShadowDistance}
	* - {@link PIXI.TextStyle#dropShadowColor|dropShadowColor}
	* - {@link PIXI.TextStyle#dropShadowBlur|dropShadowBlur}
	* - {@link PIXI.TextStyle#dropShadowAngle|dropShadowAngle}
	* - {@link PIXI.TextStyle#fill|fill}
	* - {@link PIXI.TextStyle#fillGradientStops|fillGradientStops}
	* - {@link PIXI.TextStyle#fillGradientType|fillGradientType}
	* - {@link PIXI.TextStyle#fontFamily|fontFamily}
	* - {@link PIXI.TextStyle#fontSize|fontSize}
	* - {@link PIXI.TextStyle#fontVariant|fontVariant}
	* - {@link PIXI.TextStyle#fontWeight|fontWeight}
	* - {@link PIXI.TextStyle#lineJoin|lineJoin}
	* - {@link PIXI.TextStyle#miterLimit|miterLimit}
	* - {@link PIXI.TextStyle#stroke|stroke}
	* - {@link PIXI.TextStyle#strokeThickness|strokeThickness}
	* - {@link PIXI.TextStyle#textBaseline|textBaseline}
	* @param name - The name of the custom font to use with BitmapText.
	* @param textStyle - Style options to render with BitmapFont.
	* @param options - Setup options for font or name of the font.
	* @returns Font generated by style options.
	* @example
	* import { BitmapFont, BitmapText } from 'pixi.js';
	*
	* BitmapFont.from('TitleFont', {
	*     fontFamily: 'Arial',
	*     fontSize: 12,
	*     strokeThickness: 2,
	*     fill: 'purple',
	* });
	*
	* const title = new BitmapText('This is the title', { fontName: 'TitleFont' });
	*/
	static from(name, textStyle, options) {
		if (!name) throw new Error("[BitmapFont] Property `name` is required.");
		const { chars, padding, resolution, textureWidth, textureHeight, ...baseOptions } = Object.assign({}, _BitmapFont2.defaultOptions, options), charsList = resolveCharacters(chars), style = textStyle instanceof TextStyle ? textStyle : new TextStyle(textStyle), lineWidth = textureWidth, fontData = new BitmapFontData();
		fontData.info[0] = {
			face: style.fontFamily,
			size: style.fontSize
		}, fontData.common[0] = { lineHeight: style.fontSize };
		let positionX = 0, positionY = 0, canvas, context, baseTexture, maxCharHeight = 0;
		const baseTextures = [], textures = [];
		for (let i = 0; i < charsList.length; i++) {
			canvas || (canvas = settings.ADAPTER.createCanvas(), canvas.width = textureWidth, canvas.height = textureHeight, context = canvas.getContext("2d"), baseTexture = new BaseTexture(canvas, {
				resolution,
				...baseOptions
			}), baseTextures.push(baseTexture), textures.push(new Texture(baseTexture)), fontData.page.push({
				id: textures.length - 1,
				file: ""
			}));
			const character = charsList[i], metrics = TextMetrics.measureText(character, style, !1, canvas), width = metrics.width, height = Math.ceil(metrics.height), textureGlyphWidth = Math.ceil((style.fontStyle === "italic" ? 2 : 1) * width);
			if (positionY >= textureHeight - height * resolution) {
				if (positionY === 0) throw new Error(`[BitmapFont] textureHeight ${textureHeight}px is too small (fontFamily: '${style.fontFamily}', fontSize: ${style.fontSize}px, char: '${character}')`);
				--i, canvas = null, context = null, baseTexture = null, positionY = 0, positionX = 0, maxCharHeight = 0;
				continue;
			}
			if (maxCharHeight = Math.max(height + metrics.fontProperties.descent, maxCharHeight), textureGlyphWidth * resolution + positionX >= lineWidth) {
				if (positionX === 0) throw new Error(`[BitmapFont] textureWidth ${textureWidth}px is too small (fontFamily: '${style.fontFamily}', fontSize: ${style.fontSize}px, char: '${character}')`);
				--i, positionY += maxCharHeight * resolution, positionY = Math.ceil(positionY), positionX = 0, maxCharHeight = 0;
				continue;
			}
			drawGlyph(canvas, context, metrics, positionX, positionY, resolution, style);
			const id = extractCharCode(metrics.text);
			fontData.char.push({
				id,
				page: textures.length - 1,
				x: positionX / resolution,
				y: positionY / resolution,
				width: textureGlyphWidth,
				height,
				xoffset: 0,
				yoffset: 0,
				xadvance: width - (style.dropShadow ? style.dropShadowDistance : 0) - (style.stroke ? style.strokeThickness : 0)
			}), positionX += (textureGlyphWidth + 2 * padding) * resolution, positionX = Math.ceil(positionX);
		}
		if (!options?.skipKerning) for (let i = 0, len = charsList.length; i < len; i++) {
			const first = charsList[i];
			for (let j = 0; j < len; j++) {
				const second = charsList[j], c1 = context.measureText(first).width, c2 = context.measureText(second).width, amount = context.measureText(first + second).width - (c1 + c2);
				amount && fontData.kerning.push({
					first: extractCharCode(first),
					second: extractCharCode(second),
					amount
				});
			}
		}
		const font = new _BitmapFont2(fontData, textures, !0);
		return _BitmapFont2.available[name] !== void 0 && _BitmapFont2.uninstall(name), _BitmapFont2.available[name] = font, font;
	}
};
_BitmapFont.ALPHA = [
	["a", "z"],
	["A", "Z"],
	" "
], _BitmapFont.NUMERIC = [["0", "9"]], _BitmapFont.ALPHANUMERIC = [
	["a", "z"],
	["A", "Z"],
	["0", "9"],
	" "
], _BitmapFont.ASCII = [[" ", "~"]], _BitmapFont.defaultOptions = {
	resolution: 1,
	textureWidth: 512,
	textureHeight: 512,
	padding: 4,
	chars: _BitmapFont.ALPHANUMERIC
}, _BitmapFont.available = {};
var BitmapFont = _BitmapFont;
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/shader/msdf.frag.mjs
var msdfFrag = `// Pixi texture info\r
varying vec2 vTextureCoord;\r
uniform sampler2D uSampler;\r
\r
// Tint\r
uniform vec4 uColor;\r
\r
// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange\r
uniform float uFWidth;\r
\r
void main(void) {\r
\r
  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.\r
  vec4 texColor = texture2D(uSampler, vTextureCoord);\r
\r
  // MSDF\r
  float median = texColor.r + texColor.g + texColor.b -\r
                  min(texColor.r, min(texColor.g, texColor.b)) -\r
                  max(texColor.r, max(texColor.g, texColor.b));\r
  // SDF\r
  median = min(median, texColor.a);\r
\r
  float screenPxDistance = uFWidth * (median - 0.5);\r
  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r
  if (median < 0.01) {\r
    alpha = 0.0;\r
  } else if (median > 0.99) {\r
    alpha = 1.0;\r
  }\r
\r
  // Gamma correction for coverage-like alpha\r
  float luma = dot(uColor.rgb, vec3(0.299, 0.587, 0.114));\r
  float gamma = mix(1.0, 1.0 / 2.2, luma);\r
  float coverage = pow(uColor.a * alpha, gamma);  \r
\r
  // NPM Textures, NPM outputs\r
  gl_FragColor = vec4(uColor.rgb, coverage);\r
}\r
`;
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/shader/msdf.vert.mjs
var msdfVert = `// Mesh material default fragment\r
attribute vec2 aVertexPosition;\r
attribute vec2 aTextureCoord;\r
\r
uniform mat3 projectionMatrix;\r
uniform mat3 translationMatrix;\r
uniform mat3 uTextureMatrix;\r
\r
varying vec2 vTextureCoord;\r
\r
void main(void)\r
{\r
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r
\r
    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\r
}\r
`;
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/BitmapText.mjs
var pageMeshDataDefaultPageMeshData = [];
var pageMeshDataMSDFPageMeshData = [];
var charRenderDataPool = [];
var _BitmapText = class _BitmapText2 extends Container {
	/**
	* @param text - A string that you would like the text to display.
	* @param style - The style parameters.
	* @param {string} style.fontName - The installed BitmapFont name.
	* @param {number} [style.fontSize] - The size of the font in pixels, e.g. 24. If undefined,
	*.     this will default to the BitmapFont size.
	* @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center', 'right' or 'justify'),
	*      does not affect single line text.
	* @param {PIXI.ColorSource} [style.tint=0xFFFFFF] - The tint color.
	* @param {number} [style.letterSpacing=0] - The amount of spacing between letters.
	* @param {number} [style.maxWidth=0] - The max width of the text before line wrapping.
	*/
	constructor(text, style = {}) {
		super();
		const { align, tint, maxWidth, letterSpacing, fontName, fontSize } = Object.assign({}, _BitmapText2.styleDefaults, style);
		if (!BitmapFont.available[fontName]) throw new Error(`Missing BitmapFont "${fontName}"`);
		this._activePagesMeshData = [], this._textWidth = 0, this._textHeight = 0, this._align = align, this._tintColor = new Color(tint), this._font = void 0, this._fontName = fontName, this._fontSize = fontSize, this.text = text, this._maxWidth = maxWidth, this._maxLineHeight = 0, this._letterSpacing = letterSpacing, this._anchor = new ObservablePoint(() => {
			this.dirty = !0;
		}, this, 0, 0), this._roundPixels = settings.ROUND_PIXELS, this.dirty = !0, this._resolution = settings.RESOLUTION, this._autoResolution = !0, this._textureCache = {};
	}
	/** Renders text and updates it when needed. This should only be called if the BitmapFont is regenerated. */
	updateText() {
		const data = BitmapFont.available[this._fontName], fontSize = this.fontSize, scale = fontSize / data.size, pos = new Point(), chars = [], lineWidths = [], lineSpaces = [], charsInput = splitTextToCharacters(this._text.replace(/(?:\r\n|\r)/g, `
`) || " "), maxWidth = this._maxWidth * data.size / fontSize, pageMeshDataPool = data.distanceFieldType === "none" ? pageMeshDataDefaultPageMeshData : pageMeshDataMSDFPageMeshData;
		let prevCharCode = null, lastLineWidth = 0, maxLineWidth = 0, line = 0, lastBreakPos = -1, lastBreakWidth = 0, spacesRemoved = 0, maxLineHeight = 0, spaceCount = 0;
		for (let i = 0; i < charsInput.length; i++) {
			const char = charsInput[i], charCode = extractCharCode(char);
			if (/(?:\s)/.test(char) && (lastBreakPos = i, lastBreakWidth = lastLineWidth, spaceCount++), char === "\r" || char === `
`) {
				lineWidths.push(lastLineWidth), lineSpaces.push(-1), maxLineWidth = Math.max(maxLineWidth, lastLineWidth), ++line, ++spacesRemoved, pos.x = 0, pos.y += data.lineHeight, prevCharCode = null, spaceCount = 0;
				continue;
			}
			const charData = data.chars[charCode];
			if (!charData) continue;
			prevCharCode && charData.kerning[prevCharCode] && (pos.x += charData.kerning[prevCharCode]);
			const charRenderData = charRenderDataPool.pop() || {
				texture: Texture.EMPTY,
				line: 0,
				charCode: 0,
				prevSpaces: 0,
				position: new Point()
			};
			charRenderData.texture = charData.texture, charRenderData.line = line, charRenderData.charCode = charCode, charRenderData.position.x = Math.round(pos.x + charData.xOffset + this._letterSpacing / 2), charRenderData.position.y = Math.round(pos.y + charData.yOffset), charRenderData.prevSpaces = spaceCount, chars.push(charRenderData), lastLineWidth = charRenderData.position.x + Math.max(charData.xAdvance - charData.xOffset, charData.texture.orig.width), pos.x += charData.xAdvance + this._letterSpacing, maxLineHeight = Math.max(maxLineHeight, charData.yOffset + charData.texture.height), prevCharCode = charCode, lastBreakPos !== -1 && maxWidth > 0 && pos.x > maxWidth && (++spacesRemoved, removeItems(chars, 1 + lastBreakPos - spacesRemoved, 1 + i - lastBreakPos), i = lastBreakPos, lastBreakPos = -1, lineWidths.push(lastBreakWidth), lineSpaces.push(chars.length > 0 ? chars[chars.length - 1].prevSpaces : 0), maxLineWidth = Math.max(maxLineWidth, lastBreakWidth), line++, pos.x = 0, pos.y += data.lineHeight, prevCharCode = null, spaceCount = 0);
		}
		const lastChar = charsInput[charsInput.length - 1];
		lastChar !== "\r" && lastChar !== `
` && (/(?:\s)/.test(lastChar) && (lastLineWidth = lastBreakWidth), lineWidths.push(lastLineWidth), maxLineWidth = Math.max(maxLineWidth, lastLineWidth), lineSpaces.push(-1));
		const lineAlignOffsets = [];
		for (let i = 0; i <= line; i++) {
			let alignOffset = 0;
			this._align === "right" ? alignOffset = maxLineWidth - lineWidths[i] : this._align === "center" ? alignOffset = (maxLineWidth - lineWidths[i]) / 2 : this._align === "justify" && (alignOffset = lineSpaces[i] < 0 ? 0 : (maxLineWidth - lineWidths[i]) / lineSpaces[i]), lineAlignOffsets.push(alignOffset);
		}
		const lenChars = chars.length, pagesMeshData = {}, newPagesMeshData = [], activePagesMeshData = this._activePagesMeshData;
		pageMeshDataPool.push(...activePagesMeshData);
		for (let i = 0; i < lenChars; i++) {
			const texture = chars[i].texture, baseTextureUid = texture.baseTexture.uid;
			if (!pagesMeshData[baseTextureUid]) {
				let pageMeshData = pageMeshDataPool.pop();
				if (!pageMeshData) {
					const geometry = new MeshGeometry();
					let material, meshBlendMode;
					data.distanceFieldType === "none" ? (material = new MeshMaterial(Texture.EMPTY), meshBlendMode = BLEND_MODES.NORMAL) : (material = new MeshMaterial(Texture.EMPTY, {
						program: Program.from(msdfVert, msdfFrag),
						uniforms: { uFWidth: 0 }
					}), meshBlendMode = BLEND_MODES.NORMAL_NPM);
					const mesh = new Mesh(geometry, material);
					mesh.blendMode = meshBlendMode, pageMeshData = {
						index: 0,
						indexCount: 0,
						vertexCount: 0,
						uvsCount: 0,
						total: 0,
						mesh,
						vertices: null,
						uvs: null,
						indices: null
					};
				}
				pageMeshData.index = 0, pageMeshData.indexCount = 0, pageMeshData.vertexCount = 0, pageMeshData.uvsCount = 0, pageMeshData.total = 0;
				const { _textureCache } = this;
				_textureCache[baseTextureUid] = _textureCache[baseTextureUid] || new Texture(texture.baseTexture), pageMeshData.mesh.texture = _textureCache[baseTextureUid], pageMeshData.mesh.tint = this._tintColor.value, newPagesMeshData.push(pageMeshData), pagesMeshData[baseTextureUid] = pageMeshData;
			}
			pagesMeshData[baseTextureUid].total++;
		}
		for (let i = 0; i < activePagesMeshData.length; i++) newPagesMeshData.includes(activePagesMeshData[i]) || this.removeChild(activePagesMeshData[i].mesh);
		for (let i = 0; i < newPagesMeshData.length; i++) newPagesMeshData[i].mesh.parent !== this && this.addChild(newPagesMeshData[i].mesh);
		this._activePagesMeshData = newPagesMeshData;
		for (const i in pagesMeshData) {
			const pageMeshData = pagesMeshData[i], total = pageMeshData.total;
			if (!(pageMeshData.indices?.length > 6 * total) || pageMeshData.vertices.length < Mesh.BATCHABLE_SIZE * 2) pageMeshData.vertices = new Float32Array(8 * total), pageMeshData.uvs = new Float32Array(8 * total), pageMeshData.indices = new Uint16Array(6 * total);
			else {
				const total2 = pageMeshData.total, vertices = pageMeshData.vertices;
				for (let i2 = total2 * 4 * 2; i2 < vertices.length; i2++) vertices[i2] = 0;
			}
			pageMeshData.mesh.size = 6 * total;
		}
		for (let i = 0; i < lenChars; i++) {
			const char = chars[i];
			let offset = char.position.x + lineAlignOffsets[char.line] * (this._align === "justify" ? char.prevSpaces : 1);
			this._roundPixels && (offset = Math.round(offset));
			const xPos = offset * scale, yPos = char.position.y * scale, texture = char.texture, pageMesh = pagesMeshData[texture.baseTexture.uid], textureFrame = texture.frame, textureUvs = texture._uvs, index = pageMesh.index++;
			pageMesh.indices[index * 6 + 0] = 0 + index * 4, pageMesh.indices[index * 6 + 1] = 1 + index * 4, pageMesh.indices[index * 6 + 2] = 2 + index * 4, pageMesh.indices[index * 6 + 3] = 0 + index * 4, pageMesh.indices[index * 6 + 4] = 2 + index * 4, pageMesh.indices[index * 6 + 5] = 3 + index * 4, pageMesh.vertices[index * 8 + 0] = xPos, pageMesh.vertices[index * 8 + 1] = yPos, pageMesh.vertices[index * 8 + 2] = xPos + textureFrame.width * scale, pageMesh.vertices[index * 8 + 3] = yPos, pageMesh.vertices[index * 8 + 4] = xPos + textureFrame.width * scale, pageMesh.vertices[index * 8 + 5] = yPos + textureFrame.height * scale, pageMesh.vertices[index * 8 + 6] = xPos, pageMesh.vertices[index * 8 + 7] = yPos + textureFrame.height * scale, pageMesh.uvs[index * 8 + 0] = textureUvs.x0, pageMesh.uvs[index * 8 + 1] = textureUvs.y0, pageMesh.uvs[index * 8 + 2] = textureUvs.x1, pageMesh.uvs[index * 8 + 3] = textureUvs.y1, pageMesh.uvs[index * 8 + 4] = textureUvs.x2, pageMesh.uvs[index * 8 + 5] = textureUvs.y2, pageMesh.uvs[index * 8 + 6] = textureUvs.x3, pageMesh.uvs[index * 8 + 7] = textureUvs.y3;
		}
		this._textWidth = maxLineWidth * scale, this._textHeight = (pos.y + data.lineHeight) * scale;
		for (const i in pagesMeshData) {
			const pageMeshData = pagesMeshData[i];
			if (this.anchor.x !== 0 || this.anchor.y !== 0) {
				let vertexCount = 0;
				const anchorOffsetX = this._textWidth * this.anchor.x, anchorOffsetY = this._textHeight * this.anchor.y;
				for (let i2 = 0; i2 < pageMeshData.total; i2++) pageMeshData.vertices[vertexCount++] -= anchorOffsetX, pageMeshData.vertices[vertexCount++] -= anchorOffsetY, pageMeshData.vertices[vertexCount++] -= anchorOffsetX, pageMeshData.vertices[vertexCount++] -= anchorOffsetY, pageMeshData.vertices[vertexCount++] -= anchorOffsetX, pageMeshData.vertices[vertexCount++] -= anchorOffsetY, pageMeshData.vertices[vertexCount++] -= anchorOffsetX, pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
			}
			this._maxLineHeight = maxLineHeight * scale;
			const vertexBuffer = pageMeshData.mesh.geometry.getBuffer("aVertexPosition"), textureBuffer = pageMeshData.mesh.geometry.getBuffer("aTextureCoord"), indexBuffer = pageMeshData.mesh.geometry.getIndex();
			vertexBuffer.data = pageMeshData.vertices, textureBuffer.data = pageMeshData.uvs, indexBuffer.data = pageMeshData.indices, vertexBuffer.update(), textureBuffer.update(), indexBuffer.update();
		}
		for (let i = 0; i < chars.length; i++) charRenderDataPool.push(chars[i]);
		this._font = data, this.dirty = !1;
	}
	updateTransform() {
		this.validate(), this.containerUpdateTransform();
	}
	_render(renderer) {
		this._autoResolution && this._resolution !== renderer.resolution && (this._resolution = renderer.resolution, this.dirty = !0);
		const { distanceFieldRange, distanceFieldType, size } = BitmapFont.available[this._fontName];
		if (distanceFieldType !== "none") {
			const { a, b, c, d } = this.worldTransform, dx = Math.sqrt(a * a + b * b), dy = Math.sqrt(c * c + d * d), worldScale = (Math.abs(dx) + Math.abs(dy)) / 2, fontScale = this.fontSize / size, resolution = renderer._view.resolution;
			for (const mesh of this._activePagesMeshData) mesh.mesh.shader.uniforms.uFWidth = worldScale * distanceFieldRange * fontScale * resolution;
		}
		super._render(renderer);
	}
	/**
	* Validates text before calling parent's getLocalBounds
	* @returns - The rectangular bounding area
	*/
	getLocalBounds() {
		return this.validate(), super.getLocalBounds();
	}
	/**
	* Updates text when needed
	* @private
	*/
	validate() {
		const font = BitmapFont.available[this._fontName];
		if (!font) throw new Error(`Missing BitmapFont "${this._fontName}"`);
		this._font !== font && (this.dirty = !0), this.dirty && this.updateText();
	}
	/**
	* The tint of the BitmapText object.
	* @default 0xffffff
	*/
	get tint() {
		return this._tintColor.value;
	}
	set tint(value) {
		if (this.tint !== value) {
			this._tintColor.setValue(value);
			for (let i = 0; i < this._activePagesMeshData.length; i++) this._activePagesMeshData[i].mesh.tint = value;
		}
	}
	/**
	* The alignment of the BitmapText object.
	* @member {string}
	* @default 'left'
	*/
	get align() {
		return this._align;
	}
	set align(value) {
		this._align !== value && (this._align = value, this.dirty = !0);
	}
	/** The name of the BitmapFont. */
	get fontName() {
		return this._fontName;
	}
	set fontName(value) {
		if (!BitmapFont.available[value]) throw new Error(`Missing BitmapFont "${value}"`);
		this._fontName !== value && (this._fontName = value, this.dirty = !0);
	}
	/** The size of the font to display. */
	get fontSize() {
		return this._fontSize ?? BitmapFont.available[this._fontName].size;
	}
	set fontSize(value) {
		this._fontSize !== value && (this._fontSize = value, this.dirty = !0);
	}
	/**
	* The anchor sets the origin point of the text.
	*
	* The default is `(0,0)`, this means the text's origin is the top left.
	*
	* Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
	*
	* Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
	*/
	get anchor() {
		return this._anchor;
	}
	set anchor(value) {
		typeof value == "number" ? this._anchor.set(value) : this._anchor.copyFrom(value);
	}
	/** The text of the BitmapText object. */
	get text() {
		return this._text;
	}
	set text(text) {
		text = String(text ?? ""), this._text !== text && (this._text = text, this.dirty = !0);
	}
	/**
	* The max width of this bitmap text in pixels. If the text provided is longer than the
	* value provided, line breaks will be automatically inserted in the last whitespace.
	* Disable by setting the value to 0.
	*/
	get maxWidth() {
		return this._maxWidth;
	}
	set maxWidth(value) {
		this._maxWidth !== value && (this._maxWidth = value, this.dirty = !0);
	}
	/**
	* The max line height. This is useful when trying to use the total height of the Text,
	* i.e. when trying to vertically align.
	* @readonly
	*/
	get maxLineHeight() {
		return this.validate(), this._maxLineHeight;
	}
	/**
	* The width of the overall text, different from fontSize,
	* which is defined in the style object.
	* @readonly
	*/
	get textWidth() {
		return this.validate(), this._textWidth;
	}
	/** Additional space between characters. */
	get letterSpacing() {
		return this._letterSpacing;
	}
	set letterSpacing(value) {
		this._letterSpacing !== value && (this._letterSpacing = value, this.dirty = !0);
	}
	/**
	* If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
	* Advantages can include sharper image quality (like text) and faster rendering on canvas.
	* The main disadvantage is movement of objects may appear less smooth.
	* To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
	* @default PIXI.settings.ROUND_PIXELS
	*/
	get roundPixels() {
		return this._roundPixels;
	}
	set roundPixels(value) {
		value !== this._roundPixels && (this._roundPixels = value, this.dirty = !0);
	}
	/**
	* The height of the overall text, different from fontSize,
	* which is defined in the style object.
	* @readonly
	*/
	get textHeight() {
		return this.validate(), this._textHeight;
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
	destroy(options) {
		const { _textureCache } = this, pageMeshDataPool = BitmapFont.available[this._fontName].distanceFieldType === "none" ? pageMeshDataDefaultPageMeshData : pageMeshDataMSDFPageMeshData;
		pageMeshDataPool.push(...this._activePagesMeshData);
		for (const pageMeshData of this._activePagesMeshData) this.removeChild(pageMeshData.mesh);
		this._activePagesMeshData = [], pageMeshDataPool.filter((page) => _textureCache[page.mesh.texture.baseTexture.uid]).forEach((page) => {
			page.mesh.texture = Texture.EMPTY;
		});
		for (const id in _textureCache) _textureCache[id].destroy(), delete _textureCache[id];
		this._font = null, this._tintColor = null, this._textureCache = null, super.destroy(options);
	}
};
_BitmapText.styleDefaults = {
	align: "left",
	tint: 16777215,
	maxWidth: 0,
	letterSpacing: 0
};
//#endregion
//#region ../../opt/butl/node_modules/@pixi/text-bitmap/lib/loadBitmapFont.mjs
var validExtensions = [".xml", ".fnt"];
var loadBitmapFont = {
	extension: {
		type: ExtensionType.LoadParser,
		priority: LoaderParserPriority.Normal
	},
	name: "loadBitmapFont",
	test(url) {
		return validExtensions.includes(path.extname(url).toLowerCase());
	},
	async testParse(data) {
		return TextFormat.test(data) || XMLStringFormat.test(data);
	},
	async parse(asset, data, loader) {
		const fontData = TextFormat.test(asset) ? TextFormat.parse(asset) : XMLStringFormat.parse(asset), { src } = data, { page: pages } = fontData, textureUrls = [];
		for (let i = 0; i < pages.length; ++i) {
			const pageFile = pages[i].file;
			let imagePath = path.join(path.dirname(src), pageFile);
			imagePath = copySearchParams(imagePath, src), textureUrls.push(imagePath);
		}
		const loadedTextures = await loader.load(textureUrls), textures = textureUrls.map((url) => loadedTextures[url]);
		return BitmapFont.install(fontData, textures, !0);
	},
	async load(url, _options) {
		return (await settings.ADAPTER.fetch(url)).text();
	},
	unload(bitmapFont) {
		bitmapFont.destroy();
	}
};
extensions.add(loadBitmapFont);
//#endregion
export {};
