import { prisma } from '$lib/utils/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import { uploadFileToS3 } from '$lib/utils/aws-file.js';
import { S3_BUCKET_NAME } from '$env/static/private';

const addUnitSchema = z.object({
	roomNumber: z.string(),
	floor: z.string(),
	size: z.number().default('' as unknown as number),
	price: z.number().optional(),
	unitType: z.enum(['COMMERCIAL', 'RESIDENTIAL']),
	condition: z.enum(['NEEDS_REPAIR', 'OUT_OF_SERVICE', 'GOOD_CONDITION']),
	minimumRentalDate: z.number().int(),
	maximumTenants: z.number().int(),
	inBirr: z.boolean().optional(),
	perKare: z.boolean().optional(),
	utilityPrice: z.number().optional()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'ADD_RENTAL_UNIT';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}

	const addUnitForm = await superValidate(addUnitSchema);
	return { addUnitForm };
};

export const actions = {
	addUnit: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_RENTAL_UNIT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const addUnitForm = await superValidate(event.request.clone(), addUnitSchema);

		if (!addUnitForm) {
			return fail(400, { addUnitForm });
		}

		console.log({a: addUnitForm.data});

		try {
			const addUnit = await prisma.rentalUnits.create({
				data: {
					roomNumber: addUnitForm.data.roomNumber,
					floor: addUnitForm.data.floor,
					kareMeter: addUnitForm.data.size,
					price: addUnitForm.data.price,
					unitType: addUnitForm.data.unitType,
					maximumTenants: addUnitForm.data.maximumTenants,
					minimumRentalDate: addUnitForm.data.minimumRentalDate,
					currency: addUnitForm.data.inBirr ? 'ETB' : 'USD',
					priceSetPerKare: addUnitForm.data.perKare,
					latestInspectionStatus: addUnitForm.data.condition,
					Inspections: {
						create: {
							InspectionStatus: addUnitForm.data.condition,
							description: 'First Inspection',
							inspectionDate: new Date()
						}
					},
					utilityPrice: addUnitForm.data.utilityPrice
				}
			});

			if (!addUnit) return fail(500, { errorMessage: 'Unit not created.' });

			return { addUnitForm, addUnit };
		} catch (error) {
			console.log(error as Error);
			return fail(500, {
				addUnitForm,
				errorMessage: (error as Error)?.message ?? 'Unknown error'
			});
		}
	}
};
