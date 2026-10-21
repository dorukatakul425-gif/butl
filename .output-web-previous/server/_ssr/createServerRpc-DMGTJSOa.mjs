import { a as TSS_SERVER_FUNCTION } from "./createServerFn-Ae892gC8.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/createServerRpc-DMGTJSOa.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createServerRpc as t };
