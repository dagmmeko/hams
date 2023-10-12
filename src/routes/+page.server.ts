export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;
};
