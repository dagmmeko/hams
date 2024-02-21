import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editTenantSchema = z.object({
	fullName: z.string(),
	phoneNumber: z.string(),
	email: z.string().email(),
	emergencyContactName: z.string(),
	emergencyContactPhoneNumber: z.string(),
	emergencyContactEmail: z.string().email(),
	passportNumber: z.string().optional()
});

const addReceiptsSchema = z.object({
	payToUnit: z.number().int().positive(),
	paymentStartDate: z.date(),
	paymentEndDate: z.date(),
	isUtilityPayment: z.boolean().optional(),
	amount: z.number(),
	receiptIssueDate: z.date(),
	receiptNumber: z.string(),
	depositedBank: z.string()
});

const extendRentSchema = z.object({
	unitRenalId: z.number().int(),
	contractEndDate: z.date()
});

const endRentSchema = z.object({
	unitRenalId: z.number().int(),
	terminationReason: z.string()
});

export const load = async (event) => {
	const addReceiptsForm = await superValidate(addReceiptsSchema);
	const extendRentForm = await superValidate(extendRentSchema);
	const endRentForm = await superValidate(endRentSchema);

	const tenant = await prisma.tenants.findFirst({
		where: {
			id: Number(event.params.tenantId)
		},
		include: {
			TenantRental: {
				include: {
					RentalUnits: {
						include: {
							Inspections: {
								take: 1,
								orderBy: {
									inspectionDate: 'desc'
								}
							}
						}
					}
				}
			},
			PriceChange: true,
			Receipts: {
				include: {
					PayToUnit: true
				},
				orderBy: {
					createdAt: 'desc'
				}
			},
			TenantsFile: {
				include: {
					File: true
				}
			}
		}
	});

	const allReceipts = await prisma.receipts.groupBy({
		by: ['receiptReferenceNumber'],
		where: {
			tenantsId: Number(event.params.tenantId)
		}
	});

	let groupedReceipts = allReceipts.map((receiptReferenceNumber) => {
		return {
			receiptReferenceNumber: receiptReferenceNumber.receiptReferenceNumber,
			receipts: tenant?.Receipts.filter((receipt) => {
				return receipt.receiptReferenceNumber === receiptReferenceNumber.receiptReferenceNumber;
			})
		};
	});

	const editTenantForm = await superValidate(
		{
			fullName: tenant?.fullName,
			phoneNumber: tenant?.phoneNumber,
			email: tenant?.email ?? undefined,
			emergencyContactName: tenant?.emergencyContactName ?? undefined,
			emergencyContactPhoneNumber: tenant?.emergencyContactPhoneNumber ?? undefined,
			emergencyContactEmail: tenant?.emergencyContactEmail ?? undefined,
			passportNumber: tenant?.passportNumber ?? undefined
		},
		editTenantSchema
	);

	return { endRentForm, editTenantForm, addReceiptsForm, tenant, groupedReceipts, extendRentForm };
};

export const actions = {
	editTenant: async (event) => {
		const editTenantForm = await superValidate(event.request.clone(), editTenantSchema);
		if (!editTenantForm) {
			return fail(400, { editTenantForm });
		}

		const editTenant = await prisma.tenants.update({
			where: {
				id: Number(event.params.tenantId)
			},
			data: {
				fullName: editTenantForm.data.fullName,
				phoneNumber: editTenantForm.data.phoneNumber,
				email: editTenantForm.data.email,
				emergencyContactName: editTenantForm.data.emergencyContactName,
				emergencyContactPhoneNumber: editTenantForm.data.emergencyContactPhoneNumber,
				emergencyContactEmail: editTenantForm.data.emergencyContactEmail
			}
		});
		return { editTenantForm, editTenant };
	},
	addReceipts: async (event) => {
		const addReceiptsForm = await superValidate(event.request.clone(), addReceiptsSchema);

		if (!addReceiptsForm) {
			return fail(400, { addReceiptsForm });
		}

		const usdRate = await prisma.currencyRate.findMany({});

		const newReceipts = await prisma.receipts.create({
			data: {
				startDate: addReceiptsForm.data.paymentStartDate,
				endDate: addReceiptsForm.data.paymentEndDate,
				receiptReceived: addReceiptsForm.data.receiptNumber ? true : false,
				receiptReceivedOn: addReceiptsForm.data.receiptIssueDate,
				paymentConfirmed: addReceiptsForm.data.receiptNumber ? true : false,
				amount: addReceiptsForm.data.amount,
				bankName: addReceiptsForm.data.depositedBank,
				paymentReason: addReceiptsForm.data.isUtilityPayment ? 'Utility Payment' : 'Rent Payment',
				receiptReferenceNumber: addReceiptsForm.data.receiptNumber,
				tenantsId: Number(event.params.tenantId),
				payToUnitId: addReceiptsForm.data.payToUnit,
				isRentPayment: !addReceiptsForm.data.isUtilityPayment,
				usdRateAtPayment: usdRate[0].rate
			}
		});

		return { addReceiptsForm, newReceipts };
	},
	extendRent: async (event) => {
		const extendRentForm = await superValidate(event.request, extendRentSchema);
		if (!extendRentForm) {
			return fail(400, { extendRentForm });
		}

		console.log({ extendRentForm: extendRentForm.data });
		const updateEndDate = await prisma.tenantRental.update({
			where: {
				id: extendRentForm.data.unitRenalId
			},
			data: {
				contractEndDate: extendRentForm.data.contractEndDate
			}
		});

		return { extendRentForm, updateEndDate };
	},
	initialEndContract: async (event) => {
		const endRentForm = await superValidate(event.request, endRentSchema);
		if (!endRentForm) {
			return fail(400, { endRentForm });
		}

		console.log({ endRentForm: endRentForm.data });
		const updateEndDate = await prisma.tenantRental.update({
			where: {
				id: endRentForm.data.unitRenalId
			},
			data: {
				terminationReason: endRentForm.data.terminationReason,
				exitingTenant: true
			}
		});

		return { endRentForm, updateEndDate };
	},
	endContract: async (event) => {
		const data = await event.request.formData();
		const unitId = data.get('unitId');

		if (typeof unitId !== 'string') {
			return fail(500, { errorMessage: 'Issus with file download' });
		}

		const updateEnd = await prisma.tenantRental.update({
			where: {
				id: Number(unitId)
			},
			data: {
				active: false,
				RentalUnits: {
					update: {
						active: false
					}
				}
			}
		});

		return { updateEnd };
	}
};
