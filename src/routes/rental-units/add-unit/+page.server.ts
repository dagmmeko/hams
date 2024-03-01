import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import { uploadFileToS3 } from '$lib/utils/aws-file.js';
import { S3_BUCKET_NAME } from '$env/static/private';

const addUnitSchema = z.object({
	roomNumber: z.string(),
	floor: z.string(),
	size: z.number().default('' as unknown as number),
	price: z.number(),
	unitType: z.enum(['COMMERCIAL', 'RESIDENTIAL']),
	condition: z.enum(['NEEDS_REPAIR', 'OUT_OF_SERVICE', 'GOOD_CONDITION']),
	minimumRentalDate: z.number().int(),
	maximumTenants: z.number().int(),
	inBirr: z.boolean().optional(),
	perKare: z.boolean().optional()
});

export const load = async (event) => {
	const addUnitForm = await superValidate(addUnitSchema);
	return { addUnitForm };
};

export const actions = {
	addUnit: async (event) => {
		const addUnitForm = await superValidate(event.request.clone(), addUnitSchema);
		const data = await event.request.clone().formData();
		const unitFile = data.getAll('unitFile');

		unitFile.map(async (file) => {
			if (!(file instanceof File)) {
				return fail(500, { errorMessage: 'Issue with the file uploaded.' });
			}
		});

		if (!addUnitForm) {
			return fail(400, { addUnitForm });
		}

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
					}
				}
			});

			if (!addUnit) return fail(500, { errorMessage: 'Unit not created.' });

			unitFile.map(async (file) => {
				if (!(file instanceof File) || file.size === 0) {
					return fail(500, { errorMessage: 'Issue with the file uploaded.' });
				}
				const buffer = await file.arrayBuffer();
				const send = Buffer.from(buffer);

				try {
					const fileUpload = await uploadFileToS3(`unitFile/${addUnit.id}/${file.name}`, send);

					if (fileUpload) {
						await prisma.file.create({
							data: {
								key: `unitFile/${addUnit.id}/${file.name}`,
								fileName: file.name,
								UnitsFile: {
									create: {
										rentalUnitId: addUnit.id
									}
								}
							}
						});
					}
				} catch (error) {
					console.log(error as Error);
				}
			});
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
