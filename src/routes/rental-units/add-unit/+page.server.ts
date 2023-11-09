import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const addUnitSchema = z.object({
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
	const addUnitForm = await superValidate(addUnitSchema);
	return { addUnitForm };
};

export const actions = {
	addUnit: async (event) => {
		const addUnitForm = await superValidate(event.request, addUnitSchema);

		if (!addUnitForm) {
			return fail(400, { addUnitForm });
		}

		console.log({ addUnitForm: addUnitForm.data });

		const addUnit = await prisma.rentalUnits.create({
			data: {
				roomNumber: addUnitForm.data.roomNumber,
				floor: addUnitForm.data.floor,
				kareMeter: addUnitForm.data.size,
				price: addUnitForm.data.price,
				unitType: addUnitForm.data.unitType,
				maximumTenants: addUnitForm.data.maximumTenants,
				minimumRentalDate: addUnitForm.data.minimumRentalDate,
				Inspection: {
					create: {
						InspectionStatus: addUnitForm.data.condition,
						description: 'First Inspection',
						inspectionDate: new Date()
					}
				}
			}
		});

		return { addUnitForm, addUnit };
	}
};
