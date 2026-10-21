import { I as Filter, O as defaultFilterVertex, lt as Color } from "./@pixi-spine/base+[...].mjs";
//#region ../../opt/butl/node_modules/@pixi/filter-color-matrix/lib/colorMatrix.frag.mjs
var fragment = `varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float m[20];
uniform float uAlpha;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);

    if (uAlpha == 0.0) {
        gl_FragColor = c;
        return;
    }

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (c.a > 0.0) {
      c.rgb /= c.a;
    }

    vec4 result;

    result.r = (m[0] * c.r);
        result.r += (m[1] * c.g);
        result.r += (m[2] * c.b);
        result.r += (m[3] * c.a);
        result.r += m[4];

    result.g = (m[5] * c.r);
        result.g += (m[6] * c.g);
        result.g += (m[7] * c.b);
        result.g += (m[8] * c.a);
        result.g += m[9];

    result.b = (m[10] * c.r);
       result.b += (m[11] * c.g);
       result.b += (m[12] * c.b);
       result.b += (m[13] * c.a);
       result.b += m[14];

    result.a = (m[15] * c.r);
       result.a += (m[16] * c.g);
       result.a += (m[17] * c.b);
       result.a += (m[18] * c.a);
       result.a += m[19];

    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);

    // Premultiply alpha again.
    rgb *= result.a;

    gl_FragColor = vec4(rgb, result.a);
}
`;
//#endregion
//#region ../../opt/butl/node_modules/@pixi/filter-color-matrix/lib/ColorMatrixFilter.mjs
var ColorMatrixFilter = class extends Filter {
	constructor() {
		const uniforms = {
			m: new Float32Array([
				1,
				0,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				0,
				1,
				0
			]),
			uAlpha: 1
		};
		super(defaultFilterVertex, fragment, uniforms), this.alpha = 1;
	}
	/**
	* Transforms current matrix and set the new one
	* @param {number[]} matrix - 5x4 matrix
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	_loadMatrix(matrix, multiply = !1) {
		let newMatrix = matrix;
		multiply && (this._multiply(newMatrix, this.uniforms.m, matrix), newMatrix = this._colorMatrix(newMatrix)), this.uniforms.m = newMatrix;
	}
	/**
	* Multiplies two mat5's
	* @private
	* @param out - 5x4 matrix the receiving matrix
	* @param a - 5x4 matrix the first operand
	* @param b - 5x4 matrix the second operand
	* @returns {number[]} 5x4 matrix
	*/
	_multiply(out, a, b) {
		return out[0] = a[0] * b[0] + a[1] * b[5] + a[2] * b[10] + a[3] * b[15], out[1] = a[0] * b[1] + a[1] * b[6] + a[2] * b[11] + a[3] * b[16], out[2] = a[0] * b[2] + a[1] * b[7] + a[2] * b[12] + a[3] * b[17], out[3] = a[0] * b[3] + a[1] * b[8] + a[2] * b[13] + a[3] * b[18], out[4] = a[0] * b[4] + a[1] * b[9] + a[2] * b[14] + a[3] * b[19] + a[4], out[5] = a[5] * b[0] + a[6] * b[5] + a[7] * b[10] + a[8] * b[15], out[6] = a[5] * b[1] + a[6] * b[6] + a[7] * b[11] + a[8] * b[16], out[7] = a[5] * b[2] + a[6] * b[7] + a[7] * b[12] + a[8] * b[17], out[8] = a[5] * b[3] + a[6] * b[8] + a[7] * b[13] + a[8] * b[18], out[9] = a[5] * b[4] + a[6] * b[9] + a[7] * b[14] + a[8] * b[19] + a[9], out[10] = a[10] * b[0] + a[11] * b[5] + a[12] * b[10] + a[13] * b[15], out[11] = a[10] * b[1] + a[11] * b[6] + a[12] * b[11] + a[13] * b[16], out[12] = a[10] * b[2] + a[11] * b[7] + a[12] * b[12] + a[13] * b[17], out[13] = a[10] * b[3] + a[11] * b[8] + a[12] * b[13] + a[13] * b[18], out[14] = a[10] * b[4] + a[11] * b[9] + a[12] * b[14] + a[13] * b[19] + a[14], out[15] = a[15] * b[0] + a[16] * b[5] + a[17] * b[10] + a[18] * b[15], out[16] = a[15] * b[1] + a[16] * b[6] + a[17] * b[11] + a[18] * b[16], out[17] = a[15] * b[2] + a[16] * b[7] + a[17] * b[12] + a[18] * b[17], out[18] = a[15] * b[3] + a[16] * b[8] + a[17] * b[13] + a[18] * b[18], out[19] = a[15] * b[4] + a[16] * b[9] + a[17] * b[14] + a[18] * b[19] + a[19], out;
	}
	/**
	* Create a Float32 Array and normalize the offset component to 0-1
	* @param {number[]} matrix - 5x4 matrix
	* @returns {number[]} 5x4 matrix with all values between 0-1
	*/
	_colorMatrix(matrix) {
		const m = new Float32Array(matrix);
		return m[4] /= 255, m[9] /= 255, m[14] /= 255, m[19] /= 255, m;
	}
	/**
	* Adjusts brightness
	* @param b - value of the brigthness (0-1, where 0 is black)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	brightness(b, multiply) {
		const matrix = [
			b,
			0,
			0,
			0,
			0,
			0,
			b,
			0,
			0,
			0,
			0,
			0,
			b,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/**
	* Sets each channel on the diagonal of the color matrix.
	* This can be used to achieve a tinting effect on Containers similar to the tint field of some
	* display objects like Sprite, Text, Graphics, and Mesh.
	* @param color - Color of the tint. This is a hex value.
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	tint(color, multiply) {
		const [r, g, b] = Color.shared.setValue(color).toArray(), matrix = [
			r,
			0,
			0,
			0,
			0,
			0,
			g,
			0,
			0,
			0,
			0,
			0,
			b,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/**
	* Set the matrices in grey scales
	* @param scale - value of the grey (0-1, where 0 is black)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	greyscale(scale, multiply) {
		const matrix = [
			scale,
			scale,
			scale,
			0,
			0,
			scale,
			scale,
			scale,
			0,
			0,
			scale,
			scale,
			scale,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/**
	* Set the black and white matrice.
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	blackAndWhite(multiply) {
		this._loadMatrix([
			.3,
			.6,
			.1,
			0,
			0,
			.3,
			.6,
			.1,
			0,
			0,
			.3,
			.6,
			.1,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* Set the hue property of the color
	* @param rotation - in degrees
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	hue(rotation, multiply) {
		rotation = (rotation || 0) / 180 * Math.PI;
		const cosR = Math.cos(rotation), sinR = Math.sin(rotation), sqrt = Math.sqrt, w = 1 / 3, sqrW = sqrt(w), matrix = [
			cosR + (1 - cosR) * w,
			w * (1 - cosR) - sqrW * sinR,
			w * (1 - cosR) + sqrW * sinR,
			0,
			0,
			w * (1 - cosR) + sqrW * sinR,
			cosR + w * (1 - cosR),
			w * (1 - cosR) - sqrW * sinR,
			0,
			0,
			w * (1 - cosR) - sqrW * sinR,
			w * (1 - cosR) + sqrW * sinR,
			cosR + w * (1 - cosR),
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/**
	* Set the contrast matrix, increase the separation between dark and bright
	* Increase contrast : shadows darker and highlights brighter
	* Decrease contrast : bring the shadows up and the highlights down
	* @param amount - value of the contrast (0-1)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	contrast(amount, multiply) {
		const v = (amount || 0) + 1, o = -.5 * (v - 1), matrix = [
			v,
			0,
			0,
			0,
			o,
			0,
			v,
			0,
			0,
			o,
			0,
			0,
			v,
			0,
			o,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/**
	* Set the saturation matrix, increase the separation between colors
	* Increase saturation : increase contrast, brightness, and sharpness
	* @param amount - The saturation amount (0-1)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	saturate(amount = 0, multiply) {
		const x = amount * 2 / 3 + 1, y = (x - 1) * -.5, matrix = [
			x,
			y,
			y,
			0,
			0,
			y,
			x,
			y,
			0,
			0,
			y,
			y,
			x,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/** Desaturate image (remove color) Call the saturate function */
	desaturate() {
		this.saturate(-1);
	}
	/**
	* Negative image (inverse of classic rgb matrix)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	negative(multiply) {
		this._loadMatrix([
			-1,
			0,
			0,
			1,
			0,
			0,
			-1,
			0,
			1,
			0,
			0,
			0,
			-1,
			1,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* Sepia image
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	sepia(multiply) {
		this._loadMatrix([
			.393,
			.7689999,
			.18899999,
			0,
			0,
			.349,
			.6859999,
			.16799999,
			0,
			0,
			.272,
			.5339999,
			.13099999,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* Color motion picture process invented in 1916 (thanks Dominic Szablewski)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	technicolor(multiply) {
		this._loadMatrix([
			1.9125277891456083,
			-.8545344976951645,
			-.09155508482755585,
			0,
			11.793603434377337,
			-.3087833385928097,
			1.7658908555458428,
			-.10601743074722245,
			0,
			-70.35205161461398,
			-.231103377548616,
			-.7501899197440212,
			1.847597816108189,
			0,
			30.950940869491138,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* Polaroid filter
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	polaroid(multiply) {
		this._loadMatrix([
			1.438,
			-.062,
			-.062,
			0,
			0,
			-.122,
			1.378,
			-.122,
			0,
			0,
			-.016,
			-.016,
			1.483,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* Filter who transforms : Red -> Blue and Blue -> Red
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	toBGR(multiply) {
		this._loadMatrix([
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	kodachrome(multiply) {
		this._loadMatrix([
			1.1285582396593525,
			-.3967382283601348,
			-.03992559172921793,
			0,
			63.72958762196502,
			-.16404339962244616,
			1.0835251566291304,
			-.05498805115633132,
			0,
			24.732407896706203,
			-.16786010706155763,
			-.5603416277695248,
			1.6014850761964943,
			0,
			35.62982807460946,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* Brown delicious browni filter (thanks Dominic Szablewski)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	browni(multiply) {
		this._loadMatrix([
			.5997023498159715,
			.34553243048391263,
			-.2708298674538042,
			0,
			47.43192855600873,
			-.037703249837783157,
			.8609577587992641,
			.15059552388459913,
			0,
			-36.96841498319127,
			.24113635128153335,
			-.07441037908422492,
			.44972182064877153,
			0,
			-7.562075277591283,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* Vintage filter (thanks Dominic Szablewski)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	vintage(multiply) {
		this._loadMatrix([
			.6279345635605994,
			.3202183420819367,
			-.03965408211312453,
			0,
			9.651285835294123,
			.02578397704808868,
			.6441188644374771,
			.03259127616149294,
			0,
			7.462829176470591,
			.0466055556782719,
			-.0851232987247891,
			.5241648018700465,
			0,
			5.159190588235296,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/**
	* We don't know exactly what it does, kind of gradient map, but funny to play with!
	* @param desaturation - Tone values.
	* @param toned - Tone values.
	* @param lightColor - Tone values, example: `0xFFE580`
	* @param darkColor - Tone values, example: `0xFFE580`
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	colorTone(desaturation, toned, lightColor, darkColor, multiply) {
		desaturation = desaturation || .2, toned = toned || .15, lightColor = lightColor || 16770432, darkColor = darkColor || 3375104;
		const temp = Color.shared, [lR, lG, lB] = temp.setValue(lightColor).toArray(), [dR, dG, dB] = temp.setValue(darkColor).toArray(), matrix = [
			.3,
			.59,
			.11,
			0,
			0,
			lR,
			lG,
			lB,
			desaturation,
			0,
			dR,
			dG,
			dB,
			toned,
			0,
			lR - dR,
			lG - dG,
			lB - dB,
			0,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/**
	* Night effect
	* @param intensity - The intensity of the night effect.
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	night(intensity, multiply) {
		intensity = intensity || .1;
		const matrix = [
			intensity * -2,
			-intensity,
			0,
			0,
			0,
			-intensity,
			0,
			intensity,
			0,
			0,
			0,
			intensity,
			intensity * 2,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/**
	* Predator effect
	*
	* Erase the current matrix by setting a new indepent one
	* @param amount - how much the predator feels his future victim
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	predator(amount, multiply) {
		const matrix = [
			11.224130630493164 * amount,
			-4.794486999511719 * amount,
			-2.8746118545532227 * amount,
			0 * amount,
			.40342438220977783 * amount,
			-3.6330697536468506 * amount,
			9.193157196044922 * amount,
			-2.951810836791992 * amount,
			0 * amount,
			-1.316135048866272 * amount,
			-3.2184197902679443 * amount,
			-4.2375030517578125 * amount,
			7.476448059082031 * amount,
			0 * amount,
			.8044459223747253 * amount,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	}
	/**
	* LSD effect
	*
	* Multiply the current matrix
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	lsd(multiply) {
		this._loadMatrix([
			2,
			-.4,
			.5,
			0,
			0,
			-.5,
			2,
			-.4,
			0,
			0,
			-.4,
			-.5,
			3,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	}
	/** Erase the current matrix by setting the default one. */
	reset() {
		this._loadMatrix([
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], !1);
	}
	/**
	* The matrix of the color matrix filter
	* @member {number[]}
	* @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
	*/
	get matrix() {
		return this.uniforms.m;
	}
	set matrix(value) {
		this.uniforms.m = value;
	}
	/**
	* The opacity value to use when mixing the original and resultant colors.
	*
	* When the value is 0, the original color is used without modification.
	* When the value is 1, the result color is used.
	* When in the range (0, 1) the color is interpolated between the original and result by this amount.
	* @default 1
	*/
	get alpha() {
		return this.uniforms.uAlpha;
	}
	set alpha(value) {
		this.uniforms.uAlpha = value;
	}
};
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.greyscale;
//#endregion
export { ColorMatrixFilter as t };
