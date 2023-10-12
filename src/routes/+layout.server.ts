import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const languageActive = event.cookies.get('language');

	if (
		session === null &&
		event.url.pathname !== '/auth' &&
		event.url.pathname !== '/auth/signup' &&
		event.url.pathname !== '/auth/signup-error'
	) {
		throw redirect(308, '/auth');
	}

	return {
		session: session,
		languageActive
	};
}
