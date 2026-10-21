import { A as autoDetectRenderer, X as ExtensionType, Z as extensions, w as Container } from "./@pixi-spine/base+[...].mjs";
//#region ../../opt/butl/node_modules/@pixi/app/lib/Application.mjs
var _Application = class _Application2 {
	/**
	* @param options - The optional application and renderer parameters.
	*/
	constructor(options) {
		this.stage = new Container(), options = Object.assign({ forceCanvas: !1 }, options), this.renderer = autoDetectRenderer(options), _Application2._plugins.forEach((plugin) => {
			plugin.init.call(this, options);
		});
	}
	/** Render the current stage. */
	render() {
		this.renderer.render(this.stage);
	}
	/**
	* Reference to the renderer's canvas element.
	* @member {PIXI.ICanvas}
	* @readonly
	*/
	get view() {
		return this.renderer?.view;
	}
	/**
	* Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
	* @member {PIXI.Rectangle}
	* @readonly
	*/
	get screen() {
		return this.renderer?.screen;
	}
	/**
	* Destroy and don't use after this.
	* @param {boolean} [removeView=false] - Automatically remove canvas from DOM.
	* @param {object|boolean} [stageOptions] - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param {boolean} [stageOptions.children=false] - if set to true, all the children will have their destroy
	*  method called as well. 'stageOptions' will be passed on to those calls.
	* @param {boolean} [stageOptions.texture=false] - Only used for child Sprites if stageOptions.children is set
	*  to true. Should it destroy the texture of the child sprite
	* @param {boolean} [stageOptions.baseTexture=false] - Only used for child Sprites if stageOptions.children is set
	*  to true. Should it destroy the base texture of the child sprite
	*/
	destroy(removeView, stageOptions) {
		const plugins = _Application2._plugins.slice(0);
		plugins.reverse(), plugins.forEach((plugin) => {
			plugin.destroy.call(this);
		}), this.stage.destroy(stageOptions), this.stage = null, this.renderer.destroy(removeView), this.renderer = null;
	}
};
_Application._plugins = [];
var Application = _Application;
extensions.handleByList(ExtensionType.Application, Application._plugins);
//#endregion
//#region ../../opt/butl/node_modules/@pixi/app/lib/ResizePlugin.mjs
var ResizePlugin = class {
	/**
	* Initialize the plugin with scope of application instance
	* @static
	* @private
	* @param {object} [options] - See application options
	*/
	static init(options) {
		Object.defineProperty(
			this,
			"resizeTo",
			/**
			* The HTML element or window to automatically resize the
			* renderer's view element to match width and height.
			* @member {Window|HTMLElement}
			* @name resizeTo
			* @memberof PIXI.Application#
			*/
			{
				set(dom) {
					globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = dom, dom && (globalThis.addEventListener("resize", this.queueResize), this.resize());
				},
				get() {
					return this._resizeTo;
				}
			}
		), this.queueResize = () => {
			this._resizeTo && (this.cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
		}, this.cancelResize = () => {
			this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null);
		}, this.resize = () => {
			if (!this._resizeTo) return;
			this.cancelResize();
			let width, height;
			if (this._resizeTo === globalThis.window) width = globalThis.innerWidth, height = globalThis.innerHeight;
			else {
				const { clientWidth, clientHeight } = this._resizeTo;
				width = clientWidth, height = clientHeight;
			}
			this.renderer.resize(width, height), this.render();
		}, this._resizeId = null, this._resizeTo = null, this.resizeTo = options.resizeTo || null;
	}
	/**
	* Clean up the ticker, scoped to application
	* @static
	* @private
	*/
	static destroy() {
		globalThis.removeEventListener("resize", this.queueResize), this.cancelResize(), this.cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
	}
};
ResizePlugin.extension = ExtensionType.Application;
extensions.add(ResizePlugin);
//#endregion
export { Application as t };
