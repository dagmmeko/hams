import { prisma } from '$lib/utils/prisma.js';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const deleteUnitSchema = z.object({
	deleteUnitId: z.number().int()
});

export const load = async (event) => {
	const deleteUnitForm = await superValidate(deleteUnitSchema);
	const search = event.url.searchParams.get('search');

	const units = await prisma.rentalUnits.findMany({
		where: {
			...(search && {
				roomNumber: {
					contains: search
				}
			}),
			deletedAt: null
		},
		include: {
			Inspection: {
				orderBy: {
					inspectionDate: 'desc'
				},
				take: 1
			},
			TenantRental: {
				orderBy: {
					createdAt: 'desc'
				},
				take: 1,
				include: {
					Tenants: true
				}
			}
		}
	});

	return { deleteUnitForm, units };
};

export const actions = {
	archiveUnit: async (event) => {
		const deleteUnitForm = await superValidate(event.request, deleteUnitSchema);

		const deleteUnit = await prisma.rentalUnits.update({
			where: {
				id: Number(deleteUnitForm.data.deleteUnitId)
			},
			data: {
				deletedAt: new Date()
			}
		});

		return { deleteUnitForm, deleteUnit };
	}
};
