import { r as redirect } from "../../../chunks/index.js";
const load = async (event) => {
  const { session } = await event.parent();
  if (session)
    throw redirect(303, "/");
};
export {
  load
};
