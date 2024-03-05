import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_ACCOUNT_PAGE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}
};
