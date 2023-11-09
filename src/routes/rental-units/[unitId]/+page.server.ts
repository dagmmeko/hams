import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const deleteUnitSchema = z.object({
	deleteUnitId: z.number().int()
});

const editUnitSchema = z.object({
	roomNumber: z.string(),
	floor: z.string(),
	size: z.number(),
	price: z.number(),
	unitType: z.enum(['COMMERCIAL', 'RESIDENTIAL']),
	condition: z.enum(['NEEDS_REPAIR', 'OUT_OF_SERVICE', 'GOOD_CONDITION']),
	minimumRentalDate: z.number().int(),
	maximumTenants: z.number().int()
});

export const load = async (event) => {
	const deleteUnitForm = await superValidate(deleteUnitSchema);
	const unitDetails = await prisma.rentalUnits.findFirst({
		where: {
			id: Number(event.params.unitId)
		},
		include: {
			Inspection: {
				orderBy: {
					inspectionDate: 'desc'
				},
				take: 1
			},
			Tenants: {
				orderBy: {
					createdAt: 'desc'
				},
				take: 1
			},
			Property: true,
			Amenities: true
		}
	});
	const editUnitForm = await superValidate(
		{
			roomNumber: unitDetails?.roomNumber,
			floor: unitDetails?.floor,
			size: unitDetails?.kareMeter,
			price: unitDetails?.price,
			unitType: unitDetails?.unitType,
			condition: unitDetails?.Inspection[0].InspectionStatus,
			minimumRentalDate: unitDetails?.minimumRentalDate,
			maximumTenants: unitDetails?.maximumTenants
		},
		editUnitSchema
	);

	return { deleteUnitForm, unitDetails, editUnitForm };
};
export const actions = {
	editUnitInfo: async (event) => {
		const editUnitForm = await superValidate(event.request, editUnitSchema);

		if (!editUnitForm) {
			return fail(400, { editUnitForm });
		}

		const editUnit = await prisma.rentalUnits.update({
			where: {
				id: Number(event.params.unitId)
			},
			data: {
				roomNumber: editUnitForm.data.roomNumber,
				floor: editUnitForm.data.floor,
				kareMeter: editUnitForm.data.size,
				price: editUnitForm.data.price,
				unitType: editUnitForm.data.unitType,
				maximumTenants: editUnitForm.data.maximumTenants,
				minimumRentalDate: editUnitForm.data.minimumRentalDate
			}
		});

		return { editUnitForm, editUnit };
	}
};
