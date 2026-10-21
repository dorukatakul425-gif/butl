import { $ as getResolutionOfUrl, K as BaseTexture, X as ExtensionType, Y as ViewableBuffer, Z as extensions$1, bt as TYPES, dt as path, ht as ALPHA_MODES, mt as settings, q as BufferResource, vt as FORMATS, yt as MIPMAP_MODES } from "./@pixi-spine/base+[...].mjs";
import { i as checkExtension, n as LoaderParserPriority, t as createTexture } from "./pixi__assets.mjs";
//#region node_modules/@pixi/compressed-textures/lib/const.mjs
var INTERNAL_FORMATS = /* @__PURE__ */ ((INTERNAL_FORMATS2) => (INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA8_ETC2_EAC = 37496] = "COMPRESSED_RGBA8_ETC2_EAC", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SRGB8_ETC2 = 37493] = "COMPRESSED_SRGB8_ETC2", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB_ATC_WEBGL = 35986] = "COMPRESSED_RGB_ATC_WEBGL", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35987] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_ASTC_4x4_KHR = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGBA_BPTC_UNORM_EXT = 36492] = "COMPRESSED_RGBA_BPTC_UNORM_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = 36493] = "COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT = 36494] = "COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT", INTERNAL_FORMATS2[INTERNAL_FORMATS2.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT = 36495] = "COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT", INTERNAL_FORMATS2))(INTERNAL_FORMATS || {});
var INTERNAL_FORMAT_TO_BYTES_PER_PIXEL = {
	33776: .5,
	33777: .5,
	33778: 1,
	33779: 1,
	35916: .5,
	35917: .5,
	35918: 1,
	35919: 1,
	37488: .5,
	37489: .5,
	37490: 1,
	37491: 1,
	37492: .5,
	37496: 1,
	37493: .5,
	37497: 1,
	37494: .5,
	37495: .5,
	35840: .5,
	35842: .5,
	35841: .25,
	35843: .25,
	36196: .5,
	35986: .5,
	35987: 1,
	34798: 1,
	37808: 1,
	36492: 1,
	36493: 1,
	36494: 1,
	36495: 1
};
//#endregion
//#region node_modules/@pixi/compressed-textures/lib/loaders/detectCompressedTextures.mjs
var storedGl;
var extensions;
function getCompressedTextureExtensions() {
	extensions = {
		bptc: storedGl.getExtension("EXT_texture_compression_bptc"),
		astc: storedGl.getExtension("WEBGL_compressed_texture_astc"),
		etc: storedGl.getExtension("WEBGL_compressed_texture_etc"),
		s3tc: storedGl.getExtension("WEBGL_compressed_texture_s3tc"),
		s3tc_sRGB: storedGl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
		pvrtc: storedGl.getExtension("WEBGL_compressed_texture_pvrtc") || storedGl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
		etc1: storedGl.getExtension("WEBGL_compressed_texture_etc1"),
		atc: storedGl.getExtension("WEBGL_compressed_texture_atc")
	};
}
var detectCompressedTextures = {
	extension: {
		type: ExtensionType.DetectionParser,
		priority: 2
	},
	test: async () => {
		const gl = settings.ADAPTER.createCanvas().getContext("webgl");
		return gl ? (storedGl = gl, !0) : (console.warn("WebGL not available for compressed textures."), !1);
	},
	add: async (formats) => {
		extensions || getCompressedTextureExtensions();
		const textureFormats = [];
		for (const extensionName in extensions) extensions[extensionName] && textureFormats.push(extensionName);
		return [...textureFormats, ...formats];
	},
	remove: async (formats) => (extensions || getCompressedTextureExtensions(), formats.filter((f) => !(f in extensions)))
};
extensions$1.add(detectCompressedTextures);
//#endregion
//#region node_modules/@pixi/compressed-textures/lib/resources/BlobResource.mjs
var BlobResource = class extends BufferResource {
	/**
	* @param source - The buffer/URL of the texture file.
	* @param {PIXI.IBlobResourceOptions} [options]
	* @param {boolean} [options.autoLoad=false] - Whether to fetch the data immediately;
	*  you can fetch it later via {@link PIXI.BlobResource#load}.
	* @param {number} [options.width=1] - The width in pixels.
	* @param {number} [options.height=1] - The height in pixels.
	* @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
	*/
	constructor(source, options = {
		width: 1,
		height: 1,
		autoLoad: !0
	}) {
		let origin, data;
		typeof source == "string" ? (origin = source, data = /* @__PURE__ */ new Uint8Array()) : (origin = null, data = source), super(data, options), this.origin = origin, this.buffer = data ? new ViewableBuffer(data) : null, this._load = null, this.loaded = !1, this.origin !== null && options.autoLoad !== !1 && this.load(), this.origin === null && this.buffer && (this._load = Promise.resolve(this), this.loaded = !0, this.onBlobLoaded(this.buffer.rawBinaryData));
	}
	onBlobLoaded(_data) {}
	/** Loads the blob */
	load() {
		return this._load ? this._load : (this._load = fetch(this.origin).then((response) => response.blob()).then((blob) => blob.arrayBuffer()).then((arrayBuffer) => (this.data = new Uint32Array(arrayBuffer), this.buffer = new ViewableBuffer(arrayBuffer), this.loaded = !0, this.onBlobLoaded(arrayBuffer), this.update(), this)), this._load);
	}
};
//#endregion
//#region node_modules/@pixi/compressed-textures/lib/resources/CompressedTextureResource.mjs
var CompressedTextureResource = class CompressedTextureResource extends BlobResource {
	/**
	* @param source - the buffer/URL holding the compressed texture data
	* @param options
	* @param {PIXI.INTERNAL_FORMATS} options.format - the compression format
	* @param {number} options.width - the image width in pixels.
	* @param {number} options.height - the image height in pixels.
	* @param {number} [options.level=1] - the mipmap levels stored in the compressed texture, including level 0.
	* @param {number} [options.levelBuffers] - the buffers for each mipmap level. `CompressedTextureResource` can allows you
	*      to pass `null` for `source`, for cases where each level is stored in non-contiguous memory.
	*/
	constructor(source, options) {
		super(source, options), this.format = options.format, this.levels = options.levels || 1, this._width = options.width, this._height = options.height, this._extension = CompressedTextureResource._formatToExtension(this.format), (options.levelBuffers || this.buffer) && (this._levelBuffers = options.levelBuffers || CompressedTextureResource._createLevelBuffers(source instanceof Uint8Array ? source : this.buffer.uint8View, this.format, this.levels, 4, 4, this.width, this.height));
	}
	/**
	* @override
	* @param renderer - A reference to the current renderer
	* @param _texture - the texture
	* @param _glTexture - texture instance for this webgl context
	*/
	upload(renderer, _texture, _glTexture) {
		const gl = renderer.gl;
		if (!renderer.context.extensions[this._extension]) throw new Error(`${this._extension} textures are not supported on the current machine`);
		if (!this._levelBuffers) return !1;
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
		for (let i = 0, j = this.levels; i < j; i++) {
			const { levelID, levelWidth, levelHeight, levelBuffer } = this._levelBuffers[i];
			gl.compressedTexImage2D(gl.TEXTURE_2D, levelID, this.format, levelWidth, levelHeight, 0, levelBuffer);
		}
		return !0;
	}
	/** @protected */
	onBlobLoaded() {
		this._levelBuffers = CompressedTextureResource._createLevelBuffers(this.buffer.uint8View, this.format, this.levels, 4, 4, this.width, this.height);
	}
	/**
	* Returns the key (to ContextSystem#extensions) for the WebGL extension supporting the compression format
	* @private
	* @param format - the compression format to get the extension for.
	*/
	static _formatToExtension(format) {
		if (format >= 33776 && format <= 33779) return "s3tc";
		if (format >= 35916 && format <= 35919) return "s3tc_sRGB";
		if (format >= 37488 && format <= 37497) return "etc";
		if (format >= 35840 && format <= 35843) return "pvrtc";
		if (format === 36196) return "etc1";
		if (format === 35986 || format === 35987 || format === 34798) return "atc";
		if (format >= 36492 && format <= 36495) return "bptc";
		if (format === 37808) return "astc";
		throw new Error(`Invalid (compressed) texture format given: ${format}`);
	}
	/**
	* Pre-creates buffer views for each mipmap level
	* @private
	* @param buffer -
	* @param format - compression formats
	* @param levels - mipmap levels
	* @param blockWidth -
	* @param blockHeight -
	* @param imageWidth - width of the image in pixels
	* @param imageHeight - height of the image in pixels
	*/
	static _createLevelBuffers(buffer, format, levels, blockWidth, blockHeight, imageWidth, imageHeight) {
		const buffers = new Array(levels);
		let offset = buffer.byteOffset, levelWidth = imageWidth, levelHeight = imageHeight, alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1), alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1), levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format];
		for (let i = 0; i < levels; i++) buffers[i] = {
			levelID: i,
			levelWidth: levels > 1 ? levelWidth : alignedLevelWidth,
			levelHeight: levels > 1 ? levelHeight : alignedLevelHeight,
			levelBuffer: new Uint8Array(buffer.buffer, offset, levelSize)
		}, offset += levelSize, levelWidth = levelWidth >> 1 || 1, levelHeight = levelHeight >> 1 || 1, alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1), alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1), levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format];
		return buffers;
	}
};
//#endregion
//#region node_modules/@pixi/compressed-textures/lib/parsers/parseDDS.mjs
var DDS_HEADER_SIZE = 124;
var DDS_HEADER_PF_SIZE = 32;
var DDS_HEADER_DX10_SIZE = 20;
var DDS_MAGIC = 542327876;
var DDS_FIELDS = {
	SIZE: 1,
	FLAGS: 2,
	HEIGHT: 3,
	WIDTH: 4,
	MIPMAP_COUNT: 7,
	PIXEL_FORMAT: 19
};
var DDS_PF_FIELDS = {
	SIZE: 0,
	FLAGS: 1,
	FOURCC: 2,
	RGB_BITCOUNT: 3,
	R_BIT_MASK: 4,
	G_BIT_MASK: 5,
	B_BIT_MASK: 6,
	A_BIT_MASK: 7
};
var DDS_DX10_FIELDS = {
	DXGI_FORMAT: 0,
	RESOURCE_DIMENSION: 1,
	MISC_FLAG: 2,
	ARRAY_SIZE: 3,
	MISC_FLAGS2: 4
};
var PF_FLAGS = 1;
var DDPF_ALPHA = 2;
var DDPF_FOURCC = 4;
var DDPF_RGB = 64;
var DDPF_YUV = 512;
var DDPF_LUMINANCE = 131072;
var FOURCC_DXT1 = 827611204;
var FOURCC_DXT3 = 861165636;
var FOURCC_DXT5 = 894720068;
var FOURCC_DX10 = 808540228;
var DDS_RESOURCE_MISC_TEXTURECUBE = 4;
var FOURCC_TO_FORMAT = {
	[FOURCC_DXT1]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
	[FOURCC_DXT3]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
	[FOURCC_DXT5]: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT
};
var DXGI_TO_FORMAT = {
	70: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
	71: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
	73: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
	74: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
	76: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
	77: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
	72: INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
	75: INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
	78: INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT,
	96: INTERNAL_FORMATS.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT,
	95: INTERNAL_FORMATS.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT,
	98: INTERNAL_FORMATS.COMPRESSED_RGBA_BPTC_UNORM_EXT,
	99: INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
};
function parseDDS(arrayBuffer) {
	const data = new Uint32Array(arrayBuffer);
	if (data[0] !== DDS_MAGIC) throw new Error("Invalid DDS file magic word");
	const header = new Uint32Array(arrayBuffer, 0, DDS_HEADER_SIZE / Uint32Array.BYTES_PER_ELEMENT), height = header[DDS_FIELDS.HEIGHT], width = header[DDS_FIELDS.WIDTH], mipmapCount = header[DDS_FIELDS.MIPMAP_COUNT], pixelFormat = new Uint32Array(arrayBuffer, DDS_FIELDS.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT, DDS_HEADER_PF_SIZE / Uint32Array.BYTES_PER_ELEMENT), formatFlags = pixelFormat[PF_FLAGS];
	if (formatFlags & DDPF_FOURCC) {
		const fourCC = pixelFormat[DDS_PF_FIELDS.FOURCC];
		if (fourCC !== FOURCC_DX10) {
			const internalFormat2 = FOURCC_TO_FORMAT[fourCC];
			return [new CompressedTextureResource(new Uint8Array(arrayBuffer, 128), {
				format: internalFormat2,
				width,
				height,
				levels: mipmapCount
			})];
		}
		const dx10Header = new Uint32Array(data.buffer, 128, DDS_HEADER_DX10_SIZE / Uint32Array.BYTES_PER_ELEMENT), dxgiFormat = dx10Header[DDS_DX10_FIELDS.DXGI_FORMAT], resourceDimension = dx10Header[DDS_DX10_FIELDS.RESOURCE_DIMENSION], miscFlag = dx10Header[DDS_DX10_FIELDS.MISC_FLAG], arraySize = dx10Header[DDS_DX10_FIELDS.ARRAY_SIZE], internalFormat = DXGI_TO_FORMAT[dxgiFormat];
		if (internalFormat === void 0) throw new Error(`DDSParser cannot parse texture data with DXGI format ${dxgiFormat}`);
		if (miscFlag === DDS_RESOURCE_MISC_TEXTURECUBE) throw new Error("DDSParser does not support cubemap textures");
		if (resourceDimension === 6) throw new Error("DDSParser does not supported 3D texture data");
		const imageBuffers = new Array(), dataOffset = 148;
		if (arraySize === 1) imageBuffers.push(new Uint8Array(arrayBuffer, dataOffset));
		else {
			const pixelSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[internalFormat];
			let imageSize = 0, levelWidth = width, levelHeight = height;
			for (let i = 0; i < mipmapCount; i++) {
				const levelSize = Math.max(1, levelWidth + 3 & -4) * Math.max(1, levelHeight + 3 & -4) * pixelSize;
				imageSize += levelSize, levelWidth = levelWidth >>> 1, levelHeight = levelHeight >>> 1;
			}
			let imageOffset = dataOffset;
			for (let i = 0; i < arraySize; i++) imageBuffers.push(new Uint8Array(arrayBuffer, imageOffset, imageSize)), imageOffset += imageSize;
		}
		return imageBuffers.map((buffer) => new CompressedTextureResource(buffer, {
			format: internalFormat,
			width,
			height,
			levels: mipmapCount
		}));
	}
	throw formatFlags & DDPF_RGB ? /* @__PURE__ */ new Error("DDSParser does not support uncompressed texture data.") : formatFlags & DDPF_YUV ? /* @__PURE__ */ new Error("DDSParser does not supported YUV uncompressed texture data.") : formatFlags & DDPF_LUMINANCE ? /* @__PURE__ */ new Error("DDSParser does not support single-channel (lumninance) texture data!") : formatFlags & DDPF_ALPHA ? /* @__PURE__ */ new Error("DDSParser does not support single-channel (alpha) texture data!") : /* @__PURE__ */ new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
//#endregion
//#region node_modules/@pixi/compressed-textures/lib/parsers/parseKTX.mjs
var FILE_IDENTIFIER = [
	171,
	75,
	84,
	88,
	32,
	49,
	49,
	187,
	13,
	10,
	26,
	10
];
var ENDIANNESS = 67305985;
var KTX_FIELDS = {
	FILE_IDENTIFIER: 0,
	ENDIANNESS: 12,
	GL_TYPE: 16,
	GL_TYPE_SIZE: 20,
	GL_FORMAT: 24,
	GL_INTERNAL_FORMAT: 28,
	GL_BASE_INTERNAL_FORMAT: 32,
	PIXEL_WIDTH: 36,
	PIXEL_HEIGHT: 40,
	PIXEL_DEPTH: 44,
	NUMBER_OF_ARRAY_ELEMENTS: 48,
	NUMBER_OF_FACES: 52,
	NUMBER_OF_MIPMAP_LEVELS: 56,
	BYTES_OF_KEY_VALUE_DATA: 60
};
var FILE_HEADER_SIZE = 64;
var TYPES_TO_BYTES_PER_COMPONENT = {
	[TYPES.UNSIGNED_BYTE]: 1,
	[TYPES.UNSIGNED_SHORT]: 2,
	[TYPES.INT]: 4,
	[TYPES.UNSIGNED_INT]: 4,
	[TYPES.FLOAT]: 4,
	[TYPES.HALF_FLOAT]: 8
};
var FORMATS_TO_COMPONENTS = {
	[FORMATS.RGBA]: 4,
	[FORMATS.RGB]: 3,
	[FORMATS.RG]: 2,
	[FORMATS.RED]: 1,
	[FORMATS.LUMINANCE]: 1,
	[FORMATS.LUMINANCE_ALPHA]: 2,
	[FORMATS.ALPHA]: 1
};
var TYPES_TO_BYTES_PER_PIXEL = {
	[TYPES.UNSIGNED_SHORT_4_4_4_4]: 2,
	[TYPES.UNSIGNED_SHORT_5_5_5_1]: 2,
	[TYPES.UNSIGNED_SHORT_5_6_5]: 2
};
function parseKTX(url, arrayBuffer, loadKeyValueData = !1) {
	const dataView = new DataView(arrayBuffer);
	if (!validate(url, dataView)) return null;
	const littleEndian = dataView.getUint32(KTX_FIELDS.ENDIANNESS, !0) === ENDIANNESS, glType = dataView.getUint32(KTX_FIELDS.GL_TYPE, littleEndian), glFormat = dataView.getUint32(KTX_FIELDS.GL_FORMAT, littleEndian), glInternalFormat = dataView.getUint32(KTX_FIELDS.GL_INTERNAL_FORMAT, littleEndian), pixelWidth = dataView.getUint32(KTX_FIELDS.PIXEL_WIDTH, littleEndian), pixelHeight = dataView.getUint32(KTX_FIELDS.PIXEL_HEIGHT, littleEndian) || 1, pixelDepth = dataView.getUint32(KTX_FIELDS.PIXEL_DEPTH, littleEndian) || 1, numberOfArrayElements = dataView.getUint32(KTX_FIELDS.NUMBER_OF_ARRAY_ELEMENTS, littleEndian) || 1, numberOfFaces = dataView.getUint32(KTX_FIELDS.NUMBER_OF_FACES, littleEndian), numberOfMipmapLevels = dataView.getUint32(KTX_FIELDS.NUMBER_OF_MIPMAP_LEVELS, littleEndian), bytesOfKeyValueData = dataView.getUint32(KTX_FIELDS.BYTES_OF_KEY_VALUE_DATA, littleEndian);
	if (pixelHeight === 0 || pixelDepth !== 1) throw new Error("Only 2D textures are supported");
	if (numberOfFaces !== 1) throw new Error("CubeTextures are not supported by KTXLoader yet!");
	if (numberOfArrayElements !== 1) throw new Error("WebGL does not support array textures");
	const blockWidth = 4, blockHeight = 4, alignedWidth = pixelWidth + 3 & -4, alignedHeight = pixelHeight + 3 & -4, imageBuffers = new Array(numberOfArrayElements);
	let imagePixels = pixelWidth * pixelHeight;
	glType === 0 && (imagePixels = alignedWidth * alignedHeight);
	let imagePixelByteSize;
	if (glType !== 0 ? TYPES_TO_BYTES_PER_COMPONENT[glType] ? imagePixelByteSize = TYPES_TO_BYTES_PER_COMPONENT[glType] * FORMATS_TO_COMPONENTS[glFormat] : imagePixelByteSize = TYPES_TO_BYTES_PER_PIXEL[glType] : imagePixelByteSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[glInternalFormat], imagePixelByteSize === void 0) throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
	const kvData = loadKeyValueData ? parseKvData(dataView, bytesOfKeyValueData, littleEndian) : null;
	let mipByteSize = imagePixels * imagePixelByteSize, mipWidth = pixelWidth, mipHeight = pixelHeight, alignedMipWidth = alignedWidth, alignedMipHeight = alignedHeight, imageOffset = FILE_HEADER_SIZE + bytesOfKeyValueData;
	for (let mipmapLevel = 0; mipmapLevel < numberOfMipmapLevels; mipmapLevel++) {
		const imageSize = dataView.getUint32(imageOffset, littleEndian);
		let elementOffset = imageOffset + 4;
		for (let arrayElement = 0; arrayElement < numberOfArrayElements; arrayElement++) {
			let mips = imageBuffers[arrayElement];
			mips || (mips = imageBuffers[arrayElement] = new Array(numberOfMipmapLevels)), mips[mipmapLevel] = {
				levelID: mipmapLevel,
				levelWidth: numberOfMipmapLevels > 1 || glType !== 0 ? mipWidth : alignedMipWidth,
				levelHeight: numberOfMipmapLevels > 1 || glType !== 0 ? mipHeight : alignedMipHeight,
				levelBuffer: new Uint8Array(arrayBuffer, elementOffset, mipByteSize)
			}, elementOffset += mipByteSize;
		}
		imageOffset += imageSize + 4, imageOffset = imageOffset % 4 !== 0 ? imageOffset + 4 - imageOffset % 4 : imageOffset, mipWidth = mipWidth >> 1 || 1, mipHeight = mipHeight >> 1 || 1, alignedMipWidth = mipWidth + blockWidth - 1 & -4, alignedMipHeight = mipHeight + blockHeight - 1 & -4, mipByteSize = alignedMipWidth * alignedMipHeight * imagePixelByteSize;
	}
	return glType !== 0 ? {
		uncompressed: imageBuffers.map((levelBuffers) => {
			let buffer = levelBuffers[0].levelBuffer, convertToInt = !1;
			return glType === TYPES.FLOAT ? buffer = new Float32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4) : glType === TYPES.UNSIGNED_INT ? (convertToInt = !0, buffer = new Uint32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4)) : glType === TYPES.INT && (convertToInt = !0, buffer = new Int32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4)), {
				resource: new BufferResource(buffer, {
					width: levelBuffers[0].levelWidth,
					height: levelBuffers[0].levelHeight
				}),
				type: glType,
				format: convertToInt ? convertFormatToInteger(glFormat) : glFormat
			};
		}),
		kvData
	} : {
		compressed: imageBuffers.map((levelBuffers) => new CompressedTextureResource(null, {
			format: glInternalFormat,
			width: pixelWidth,
			height: pixelHeight,
			levels: numberOfMipmapLevels,
			levelBuffers
		})),
		kvData
	};
}
function validate(url, dataView) {
	for (let i = 0; i < FILE_IDENTIFIER.length; i++) if (dataView.getUint8(i) !== FILE_IDENTIFIER[i]) return console.error(`${url} is not a valid *.ktx file!`), !1;
	return !0;
}
function convertFormatToInteger(format) {
	switch (format) {
		case FORMATS.RGBA: return FORMATS.RGBA_INTEGER;
		case FORMATS.RGB: return FORMATS.RGB_INTEGER;
		case FORMATS.RG: return FORMATS.RG_INTEGER;
		case FORMATS.RED: return FORMATS.RED_INTEGER;
		default: return format;
	}
}
function parseKvData(dataView, bytesOfKeyValueData, littleEndian) {
	const kvData = /* @__PURE__ */ new Map();
	let bytesIntoKeyValueData = 0;
	for (; bytesIntoKeyValueData < bytesOfKeyValueData;) {
		const keyAndValueByteSize = dataView.getUint32(FILE_HEADER_SIZE + bytesIntoKeyValueData, littleEndian), keyAndValueByteOffset = FILE_HEADER_SIZE + bytesIntoKeyValueData + 4, valuePadding = 3 - (keyAndValueByteSize + 3) % 4;
		if (keyAndValueByteSize === 0 || keyAndValueByteSize > bytesOfKeyValueData - bytesIntoKeyValueData) {
			console.error("KTXLoader: keyAndValueByteSize out of bounds");
			break;
		}
		let keyNulByte = 0;
		for (; keyNulByte < keyAndValueByteSize && dataView.getUint8(keyAndValueByteOffset + keyNulByte) !== 0; keyNulByte++);
		if (keyNulByte === -1) {
			console.error("KTXLoader: Failed to find null byte terminating kvData key");
			break;
		}
		const key = new TextDecoder().decode(new Uint8Array(dataView.buffer, keyAndValueByteOffset, keyNulByte)), value = new DataView(dataView.buffer, keyAndValueByteOffset + keyNulByte + 1, keyAndValueByteSize - keyNulByte - 1);
		kvData.set(key, value), bytesIntoKeyValueData += 4 + keyAndValueByteSize + valuePadding;
	}
	return kvData;
}
//#endregion
//#region node_modules/@pixi/compressed-textures/lib/loaders/loadDDS.mjs
var loadDDS = {
	extension: {
		type: ExtensionType.LoadParser,
		priority: LoaderParserPriority.High
	},
	name: "loadDDS",
	test(url) {
		return checkExtension(url, ".dds");
	},
	async load(url, asset, loader) {
		const textures = parseDDS(await (await settings.ADAPTER.fetch(url)).arrayBuffer()).map((resource) => {
			const base = new BaseTexture(resource, {
				mipmap: MIPMAP_MODES.OFF,
				alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
				resolution: getResolutionOfUrl(url),
				...asset.data
			});
			return createTexture(base, loader, url);
		});
		return textures.length === 1 ? textures[0] : textures;
	},
	unload(texture) {
		Array.isArray(texture) ? texture.forEach((t) => t.destroy(!0)) : texture.destroy(!0);
	}
};
extensions$1.add(loadDDS);
//#endregion
//#region node_modules/@pixi/compressed-textures/lib/loaders/loadKTX.mjs
var loadKTX = {
	extension: {
		type: ExtensionType.LoadParser,
		priority: LoaderParserPriority.High
	},
	name: "loadKTX",
	test(url) {
		return checkExtension(url, ".ktx");
	},
	async load(url, asset, loader) {
		const { compressed, uncompressed, kvData } = parseKTX(url, await (await settings.ADAPTER.fetch(url)).arrayBuffer()), resources = compressed ?? uncompressed, options = {
			mipmap: MIPMAP_MODES.OFF,
			alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
			resolution: getResolutionOfUrl(url),
			...asset.data
		}, textures = resources.map((resource) => {
			resources === uncompressed && Object.assign(options, {
				type: resource.type,
				format: resource.format
			});
			const res = resource.resource ?? resource, base = new BaseTexture(res, options);
			return base.ktxKeyValueData = kvData, createTexture(base, loader, url);
		});
		return textures.length === 1 ? textures[0] : textures;
	},
	unload(texture) {
		Array.isArray(texture) ? texture.forEach((t) => t.destroy(!0)) : texture.destroy(!0);
	}
};
extensions$1.add(loadKTX);
//#endregion
//#region node_modules/@pixi/compressed-textures/lib/loaders/resolveCompressedTextureUrl.mjs
var knownFormats = [
	"s3tc",
	"s3tc_sRGB",
	"etc",
	"etc1",
	"pvrtc",
	"atc",
	"astc",
	"bptc"
];
var resolveCompressedTextureUrl = {
	extension: ExtensionType.ResolveParser,
	test: (value) => {
		const extension = path.extname(value).slice(1);
		return [
			"basis",
			"ktx",
			"dds"
		].includes(extension);
	},
	parse: (value) => {
		const parts = value.split("."), extension = parts.pop();
		if (["ktx", "dds"].includes(extension)) {
			const textureFormat = parts.pop();
			if (knownFormats.includes(textureFormat)) return {
				resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
				format: textureFormat,
				src: value
			};
		}
		return {
			resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? "1"),
			format: extension,
			src: value
		};
	}
};
extensions$1.add(resolveCompressedTextureUrl);
//#endregion
export {};
