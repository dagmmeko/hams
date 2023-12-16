import * as server from '../entries/pages/tenants/rent-room/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tenants/rent-room/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/tenants/rent-room/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.1d72da48.js","_app/immutable/chunks/scheduler.be341df6.js","_app/immutable/chunks/each.f509b82d.js","_app/immutable/chunks/index.d2fb6592.js","_app/immutable/chunks/navigation.e609b1a8.js","_app/immutable/chunks/singletons.a2a3f4d4.js","_app/immutable/chunks/paths.17cc3ada.js","_app/immutable/chunks/stores.f92608b4.js"];
export const stylesheets = [];
export const fonts = [];
