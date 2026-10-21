import { I as Filter, _t as CLEAR_MODES } from "./@pixi-spine/base+[...].mjs";
//#region ../../opt/butl/node_modules/@pixi/filter-blur/lib/generateBlurFragSource.mjs
var GAUSSIAN_VALUES = {
	5: [
		.153388,
		.221461,
		.250301
	],
	7: [
		.071303,
		.131514,
		.189879,
		.214607
	],
	9: [
		.028532,
		.067234,
		.124009,
		.179044,
		.20236
	],
	11: [
		.0093,
		.028002,
		.065984,
		.121703,
		.175713,
		.198596
	],
	13: [
		.002406,
		.009255,
		.027867,
		.065666,
		.121117,
		.174868,
		.197641
	],
	15: [
		489e-6,
		.002403,
		.009246,
		.02784,
		.065602,
		.120999,
		.174697,
		.197448
	]
};
var fragTemplate = [
	"varying vec2 vBlurTexCoords[%size%];",
	"uniform sampler2D uSampler;",
	"void main(void)",
	"{",
	"    gl_FragColor = vec4(0.0);",
	"    %blur%",
	"}"
].join(`
`);
function generateBlurFragSource(kernelSize) {
	const kernel = GAUSSIAN_VALUES[kernelSize], halfLength = kernel.length;
	let fragSource = fragTemplate, blurLoop = "";
	const template = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;";
	let value;
	for (let i = 0; i < kernelSize; i++) {
		let blur = template.replace("%index%", i.toString());
		value = i, i >= halfLength && (value = kernelSize - i - 1), blur = blur.replace("%value%", kernel[value].toString()), blurLoop += blur, blurLoop += `
`;
	}
	return fragSource = fragSource.replace("%blur%", blurLoop), fragSource = fragSource.replace("%size%", kernelSize.toString()), fragSource;
}
//#endregion
//#region ../../opt/butl/node_modules/@pixi/filter-blur/lib/generateBlurVertSource.mjs
var vertTemplate = `
    attribute vec2 aVertexPosition;

    uniform mat3 projectionMatrix;

    uniform float strength;

    varying vec2 vBlurTexCoords[%size%];

    uniform vec4 inputSize;
    uniform vec4 outputFrame;

    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;
function generateBlurVertSource(kernelSize, x) {
	const halfLength = Math.ceil(kernelSize / 2);
	let vertSource = vertTemplate, blurLoop = "", template;
	x ? template = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);" : template = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
	for (let i = 0; i < kernelSize; i++) {
		let blur = template.replace("%index%", i.toString());
		blur = blur.replace("%sampleIndex%", `${i - (halfLength - 1)}.0`), blurLoop += blur, blurLoop += `
`;
	}
	return vertSource = vertSource.replace("%blur%", blurLoop), vertSource = vertSource.replace("%size%", kernelSize.toString()), vertSource;
}
//#endregion
//#region ../../opt/butl/node_modules/@pixi/filter-blur/lib/BlurFilterPass.mjs
var BlurFilterPass = class extends Filter {
	/**
	* @param horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
	* @param strength - The strength of the blur filter.
	* @param quality - The quality of the blur filter.
	* @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
	* @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
	*/
	constructor(horizontal, strength = 8, quality = 4, resolution = Filter.defaultResolution, kernelSize = 5) {
		const vertSrc = generateBlurVertSource(kernelSize, horizontal), fragSrc = generateBlurFragSource(kernelSize);
		super(vertSrc, fragSrc), this.horizontal = horizontal, this.resolution = resolution, this._quality = 0, this.quality = quality, this.blur = strength;
	}
	/**
	* Applies the filter.
	* @param filterManager - The manager.
	* @param input - The input target.
	* @param output - The output target.
	* @param clearMode - How to clear
	*/
	apply(filterManager, input, output, clearMode) {
		if (output ? this.horizontal ? this.uniforms.strength = 1 / output.width * (output.width / input.width) : this.uniforms.strength = 1 / output.height * (output.height / input.height) : this.horizontal ? this.uniforms.strength = 1 / filterManager.renderer.width * (filterManager.renderer.width / input.width) : this.uniforms.strength = 1 / filterManager.renderer.height * (filterManager.renderer.height / input.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, this.passes === 1) filterManager.applyFilter(this, input, output, clearMode);
		else {
			const renderTarget = filterManager.getFilterTexture(), renderer = filterManager.renderer;
			let flip = input, flop = renderTarget;
			this.state.blend = !1, filterManager.applyFilter(this, flip, flop, CLEAR_MODES.CLEAR);
			for (let i = 1; i < this.passes - 1; i++) {
				filterManager.bindAndClear(flip, CLEAR_MODES.BLIT), this.uniforms.uSampler = flop;
				const temp = flop;
				flop = flip, flip = temp, renderer.shader.bind(this), renderer.geometry.draw(5);
			}
			this.state.blend = !0, filterManager.applyFilter(this, flop, output, clearMode), filterManager.returnFilterTexture(renderTarget);
		}
	}
	/**
	* Sets the strength of both the blur.
	* @default 16
	*/
	get blur() {
		return this.strength;
	}
	set blur(value) {
		this.padding = 1 + Math.abs(value) * 2, this.strength = value;
	}
	/**
	* Sets the quality of the blur by modifying the number of passes. More passes means higher
	* quality bluring but the lower the performance.
	* @default 4
	*/
	get quality() {
		return this._quality;
	}
	set quality(value) {
		this._quality = value, this.passes = value;
	}
};
//#endregion
//#region ../../opt/butl/node_modules/@pixi/filter-blur/lib/BlurFilter.mjs
var BlurFilter = class extends Filter {
	/**
	* @param strength - The strength of the blur filter.
	* @param quality - The quality of the blur filter.
	* @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
	* @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
	*/
	constructor(strength = 8, quality = 4, resolution = Filter.defaultResolution, kernelSize = 5) {
		super(), this._repeatEdgePixels = !1, this.blurXFilter = new BlurFilterPass(!0, strength, quality, resolution, kernelSize), this.blurYFilter = new BlurFilterPass(!1, strength, quality, resolution, kernelSize), this.resolution = resolution, this.quality = quality, this.blur = strength, this.repeatEdgePixels = !1;
	}
	/**
	* Applies the filter.
	* @param filterManager - The manager.
	* @param input - The input target.
	* @param output - The output target.
	* @param clearMode - How to clear
	*/
	apply(filterManager, input, output, clearMode) {
		const xStrength = Math.abs(this.blurXFilter.strength), yStrength = Math.abs(this.blurYFilter.strength);
		if (xStrength && yStrength) {
			const renderTarget = filterManager.getFilterTexture();
			this.blurXFilter.apply(filterManager, input, renderTarget, CLEAR_MODES.CLEAR), this.blurYFilter.apply(filterManager, renderTarget, output, clearMode), filterManager.returnFilterTexture(renderTarget);
		} else yStrength ? this.blurYFilter.apply(filterManager, input, output, clearMode) : this.blurXFilter.apply(filterManager, input, output, clearMode);
	}
	updatePadding() {
		this._repeatEdgePixels ? this.padding = 0 : this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
	}
	/**
	* Sets the strength of both the blurX and blurY properties simultaneously
	* @default 2
	*/
	get blur() {
		return this.blurXFilter.blur;
	}
	set blur(value) {
		this.blurXFilter.blur = this.blurYFilter.blur = value, this.updatePadding();
	}
	/**
	* Sets the number of passes for blur. More passes means higher quality bluring.
	* @default 1
	*/
	get quality() {
		return this.blurXFilter.quality;
	}
	set quality(value) {
		this.blurXFilter.quality = this.blurYFilter.quality = value;
	}
	/**
	* Sets the strength of the blurX property
	* @default 2
	*/
	get blurX() {
		return this.blurXFilter.blur;
	}
	set blurX(value) {
		this.blurXFilter.blur = value, this.updatePadding();
	}
	/**
	* Sets the strength of the blurY property
	* @default 2
	*/
	get blurY() {
		return this.blurYFilter.blur;
	}
	set blurY(value) {
		this.blurYFilter.blur = value, this.updatePadding();
	}
	/**
	* Sets the blendmode of the filter
	* @default PIXI.BLEND_MODES.NORMAL
	*/
	get blendMode() {
		return this.blurYFilter.blendMode;
	}
	set blendMode(value) {
		this.blurYFilter.blendMode = value;
	}
	/**
	* If set to true the edge of the target will be clamped
	* @default false
	*/
	get repeatEdgePixels() {
		return this._repeatEdgePixels;
	}
	set repeatEdgePixels(value) {
		this._repeatEdgePixels = value, this.updatePadding();
	}
};
//#endregion
export { BlurFilterPass as n, BlurFilter as t };
