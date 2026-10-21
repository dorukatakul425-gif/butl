import { a as TSS_SERVER_FUNCTION } from "./createServerFn-Ae892gC8.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DEbbVQoK.mjs";
//#region ../../opt/butl/node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-B00KY3_a.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createSsrRpc as t };
