import { T as DisplayObject, w as Container } from "./@pixi-spine/base+[...].mjs";
//#region node_modules/@pixi/mixin-get-child-by-name/lib/index.mjs
DisplayObject.prototype.name = null;
Container.prototype.getChildByName = function(name, deep) {
	for (let i = 0, j = this.children.length; i < j; i++) if (this.children[i].name === name) return this.children[i];
	if (deep) for (let i = 0, j = this.children.length; i < j; i++) {
		const child = this.children[i];
		if (!child.getChildByName) continue;
		const target = child.getChildByName(name, !0);
		if (target) return target;
	}
	return null;
};
//#endregion
export {};
