import { S3_BUCKET_NAME } from '$env/static/private';
import { getFile, s3 } from '$lib/utils/aws-file.js';
import { prisma } from '$lib/utils/prisma.js';
import type { InspectionStatus, PropertyStatus } from '@prisma/client';
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

const addPropertySchema = z.object({
	name: z.string(),
	description: z.string(),
	propertyStatus: z.enum(['DAMAGED', 'NEEDS_REPAIR', 'MISSING_ITEMS', 'GOOD_CONDITION']),
	numberofUnits: z.number().int(),
	price: z.number(),
	available: z.boolean().optional()
});

const addAmenitySchema = z.object({
	name: z.string(),
	description: z.string(),
	paid: z.boolean().optional(),
	price: z.number()
});
export const load = async (event) => {
	const addPropertyForm = await superValidate(addPropertySchema);
	const addAmenityForm = await superValidate(addAmenitySchema);
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
			TenantRental: {
				orderBy: {
					createdAt: 'desc'
				},
				take: 1,
				include: {
					Tenants: true
				}
			},

			Property: true,
			Amenities: true,
			UnitsFile: {
				include: {
					File: true
				}
			}
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

	return { deleteUnitForm, unitDetails, editUnitForm, addPropertyForm, addAmenityForm };
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
		console.log(editUnit);

		return { editUnitForm, editUnit };
	},
	addProperty: async (event) => {
		const addPropertyForm = await superValidate(event.request, addPropertySchema);

		if (!addPropertyForm) {
			return fail(400, { addPropertyForm });
		}

		const addProperty = await prisma.rentalUnits.update({
			where: {
				id: Number(event.params.unitId)
			},
			data: {
				Property: {
					create: {
						name: addPropertyForm.data.name,
						description: addPropertyForm.data.description,
						propertyStatus: addPropertyForm.data.propertyStatus,
						numberofUnits: addPropertyForm.data.numberofUnits
					}
				}
			}
		});

		return { addPropertyForm, addProperty };
	},
	updateProperty: async (event) => {
		const data = await event.request.formData();
		const name = data.get('name');
		const description = data.get('description');
		const propertyStatus = data.get('propertyStatus') as PropertyStatus;
		const numberofUnits = data.get('numberofUnits');
		const propertyId = data.get('propertyId');
		const available = data.get('available');
		const price = data.get('price');

		console.log({ available });

		if (
			typeof name !== 'string' ||
			typeof description !== 'string' ||
			typeof numberofUnits !== 'string'
		) {
			return fail(500, { errorMessage: 'Query is not a string' });
		}

		const updateProperty = await prisma.rentalUnits.update({
			where: {
				id: Number(event.params.unitId)
			},
			data: {
				Property: {
					update: {
						where: {
							id: Number(propertyId)
						},
						data: {
							name,
							description,
							propertyStatus,
							numberofUnits: Number(numberofUnits),
							itemsPrice: Number(price),
							available: Boolean(available)
						}
					}
				}
			}
		});
		return { updateProperty };
	},
	addAmenity: async (event) => {
		const addAmenityForm = await superValidate(event.request, addAmenitySchema);

		if (!addAmenityForm) {
			return fail(400, { addAmenityForm });
		}

		const addAmenity = await prisma.rentalUnits.update({
			where: {
				id: Number(event.params.unitId)
			},
			data: {
				Amenities: {
					create: {
						name: addAmenityForm.data.name,
						description: addAmenityForm.data.description,
						paid: addAmenityForm.data.paid,
						price: addAmenityForm.data.price
					}
				}
			}
		});

		return { addAmenityForm, addAmenity };
	},
	updateAmenity: async (event) => {
		const data = await event.request.formData();
		const name = data.get('name');
		const description = data.get('description');
		const paid = data.get('paid');
		const price = data.get('price');

		if (typeof name !== 'string' || typeof description !== 'string' || typeof price !== 'string') {
			return fail(500, { errorMessage: 'Query is not a string' });
		}

		const updateAmenity = await prisma.rentalUnits.update({
			where: {
				id: Number(event.params.unitId)
			},
			data: {
				Amenities: {
					update: {
						where: {
							id: Number(data.get('amenityId'))
						},
						data: {
							name,
							description,
							paid: Boolean(paid),
							price: Number(price)
						}
					}
				}
			}
		});
	},
	editUnitFile: async (event) => {
		const data = await event.request.formData();
		const file = data.getAll('unitFile');

		const allNewFiles = file.map(async (file) => {
			if (!(file instanceof File)) {
				return fail(500, { errorMessage: 'Issue with the file uploaded.' });
			}
			const buffer = await file.arrayBuffer();
			const send = Buffer.from(buffer);
			try {
				await s3
					.putObject({
						Bucket: S3_BUCKET_NAME,
						Key: `unitFile/${event.params.unitId}/${file.name}`,
						Body: send
					})
					.promise();

				const newFile = await prisma.file.create({
					data: {
						key: `unitFile/${event.params.unitId}/${file.name}`,
						fileName: file.name,
						UnitsFile: {
							create: {
								rentalUnitId: Number(event.params.unitId)
							}
						}
					}
				});
			} catch (error) {
				console.log(error as Error);
			}
		});
		console.log(allNewFiles);
		// return { allNewFiles };
	},
	downloadUnitFile: async (event) => {
		const data = await event.request.formData();
		const unitKey = data.get('unitKey');

		console.log({ unitKey });

		if (typeof unitKey !== 'string') {
			return fail(500, { errorMessage: 'Issus with file download' });
		}

		const fileUrl = await getFile(unitKey);
		console.log(fileUrl);

		return { fileUrl };
	},
	deleteUnitFile: async (event) => {
		console.log('bitch');
		const data = await event.request.formData();
		const unitFileId = data.get('unitFileId');
		console.log(unitFileId);
		if (typeof unitFileId !== 'string') {
			return fail(500, { errorMessage: 'Issus with file download' });
		}

		const deleteFile = await prisma.file.delete({
			where: {
				id: Number(unitFileId)
			}
		});

		console.log(deleteFile);

		return { deleteFile };
	},
	archiveUnit: async (event) => {
		console.log('delete unit');
		const deletedUnit = await prisma.rentalUnits.update({
			where: { id: Number(event.params.unitId) },
			data: {
				deletedAt: new Date()
			}
		});

		if (!deletedUnit) {
			return fail(500, { errorMessage: 'Unit not deleted' });
		}
		return {
			deletedUnit
		};
	},
	addInspection: async (event) => {
		const data = await event.request.formData();

		const inspectionDate = data.get('inspectionDate');
		const inspectionDescription = data.get('inspectionDescription');
		const inspectionCondition = data.get('inspectionCondition');

		if (
			typeof inspectionDate !== 'string' ||
			typeof inspectionDescription !== 'string' ||
			typeof inspectionCondition !== 'string'
		) {
			return fail(500, { errorMessage: 'Query is not a string' });
		}

		const addInspection = await prisma.inspection.create({
			data: {
				inspectionDate: new Date(inspectionDate as string),
				description: inspectionDescription,
				InspectionStatus: inspectionCondition as InspectionStatus,
				rentalUnitsId: Number(event.params.unitId)
			}
		});

		return { addInspection };
	}
};
