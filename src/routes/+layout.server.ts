import { prisma } from '$lib/utils/prisma.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	if (
		session === null &&
		event.url.pathname !== '/auth' &&
		event.url.pathname !== '/auth/signup-error'
	) {
		redirect(308, '/auth');
	}
	const usdRate = await prisma.currencyRate.findMany({});

	return {
		session: session,
		usdRate
	};
}
