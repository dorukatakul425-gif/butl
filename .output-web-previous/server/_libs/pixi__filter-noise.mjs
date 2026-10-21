import { I as Filter, O as defaultFilterVertex } from "./@pixi-spine/base+[...].mjs";
//#region ../../opt/butl/node_modules/@pixi/filter-noise/lib/noise.frag.mjs
var fragment = `precision highp float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform float uNoise;
uniform float uSeed;
uniform sampler2D uSampler;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    float randomValue = rand(gl_FragCoord.xy * uSeed);
    float diff = (randomValue - 0.5) * uNoise;

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    color.r += diff;
    color.g += diff;
    color.b += diff;

    // Premultiply alpha again.
    color.rgb *= color.a;

    gl_FragColor = color;
}
`;
//#endregion
//#region ../../opt/butl/node_modules/@pixi/filter-noise/lib/NoiseFilter.mjs
var NoiseFilter = class extends Filter {
	/**
	* @param {number} [noise=0.5] - The noise intensity, should be a normalized value in the range [0, 1].
	* @param {number} [seed] - A random seed for the noise generation. Default is `Math.random()`.
	*/
	constructor(noise = .5, seed = Math.random()) {
		super(defaultFilterVertex, fragment, {
			uNoise: 0,
			uSeed: 0
		}), this.noise = noise, this.seed = seed;
	}
	/**
	* The amount of noise to apply, this value should be in the range (0, 1].
	* @default 0.5
	*/
	get noise() {
		return this.uniforms.uNoise;
	}
	set noise(value) {
		this.uniforms.uNoise = value;
	}
	/** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
	get seed() {
		return this.uniforms.uSeed;
	}
	set seed(value) {
		this.uniforms.uSeed = value;
	}
};
//#endregion
export { NoiseFilter as t };
