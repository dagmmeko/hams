import * as server from '../entries/pages/auth/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.b36de6dc.js","_app/immutable/chunks/scheduler.be341df6.js","_app/immutable/chunks/index.d2fb6592.js","_app/immutable/chunks/Logo.svg.0cb9802c.js","_app/immutable/chunks/paths.17cc3ada.js"];
export const stylesheets = [];
export const fonts = [];
