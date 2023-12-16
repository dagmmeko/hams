import * as server from '../entries/pages/vendor-task/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/vendor-task/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/vendor-task/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.44ece927.js","_app/immutable/chunks/scheduler.be341df6.js","_app/immutable/chunks/index.d2fb6592.js","_app/immutable/chunks/SvelteToast.svelte_svelte_type_style_lang.34936dee.js","_app/immutable/chunks/singletons.a2a3f4d4.js","_app/immutable/chunks/paths.17cc3ada.js","_app/immutable/chunks/spread.8a54911c.js","_app/immutable/chunks/filters-lines.svg.03ce1a37.js","_app/immutable/chunks/stores.f92608b4.js","_app/immutable/chunks/navigation.e609b1a8.js","_app/immutable/chunks/dayjs.min.c931d499.js","_app/immutable/chunks/_commonjsHelpers.725317a4.js","_app/immutable/chunks/SvelteTable.a6863e2e.js","_app/immutable/chunks/each.f509b82d.js","_app/immutable/chunks/index.655df6de.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/forms.7281ce72.js","_app/immutable/chunks/click-outside.5e188f95.js"];
export const stylesheets = ["_app/immutable/assets/SvelteToast.126e14af.css","_app/immutable/assets/SvelteTable.c1978f77.css"];
export const fonts = [];
