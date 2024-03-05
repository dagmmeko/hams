import z from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma.js';

const addRoleSchema = z.object({
	name: z.string(),
	description: z.string(),
	scopes: z.string().array()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'ADD_ROLE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}
	const addRoleForm = await superValidate(addRoleSchema);
	return { addRoleForm };
};
export const actions = {
	addRole: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_ROLE';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const addRoleForm = await superValidate(event.request, addRoleSchema);
		if (!addRoleForm) {
			return fail(400, { addRoleForm });
		}

		const addRole = await prisma.role.create({
			data: {
				name: addRoleForm.data.name,
				description: addRoleForm.data.description,
				Scopes: {
					createMany: {
						data: [
							...addRoleForm.data.scopes.map((scope) => {
								return {
									name: scope
								};
							})
						]
					}
				}
			}
		});
		return { addRoleForm, addRole };
	}
};
