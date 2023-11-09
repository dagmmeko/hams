import { prisma } from '$lib/utils/prisma.js';
import type { PropertyStatus } from '@prisma/client';
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
	numberofUnits: z.number().int()
});

const addAmenitySchema = z.object({
	name: z.string(),
	description: z.string(),
	paid: z.boolean(),
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
							numberofUnits: Number(numberofUnits)
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

		console.log({ addAmenityForm: addAmenityForm.data });

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

		console.log(addAmenity);

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
	}
};
