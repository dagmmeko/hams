import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.f075b8c9.js","_app/immutable/chunks/scheduler.be341df6.js","_app/immutable/chunks/index.d2fb6592.js","_app/immutable/chunks/Logo.svg.0cb9802c.js","_app/immutable/chunks/stores.f92608b4.js","_app/immutable/chunks/singletons.a2a3f4d4.js","_app/immutable/chunks/paths.17cc3ada.js","_app/immutable/chunks/_commonjsHelpers.725317a4.js","_app/immutable/chunks/each.f509b82d.js","_app/immutable/chunks/SvelteToast.svelte_svelte_type_style_lang.34936dee.js","_app/immutable/chunks/spread.8a54911c.js"];
export const stylesheets = ["_app/immutable/assets/0.3c2aec55.css","_app/immutable/assets/SvelteToast.126e14af.css"];
export const fonts = [];
