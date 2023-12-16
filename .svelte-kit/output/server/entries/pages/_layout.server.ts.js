import { r as redirect } from "../../chunks/index.js";
async function load(event) {
  const session = await event.locals.getSession();
  if (session === null && event.url.pathname !== "/auth" && event.url.pathname !== "/auth/signup-error") {
    throw redirect(308, "/auth");
  }
  return {
    session
  };
}
export {
  load
};
