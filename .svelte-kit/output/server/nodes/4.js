import * as server from '../entries/pages/auth/signup-error/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/signup-error/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/signup-error/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.6a771fdb.js","_app/immutable/chunks/scheduler.be341df6.js","_app/immutable/chunks/index.d2fb6592.js"];
export const stylesheets = [];
export const fonts = [];
