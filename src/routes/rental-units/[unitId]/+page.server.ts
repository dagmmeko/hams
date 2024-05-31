import { uploadFileToS3, getFile } from '$lib/utils/aws-file.js';
import { prisma } from '$lib/utils/prisma.js';
import type { InspectionStatus, ItemsCategory, PropertyStatus } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const deleteUnitSchema = z.object({
	deleteUnitId: z.number().int()
});

const deletePropertySchema = z.object({
	propertyId: z.number().int()
});

const editUnitSchema = z.object({
	floor: z.string(),
	size: z.number(),
	price: z.number(),
	priceSetPerKare: z.boolean().optional(),
	roomNumber: z.string(),
	unitType: z.enum(['COMMERCIAL', 'RESIDENTIAL']),
	condition: z.enum(['NEEDS_REPAIR', 'OUT_OF_SERVICE', 'GOOD_CONDITION']),
	minimumRentalDate: z.number().int(),
	maximumTenants: z.number().int(),
	inBirr: z.boolean().optional(),
	utilityPrice: z.number().optional()
});

const addPropertySchema = z.object({
	name: z.string(),
	description: z.string(),
	propertyStatus: z.enum(['DAMAGED', 'NEEDS_REPAIR', 'MISSING_ITEMS', 'GOOD_CONDITION']),
	numberofUnits: z.number().int(),
	price: z.number(),
	available: z.boolean().optional(),
	inBirr: z.boolean().optional(),
	itemCategory: z.enum(['SALON', 'KITCHEN', 'BATHROOM', 'BEDROOM', 'LAUNDRY'])
});

const addAmenitySchema = z.object({
	name: z.string(),
	description: z.string(),
	paid: z.boolean().optional(),
	price: z.number()
});
export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_RENTAL_UNIT_DETAIL_PAGE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}
	const addPropertyForm = await superValidate(addPropertySchema);
	const addAmenityForm = await superValidate(addAmenitySchema);
	const deleteUnitForm = await superValidate(deleteUnitSchema);
	const deletePropertyForm = await superValidate(deletePropertySchema);

	const propertyCondition = event.url.searchParams.get('propertyCondition') as PropertyStatus;
	const propertyAvailability = event.url.searchParams.get('propertyAvailability');

	const unitDetails = await prisma.rentalUnits.findFirst({
		where: {
			id: Number(event.params.unitId),
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
			},

			Property: {
				where: {
					...(propertyCondition && {
						propertyStatus: propertyCondition
					}),
					...(propertyAvailability === 'true'
						? {
								available: true
						  }
						: propertyAvailability === 'false'
						? {
								available: false
						  }
						: {}),
					deletedAt: null
				}
			},
			Amenities: true,
			UnitsFile: {
				include: {
					File: true
				}
			}
		}
	});
	const allInspections = await prisma.inspection.findMany({
		where: {
			rentalUnitsId: Number(event.params.unitId)
		}
	});
	const editUnitForm = await superValidate(
		{
			roomNumber: unitDetails?.roomNumber,
			floor: unitDetails?.floor,
			size: unitDetails?.kareMeter,
			price: unitDetails?.price,
			priceSetPerKare: unitDetails?.priceSetPerKare,
			unitType: unitDetails?.unitType,
			condition: unitDetails?.Inspections[0].InspectionStatus,
			minimumRentalDate: unitDetails?.minimumRentalDate,
			maximumTenants: unitDetails?.maximumTenants,
			inBirr: unitDetails?.currency === 'ETB',
			utilityPrice: unitDetails?.utilityPrice
		},
		editUnitSchema
	);

	return {
		deleteUnitForm,
		unitDetails,
		editUnitForm,
		addPropertyForm,
		addAmenityForm,
		deletePropertyForm,
		allInspections
	};
};
export const actions = {
	editUnitInfo: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_RENTAL_UNIT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
				currency: editUnitForm.data.inBirr ? 'ETB' : 'USD',
				priceSetPerKare: editUnitForm.data.priceSetPerKare,
				maximumTenants: editUnitForm.data.maximumTenants,
				minimumRentalDate: editUnitForm.data.minimumRentalDate,
				utilityPrice: editUnitForm.data.utilityPrice
			}
		});
		console.log(editUnit);

		return { editUnitForm, editUnit };
	},
	addProperty: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_UNIT_PROPERTY';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const addPropertyForm = await superValidate(event.request, addPropertySchema);

		if (!addPropertyForm) {
			return fail(400, { addPropertyForm });
		}

		console.log({ addPropertyForm: addPropertyForm.data });

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
						numberofUnits: addPropertyForm.data.numberofUnits,
						itemsCurrency: addPropertyForm.data.inBirr ? 'ETB' : 'USD',
						itemsPrice: addPropertyForm.data.price,
						itemCategory: addPropertyForm.data.itemCategory,
						available: addPropertyForm.data.available
					}
				}
			}
		});

		return { addPropertyForm, addProperty };
	},
	updateProperty: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_UNIT_PROPERTY';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const data = await event.request.formData();
		const name = data.get('name');
		const description = data.get('description');
		const propertyStatus = data.get('propertyStatus') as PropertyStatus;
		const numberofUnits = data.get('numberofUnits');
		const propertyId = data.get('propertyId');
		const available = data.get('available');
		const price = data.get('price');
		const itemsCategory = data.get('itemCategory') as ItemsCategory;
		const inBirr = data.get('inBirr');

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
							available: Boolean(available),
							itemsCurrency: inBirr ? 'ETB' : 'USD',
							itemCategory: itemsCategory
						}
					}
				}
			}
		});
		return { updateProperty };
	},
	addAmenity: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_UNIT_AMENITIES';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_UNIT_AMENITIES';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_RENTAL_UNIT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const data = await event.request.formData();
		const file = data.getAll('unitFile');

		const allNewFiles = await Promise.all(
			file.map(async (file) => {
				if (!(file instanceof File)) {
					return fail(500, { errorMessage: 'Issue with the file uploaded.' });
				}

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
				return newFile;
			})
		);
		return { allNewFiles };
	},
	downloadUnitFile: async (event) => {
		const data = await event.request.formData();
		const unitKey = data.get('unitKey');

		console.log({ unitKey });

		if (typeof unitKey !== 'string') {
			return fail(500, { errorMessage: 'Issus with file download' });
		}

		const fileUrl = await getFile(unitKey);

		return { fileUrl };
	},
	deleteUnitFile: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_RENTAL_UNIT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const data = await event.request.formData();
		const unitFileId = data.get('unitFileId');
		console.log(unitFileId);
		if (typeof unitFileId !== 'string') {
			return fail(500, { errorMessage: 'Issus with file deletion' });
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ARCHIVE_RENTAL_UNIT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_NEW_INSPECTION';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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

		const addInspection = await prisma.rentalUnits.update({
			where: {
				id: Number(event.params.unitId)
			},
			data: {
				Inspections: {
					create: {
						inspectionDate: new Date(inspectionDate as string),
						description: inspectionDescription,
						InspectionStatus: inspectionCondition as InspectionStatus
					}
				},
				latestInspectionStatus: inspectionCondition as InspectionStatus
			}
		});

		return { addInspection };
	},
	deleteProperty: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'DELETE_UNIT_PROPERTY';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const deletePropertyForm = await superValidate(event.request, deletePropertySchema);

		if (!deletePropertyForm) {
			return fail(400, { deletePropertyForm });
		}

		const deleteProperty = await prisma.rentalUnits.update({
			where: {
				id: Number(event.params.unitId)
			},
			data: {
				Property: {
					delete: {
						id: deletePropertyForm.data.propertyId
					}
				}
			}
		});

		return { deletePropertyForm, deleteProperty };
	},
	deleteAmenity: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'DELETE_UNIT_AMENITIES';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}

		const data = await event.request.formData();
		const aminityId = data.get('amenityId');

		const deleteAmenity = await prisma.unitAmenities.delete({
			where: {
				id: Number(aminityId)
			}
		});

		return {
			deleteAmenity
		};
	}
};
