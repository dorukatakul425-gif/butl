import { T as DisplayObject, U as Point } from "../@pixi-spine/base+[...].mjs";
//#region ../../opt/butl/node_modules/@pixi/mixin-get-global-position/lib/index.mjs
DisplayObject.prototype.getGlobalPosition = function(point = new Point(), skipUpdate = !1) {
	return this.parent ? this.parent.toGlobal(this.position, point, skipUpdate) : (point.x = this.position.x, point.y = this.position.y), point;
};
//#endregion
export {};
