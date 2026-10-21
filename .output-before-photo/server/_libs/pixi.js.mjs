import { ft as deprecation } from "./@pixi-spine/base+[...].mjs";
import "./pixi__mixin-cache-as-bitmap.mjs";
import "./pixi__mixin-get-child-by-name.mjs";
import "./@pixi/mixin-get-global-position+[...].mjs";
import { t as AlphaFilter } from "./pixi__filter-alpha.mjs";
import { n as BlurFilterPass, t as BlurFilter } from "./pixi__filter-blur.mjs";
import { t as ColorMatrixFilter } from "./pixi__filter-color-matrix.mjs";
import { t as DisplacementFilter } from "./pixi__filter-displacement.mjs";
import { t as FXAAFilter } from "./pixi__filter-fxaa.mjs";
import { t as NoiseFilter } from "./pixi__filter-noise.mjs";
import "./@pixi/accessibility+[...].mjs";
import "./pixi__app.mjs";
import "./pixi__assets.mjs";
import "./pixi__compressed-textures.mjs";
import "./pixi__extract.mjs";
import "./pixi__particle-container.mjs";
import "./pixi__prepare+pixi__text.mjs";
import "./pixi__sprite-animated.mjs";
import "./pixi__sprite-tiling.mjs";
import "./pixi__spritesheet.mjs";
import "./pixi__text-bitmap.mjs";
import "./pixi__text-html.mjs";
//#region ../../opt/butl/node_modules/pixi.js/lib/filters.mjs
var filters = {
	/**
	* @class
	* @memberof PIXI.filters
	* @deprecated since 7.1.0
	* @see PIXI.AlphaFilter
	*/
	AlphaFilter,
	/**
	* @class
	* @memberof PIXI.filters
	* @deprecated since 7.1.0
	* @see PIXI.BlurFilter
	*/
	BlurFilter,
	/**
	* @class
	* @memberof PIXI.filters
	* @deprecated since 7.1.0
	* @see PIXI.BlurFilterPass
	*/
	BlurFilterPass,
	/**
	* @class
	* @memberof PIXI.filters
	* @deprecated since 7.1.0
	* @see PIXI.ColorMatrixFilter
	*/
	ColorMatrixFilter,
	/**
	* @class
	* @memberof PIXI.filters
	* @deprecated since 7.1.0
	* @see PIXI.DisplacementFilter
	*/
	DisplacementFilter,
	/**
	* @class
	* @memberof PIXI.filters
	* @deprecated since 7.1.0
	* @see PIXI.FXAAFilter
	*/
	FXAAFilter,
	/**
	* @class
	* @memberof PIXI.filters
	* @deprecated since 7.1.0
	* @see PIXI.NoiseFilter
	*/
	NoiseFilter
};
Object.entries(filters).forEach(([key, FilterClass]) => {
	Object.defineProperty(filters, key, { get() {
		return deprecation("7.1.0", `filters.${key} has moved to ${key}`), FilterClass;
	} });
});
//#endregion
export {};
