import { I as Filter, k as defaultVertex } from "./@pixi-spine/base+[...].mjs";
//#region node_modules/@pixi/filter-alpha/lib/alpha.frag.mjs
var fragment = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;
//#endregion
//#region node_modules/@pixi/filter-alpha/lib/AlphaFilter.mjs
var AlphaFilter = class extends Filter {
	/**
	* @param alpha - Amount of alpha from 0 to 1, where 0 is transparent
	*/
	constructor(alpha = 1) {
		super(defaultVertex, fragment, { uAlpha: 1 }), this.alpha = alpha;
	}
	/**
	* Coefficient for alpha multiplication
	* @default 1
	*/
	get alpha() {
		return this.uniforms.uAlpha;
	}
	set alpha(value) {
		this.uniforms.uAlpha = value;
	}
};
//#endregion
export { AlphaFilter as t };
