import { prisma } from '$lib/utils/prisma.js';
import type { InspectionStatus, UnitType } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const deleteUnitSchema = z.object({
	deleteUnitId: z.number().int()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_RENTAL_UNITS_PAGE';
	});

	if (!hasRole) {
		redirect(302, '/no-permission');
	}

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

			...(condition && {
				latestInspectionStatus: condition
			}),

			...(status === 'vacant'
				? {
						active: false
					}
				: status === 'occupied'
					? {
							active: true
						}
					: null),
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ARCHIVE_RENTAL_UNIT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
