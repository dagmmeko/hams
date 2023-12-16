

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.e7bcb5d9.js","_app/immutable/chunks/scheduler.be341df6.js","_app/immutable/chunks/index.d2fb6592.js","_app/immutable/chunks/stores.f92608b4.js","_app/immutable/chunks/singletons.a2a3f4d4.js","_app/immutable/chunks/paths.17cc3ada.js"];
export const stylesheets = [];
export const fonts = [];
