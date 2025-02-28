import { prisma } from '$lib/utils/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const deleteRoleSchema = z.object({
	deleteRoleId: z.number().int()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_ROLES_PAGE';
	});

	if (!hasRole) {
		redirect(302, '/no-permission');
	}
	const deleteRoleForm = await superValidate(deleteRoleSchema);
	const search = event.url.searchParams.get('search');

	const roles = await prisma.role.findMany({
		where: {
			...(search && {
				name: {
					contains: search
				}
			}),
			deletedAt: null
		},
		include: {
			Employees: true
		}
	});

	return { deleteRoleForm, roles };
};

export const actions = {
	archiveRole: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'DELETE_ROLE';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const deleteRoleForm = await superValidate(event.request, deleteRoleSchema);

		const deleteRole = await prisma.role.update({
			where: {
				id: Number(deleteRoleForm.data.deleteRoleId)
			},
			data: {
				deletedAt: new Date()
			}
		});

		return { deleteRoleForm, deleteRole };
	}
};
