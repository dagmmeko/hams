import { prisma } from '$lib/utils/prisma.js';
import type { InspectionStatus, UnitType } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const deleteUnitSchema = z.object({
	deleteUnitId: z.number().int()
});

export const load = async (event) => {
	const deleteUnitForm = await superValidate(deleteUnitSchema);
	const search = event.url.searchParams.get('search');
	const condition = event.url.searchParams.get('condition') as InspectionStatus;
	const status = event.url.searchParams.get('status');
	const unitType = event.url.searchParams.get('unitType') as UnitType;

	const units = await prisma.rentalUnits.findMany({
		where: {
			...(search && {
				roomNumber: {
					contains: search
				}
			}),

			...(status === 'vacant' && {
				TenantRental: {
					none: {
						active: true
					}
				}
			}),
			...(unitType && {
				unitType: unitType
			}),
			deletedAt: null
		},
		include: {
			Inspections: {
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
