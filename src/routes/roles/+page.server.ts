import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const deleteRoleSchema = z.object({
	deleteRoleId: z.number().int()
});

export const load = async (event) => {
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
