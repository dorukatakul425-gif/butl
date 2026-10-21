import { I as Filter, U as Point, V as Matrix } from "./@pixi-spine/base+[...].mjs";
//#region node_modules/@pixi/filter-displacement/lib/displacement.frag.mjs
var fragment = `varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

uniform vec2 scale;
uniform mat2 rotation;
uniform sampler2D uSampler;
uniform sampler2D mapSampler;

uniform highp vec4 inputSize;
uniform vec4 inputClamp;

void main(void)
{
  vec4 map =  texture2D(mapSampler, vFilterCoord);

  map -= 0.5;
  map.xy = scale * inputSize.zw * (rotation * map.xy);

  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));
}
`;
//#endregion
//#region node_modules/@pixi/filter-displacement/lib/displacement.vert.mjs
var vertex = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

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
	vTextureCoord = filterTextureCoord();
	vFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;
}
`;
//#endregion
//#region node_modules/@pixi/filter-displacement/lib/DisplacementFilter.mjs
var DisplacementFilter = class extends Filter {
	/**
	* @param {PIXI.Sprite} sprite - The sprite used for the displacement map. (make sure its added to the scene!)
	* @param scale - The scale of the displacement
	*/
	constructor(sprite, scale) {
		const maskMatrix = new Matrix();
		sprite.renderable = !1, super(vertex, fragment, {
			mapSampler: sprite._texture,
			filterMatrix: maskMatrix,
			scale: {
				x: 1,
				y: 1
			},
			rotation: new Float32Array([
				1,
				0,
				0,
				1
			])
		}), this.maskSprite = sprite, this.maskMatrix = maskMatrix, scale ??= 20, this.scale = new Point(scale, scale);
	}
	/**
	* Applies the filter.
	* @param filterManager - The manager.
	* @param input - The input target.
	* @param output - The output target.
	* @param clearMode - clearMode.
	*/
	apply(filterManager, input, output, clearMode) {
		this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x, this.uniforms.scale.y = this.scale.y;
		const wt = this.maskSprite.worldTransform, lenX = Math.sqrt(wt.a * wt.a + wt.b * wt.b), lenY = Math.sqrt(wt.c * wt.c + wt.d * wt.d);
		lenX !== 0 && lenY !== 0 && (this.uniforms.rotation[0] = wt.a / lenX, this.uniforms.rotation[1] = wt.b / lenX, this.uniforms.rotation[2] = wt.c / lenY, this.uniforms.rotation[3] = wt.d / lenY), filterManager.applyFilter(this, input, output, clearMode);
	}
	/** The texture used for the displacement map. Must be power of 2 sized texture. */
	get map() {
		return this.uniforms.mapSampler;
	}
	set map(value) {
		this.uniforms.mapSampler = value;
	}
};
//#endregion
export { DisplacementFilter as t };
