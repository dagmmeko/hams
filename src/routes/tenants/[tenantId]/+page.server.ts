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
	emergencyContactEmail: z.string().email()
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

export const load = async (event) => {
	const addReceiptsForm = await superValidate(addReceiptsSchema);
	const tenant = await prisma.tenants.findFirst({
		where: {
			id: Number(event.params.tenantId)
		},
		include: {
			TenantRental: {
				include: {
					RentalUnits: true
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
				console.log({ receipt });
				return receipt.receiptReferenceNumber === receiptReferenceNumber.receiptReferenceNumber;
			})
		};
	});

	console.log({ allReceipts: groupedReceipts });

	const editTenantForm = await superValidate(
		{
			fullName: tenant?.fullName,
			phoneNumber: tenant?.phoneNumber,
			email: tenant?.email ?? undefined,
			emergencyContactName: tenant?.emergencyContactName ?? undefined,
			emergencyContactPhoneNumber: tenant?.emergencyContactPhoneNumber ?? undefined,
			emergencyContactEmail: tenant?.emergencyContactEmail ?? undefined
		},
		editTenantSchema
	);

	return { editTenantForm, addReceiptsForm, tenant, groupedReceipts };
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
				isRentPayment: !addReceiptsForm.data.isUtilityPayment
			}
		});

		return { addReceiptsForm, newReceipts };
	}
};
