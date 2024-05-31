import { uploadFileToS3, getFile } from '$lib/utils/aws-file.js';
import { prisma } from '$lib/utils/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
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
	isRentPayment: z.boolean().optional(),
	isBothPayment: z.boolean().optional(),
	amount: z.number(),
	receiptIssueDate: z.date(),
	receiptNumber: z.string(),
	depositedBank: z.string(),
	crvReceipt: z.boolean().optional()
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
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_TENANT_DETAIL_PAGE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}
	const addReceiptsForm = await superValidate(addReceiptsSchema);
	const extendRentForm = await superValidate(extendRentSchema);
	const endRentForm = await superValidate(endRentSchema);

	const tenant = await prisma.tenants.findFirst({
		where: {
			id: Number(event.params.tenantId),
			deletedAt: null
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
			PriceChange: {
				include: {
					RentalUnits: true
				}
			},
			Receipts: {
				include: {
					PayToUnit: true
				},
				orderBy: {
					endDate: 'desc'
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_TENANT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
				emergencyContactEmail: editTenantForm.data.emergencyContactEmail,
				passportNumber: editTenantForm.data.passportNumber
			}
		});
		return { editTenantForm, editTenant };
	},
	addReceipts: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_RECEIPT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
				paymentReason: addReceiptsForm.data.isBothPayment
					? 'Rent & Utility Payment'
					: addReceiptsForm.data.isRentPayment
					? 'Rent Payment'
					: 'Utility Payment',
				receiptReferenceNumber: addReceiptsForm.data.receiptNumber,
				tenantsId: Number(event.params.tenantId),
				payToUnitId: addReceiptsForm.data.payToUnit,
				isRentPayment: addReceiptsForm.data.isRentPayment,
				usdRateAtPayment: usdRate[0].rate,
				isUtilityAndRentPayment: addReceiptsForm.data.isBothPayment,
				crvReceipt: addReceiptsForm.data.crvReceipt
			}
		});

		return { addReceiptsForm, newReceipts };
	},
	extendRent: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EXTEND_RENT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'START_END_RENT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'END_CONTRACT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
	},
	downloadTenantFile: async (event) => {
		const data = await event.request.formData();
		const tenantKey = data.get('tenantKey');

		if (typeof tenantKey !== 'string') {
			return fail(500, { errorMessage: 'Issus with file download' });
		}

		const fileUrl = await getFile(tenantKey);

		return { fileUrl };
	},
	deleteTenantFile: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_TENANT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const data = await event.request.formData();
		const tenantFileId = data.get('tenantFileId');

		if (typeof tenantFileId !== 'string') {
			return fail(500, { errorMessage: 'Issus with file deletion' });
		}

		const deleteFile = await prisma.file.delete({
			where: {
				id: Number(tenantFileId)
			}
		});

		return { deleteFile };
	},
	editTenantFile: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_TENANT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const data = await event.request.formData();
		const fileNames = data.get('fileNames');
		if (typeof fileNames !== 'string') {
			return fail(500, { errorMessage: 'Issus with file upload' });
		}
		const names = fileNames.split(',');

		const allNewFiles = await Promise.all(
			names.map(async (file) => {
				const newFile = await prisma.file.create({
					data: {
						key: `tenantsFile/${event.params.tenantId}/${file}`,
						fileName: file,
						TenantsFile: {
							create: {
								tenantsId: Number(event.params.tenantId)
							}
						}
					}
				});
				return newFile;
			})
		);

		return { allNewFiles };
	},
	archiveTenant: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'DELETE_TENANT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}

		const archiveTenant = await prisma.tenants.update({
			where: {
				id: Number(event.params.tenantId)
			},
			data: {
				deletedAt: new Date()
			}
		});
	},
	updatePriceChange: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_PRICE_CHANGE';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}

		const data = await event.request.formData();
		const priceChangeId = data.get('priceChangeId');
		const priceChangeToggle = data.get('priceChangeToggle');

		console.log({ priceChangeToggle });

		if (typeof priceChangeId !== 'string' || typeof priceChangeToggle !== 'string') {
			return fail(500, { errorMessage: 'Issus with price change id or toggle' });
		}

		const updatePriceChange = await prisma.priceChange.update({
			where: {
				id: Number(priceChangeId)
			},
			data: {
				active: priceChangeToggle === 'on' ? true : false
			}
		});

		return { updatePriceChange };
	}
};
