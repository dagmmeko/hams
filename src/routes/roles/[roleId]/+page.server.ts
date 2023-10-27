import { prisma } from '$lib/utils/prisma.js';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editRoleSchema = z.object({
	name: z.string(),
	description: z.string(),
	scopes: z.string().array()
});
export type editRoleType = z.infer<typeof editRoleSchema>;

export const load = async (event) => {
	const { roleId } = event.params;
	const role = await prisma.role.findUnique({
		where: {
			id: Number(roleId)
		},
		include: {
			Scopes: true
		}
	});

	if (!role) {
		throw error(500, 'Role information not found');
	}
	const editRoleForm = await superValidate(
		{
			name: role.name,
			description: role.description,
			scopes: role.Scopes.map((scope) => scope.name)
		} satisfies editRoleType,
		editRoleSchema
	);

	return { editRoleForm, role };
};

export const actions = {
	editRole: async (event) => {
		const editRoleForm = await superValidate(event.request, editRoleSchema);
		if (!editRoleForm) {
			return fail(400, { editRoleForm });
		}

		try {
			const roleNameExists = await prisma.role.findFirst({
				where: {
					name: editRoleForm.data.name
				}
			});

			if (roleNameExists) {
				return fail(500, {
					editRoleForm,
					errorMessage: `Role Name ${editRoleForm.data.name} is taken. Use a different name.`
				});
			}

			const editedRole = await prisma.role.update({
				where: { id: Number(event.params.roleId) },
				data: {
					name: editRoleForm.data.name,
					description: editRoleForm.data.description,
					updateAt: new Date(),
					Scopes: {
						deleteMany: {
							roleId: Number(event.params.roleId)
						},
						createMany: {
							data: editRoleForm.data.scopes.map((scope) => {
								return {
									name: scope
								};
							})
						}
					}
				}
			});
			if (!editedRole) {
				return fail(400, { editRoleForm, errorMessage: 'Role could not be updated' });
			}
			return {
				editedRole,
				editRoleForm
			};
		} catch (e) {
			console.error(e);
		}
	}
};
