const load = async (event) => {
  await event.locals.getSession();
};
export {
  load
};
