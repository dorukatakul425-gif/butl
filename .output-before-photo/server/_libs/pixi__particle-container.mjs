import { G as Buffer, J as State, L as ObjectRenderer, R as Shader, V as Matrix, W as Geometry, X as ExtensionType, Z as extensions, at as createIndicesForQuads, bt as TYPES, lt as Color, ot as correctBlendMode } from "./@pixi-spine/base+[...].mjs";
//#region ../../opt/butl/node_modules/@pixi/particle-container/lib/ParticleBuffer.mjs
var ParticleBuffer = class {
	/**
	* @param {object} properties - The properties to upload.
	* @param {boolean[]} dynamicPropertyFlags - Flags for which properties are dynamic.
	* @param {number} size - The size of the batch.
	*/
	constructor(properties, dynamicPropertyFlags, size) {
		this.geometry = new Geometry(), this.indexBuffer = null, this.size = size, this.dynamicProperties = [], this.staticProperties = [];
		for (let i = 0; i < properties.length; ++i) {
			let property = properties[i];
			property = {
				attributeName: property.attributeName,
				size: property.size,
				uploadFunction: property.uploadFunction,
				type: property.type || TYPES.FLOAT,
				offset: property.offset
			}, dynamicPropertyFlags[i] ? this.dynamicProperties.push(property) : this.staticProperties.push(property);
		}
		this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this._updateID = 0, this.initBuffers();
	}
	/** Sets up the renderer context and necessary buffers. */
	initBuffers() {
		const geometry = this.geometry;
		let dynamicOffset = 0;
		this.indexBuffer = new Buffer(createIndicesForQuads(this.size), !0, !0), geometry.addIndex(this.indexBuffer), this.dynamicStride = 0;
		for (let i = 0; i < this.dynamicProperties.length; ++i) {
			const property = this.dynamicProperties[i];
			property.offset = dynamicOffset, dynamicOffset += property.size, this.dynamicStride += property.size;
		}
		const dynBuffer = /* @__PURE__ */ new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
		this.dynamicData = new Float32Array(dynBuffer), this.dynamicDataUint32 = new Uint32Array(dynBuffer), this.dynamicBuffer = new Buffer(this.dynamicData, !1, !1);
		let staticOffset = 0;
		this.staticStride = 0;
		for (let i = 0; i < this.staticProperties.length; ++i) {
			const property = this.staticProperties[i];
			property.offset = staticOffset, staticOffset += property.size, this.staticStride += property.size;
		}
		const statBuffer = /* @__PURE__ */ new ArrayBuffer(this.size * this.staticStride * 4 * 4);
		this.staticData = new Float32Array(statBuffer), this.staticDataUint32 = new Uint32Array(statBuffer), this.staticBuffer = new Buffer(this.staticData, !0, !1);
		for (let i = 0; i < this.dynamicProperties.length; ++i) {
			const property = this.dynamicProperties[i];
			geometry.addAttribute(property.attributeName, this.dynamicBuffer, 0, property.type === TYPES.UNSIGNED_BYTE, property.type, this.dynamicStride * 4, property.offset * 4);
		}
		for (let i = 0; i < this.staticProperties.length; ++i) {
			const property = this.staticProperties[i];
			geometry.addAttribute(property.attributeName, this.staticBuffer, 0, property.type === TYPES.UNSIGNED_BYTE, property.type, this.staticStride * 4, property.offset * 4);
		}
	}
	/**
	* Uploads the dynamic properties.
	* @param children - The children to upload.
	* @param startIndex - The index to start at.
	* @param amount - The number to upload.
	*/
	uploadDynamic(children, startIndex, amount) {
		for (let i = 0; i < this.dynamicProperties.length; i++) {
			const property = this.dynamicProperties[i];
			property.uploadFunction(children, startIndex, amount, property.type === TYPES.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, property.offset);
		}
		this.dynamicBuffer._updateID++;
	}
	/**
	* Uploads the static properties.
	* @param children - The children to upload.
	* @param startIndex - The index to start at.
	* @param amount - The number to upload.
	*/
	uploadStatic(children, startIndex, amount) {
		for (let i = 0; i < this.staticProperties.length; i++) {
			const property = this.staticProperties[i];
			property.uploadFunction(children, startIndex, amount, property.type === TYPES.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, property.offset);
		}
		this.staticBuffer._updateID++;
	}
	/** Destroys the ParticleBuffer. */
	destroy() {
		this.indexBuffer = null, this.dynamicProperties = null, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this.staticProperties = null, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.geometry.destroy();
	}
};
//#endregion
//#region ../../opt/butl/node_modules/@pixi/particle-container/lib/particles.frag.mjs
var fragment = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void){
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = color;
}`;
//#endregion
//#region ../../opt/butl/node_modules/@pixi/particle-container/lib/particles.vert.mjs
var vertex = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;

attribute vec2 aPositionCoord;
attribute float aRotation;

uniform mat3 translationMatrix;
uniform vec4 uColor;

varying vec2 vTextureCoord;
varying vec4 vColor;

void main(void){
    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);
    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);

    vec2 v = vec2(x, y);
    v = v + aPositionCoord;

    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vColor = aColor * uColor;
}
`;
//#endregion
//#region ../../opt/butl/node_modules/@pixi/particle-container/lib/ParticleRenderer.mjs
var ParticleRenderer = class extends ObjectRenderer {
	/**
	* @param renderer - The renderer this sprite batch works for.
	*/
	constructor(renderer) {
		super(renderer), this.shader = null, this.properties = null, this.tempMatrix = new Matrix(), this.properties = [
			{
				attributeName: "aVertexPosition",
				size: 2,
				uploadFunction: this.uploadVertices,
				offset: 0
			},
			{
				attributeName: "aPositionCoord",
				size: 2,
				uploadFunction: this.uploadPosition,
				offset: 0
			},
			{
				attributeName: "aRotation",
				size: 1,
				uploadFunction: this.uploadRotation,
				offset: 0
			},
			{
				attributeName: "aTextureCoord",
				size: 2,
				uploadFunction: this.uploadUvs,
				offset: 0
			},
			{
				attributeName: "aColor",
				size: 1,
				type: TYPES.UNSIGNED_BYTE,
				uploadFunction: this.uploadTint,
				offset: 0
			}
		], this.shader = Shader.from(vertex, fragment, {}), this.state = State.for2d();
	}
	/**
	* Renders the particle container object.
	* @param container - The container to render using this ParticleRenderer.
	*/
	render(container) {
		const children = container.children, maxSize = container._maxSize, batchSize = container._batchSize, renderer = this.renderer;
		let totalChildren = children.length;
		if (totalChildren === 0) return;
		totalChildren > maxSize && !container.autoResize && (totalChildren = maxSize);
		let buffers = container._buffers;
		buffers || (buffers = container._buffers = this.generateBuffers(container));
		const baseTexture = children[0]._texture.baseTexture, premultiplied = baseTexture.alphaMode > 0;
		this.state.blendMode = correctBlendMode(container.blendMode, premultiplied), renderer.state.set(this.state);
		const gl = renderer.gl, m = container.worldTransform.copyTo(this.tempMatrix);
		m.prepend(renderer.globalUniforms.uniforms.projectionMatrix), this.shader.uniforms.translationMatrix = m.toArray(!0), this.shader.uniforms.uColor = Color.shared.setValue(container.tintRgb).premultiply(container.worldAlpha, premultiplied).toArray(this.shader.uniforms.uColor), this.shader.uniforms.uSampler = baseTexture, this.renderer.shader.bind(this.shader);
		let updateStatic = !1;
		for (let i = 0, j = 0; i < totalChildren; i += batchSize, j += 1) {
			let amount = totalChildren - i;
			amount > batchSize && (amount = batchSize), j >= buffers.length && buffers.push(this._generateOneMoreBuffer(container));
			const buffer = buffers[j];
			buffer.uploadDynamic(children, i, amount);
			const bid = container._bufferUpdateIDs[j] || 0;
			updateStatic = updateStatic || buffer._updateID < bid, updateStatic && (buffer._updateID = container._updateID, buffer.uploadStatic(children, i, amount)), renderer.geometry.bind(buffer.geometry), gl.drawElements(gl.TRIANGLES, amount * 6, gl.UNSIGNED_SHORT, 0);
		}
	}
	/**
	* Creates one particle buffer for each child in the container we want to render and updates internal properties.
	* @param container - The container to render using this ParticleRenderer
	* @returns - The buffers
	*/
	generateBuffers(container) {
		const buffers = [], size = container._maxSize, batchSize = container._batchSize, dynamicPropertyFlags = container._properties;
		for (let i = 0; i < size; i += batchSize) buffers.push(new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize));
		return buffers;
	}
	/**
	* Creates one more particle buffer, because container has autoResize feature.
	* @param container - The container to render using this ParticleRenderer
	* @returns - The generated buffer
	*/
	_generateOneMoreBuffer(container) {
		const batchSize = container._batchSize, dynamicPropertyFlags = container._properties;
		return new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize);
	}
	/**
	* Uploads the vertices.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their vertices uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	uploadVertices(children, startIndex, amount, array, stride, offset) {
		let w0 = 0, w1 = 0, h0 = 0, h1 = 0;
		for (let i = 0; i < amount; ++i) {
			const sprite = children[startIndex + i], texture = sprite._texture, sx = sprite.scale.x, sy = sprite.scale.y, trim = texture.trim, orig = texture.orig;
			trim ? (w1 = trim.x - sprite.anchor.x * orig.width, w0 = w1 + trim.width, h1 = trim.y - sprite.anchor.y * orig.height, h0 = h1 + trim.height) : (w0 = orig.width * (1 - sprite.anchor.x), w1 = orig.width * -sprite.anchor.x, h0 = orig.height * (1 - sprite.anchor.y), h1 = orig.height * -sprite.anchor.y), array[offset] = w1 * sx, array[offset + 1] = h1 * sy, array[offset + stride] = w0 * sx, array[offset + stride + 1] = h1 * sy, array[offset + stride * 2] = w0 * sx, array[offset + stride * 2 + 1] = h0 * sy, array[offset + stride * 3] = w1 * sx, array[offset + stride * 3 + 1] = h0 * sy, offset += stride * 4;
		}
	}
	/**
	* Uploads the position.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their positions uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	uploadPosition(children, startIndex, amount, array, stride, offset) {
		for (let i = 0; i < amount; i++) {
			const spritePosition = children[startIndex + i].position;
			array[offset] = spritePosition.x, array[offset + 1] = spritePosition.y, array[offset + stride] = spritePosition.x, array[offset + stride + 1] = spritePosition.y, array[offset + stride * 2] = spritePosition.x, array[offset + stride * 2 + 1] = spritePosition.y, array[offset + stride * 3] = spritePosition.x, array[offset + stride * 3 + 1] = spritePosition.y, offset += stride * 4;
		}
	}
	/**
	* Uploads the rotation.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their rotation uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	uploadRotation(children, startIndex, amount, array, stride, offset) {
		for (let i = 0; i < amount; i++) {
			const spriteRotation = children[startIndex + i].rotation;
			array[offset] = spriteRotation, array[offset + stride] = spriteRotation, array[offset + stride * 2] = spriteRotation, array[offset + stride * 3] = spriteRotation, offset += stride * 4;
		}
	}
	/**
	* Uploads the UVs.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their rotation uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	uploadUvs(children, startIndex, amount, array, stride, offset) {
		for (let i = 0; i < amount; ++i) {
			const textureUvs = children[startIndex + i]._texture._uvs;
			textureUvs ? (array[offset] = textureUvs.x0, array[offset + 1] = textureUvs.y0, array[offset + stride] = textureUvs.x1, array[offset + stride + 1] = textureUvs.y1, array[offset + stride * 2] = textureUvs.x2, array[offset + stride * 2 + 1] = textureUvs.y2, array[offset + stride * 3] = textureUvs.x3, array[offset + stride * 3 + 1] = textureUvs.y3, offset += stride * 4) : (array[offset] = 0, array[offset + 1] = 0, array[offset + stride] = 0, array[offset + stride + 1] = 0, array[offset + stride * 2] = 0, array[offset + stride * 2 + 1] = 0, array[offset + stride * 3] = 0, array[offset + stride * 3 + 1] = 0, offset += stride * 4);
		}
	}
	/**
	* Uploads the tint.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their rotation uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	uploadTint(children, startIndex, amount, array, stride, offset) {
		for (let i = 0; i < amount; ++i) {
			const sprite = children[startIndex + i], result = Color.shared.setValue(sprite._tintRGB).toPremultiplied(sprite.alpha, sprite.texture.baseTexture.alphaMode > 0);
			array[offset] = result, array[offset + stride] = result, array[offset + stride * 2] = result, array[offset + stride * 3] = result, offset += stride * 4;
		}
	}
	/** Destroys the ParticleRenderer. */
	destroy() {
		super.destroy(), this.shader && (this.shader.destroy(), this.shader = null), this.tempMatrix = null;
	}
};
ParticleRenderer.extension = {
	name: "particle",
	type: ExtensionType.RendererPlugin
};
extensions.add(ParticleRenderer);
//#endregion
export {};
