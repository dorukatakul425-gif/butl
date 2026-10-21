import { a as TSS_SERVER_FUNCTION } from "./createServerFn-DDDJMFWM.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DPHYBBQx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-KO5YQaqs.js
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
