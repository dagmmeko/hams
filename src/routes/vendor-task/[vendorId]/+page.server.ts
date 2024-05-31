import { getFile, uploadFileToS3 } from '$lib/utils/aws-file.js';
import { prisma } from '$lib/utils/prisma.js';
import type { ServiceType } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editVendorSchema = z.object({
	name: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	address: z.string(),
	ServiceType: z.enum(['CLEANING', 'ELECTRICITY', 'PLUMBING', 'PAINTING', 'SECURITY']), //
	score: z.string(),
	serviceDescription: z.string()
});

const addPaymentSchema = z.object({
	amount: z.number(),
	depositedToBank: z.string(),
	paidOn: z.date(),
	taskId: z.number()
	//needs to have account Number
});

export type vendorType = z.infer<typeof editVendorSchema>;
export type paymentType = z.infer<typeof addPaymentSchema>;

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_VENDOR_DETAIL_PAGE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}
	if (!event.params.vendorId) {
		throw error(404, 'Vendor ID not found');
	}

	const vendor = await prisma.vendor.findFirst({
		where: {
			id: Number(event.params.vendorId)
		},
		include: {
			VendorTask: true,
			VendorFile: {
				include: {
					File: true
				}
			}
		}
	});

	if (!vendor) {
		throw error(404, 'Vendor not found');
	}

	const payments = await prisma.payment.findMany({
		where: {
			deletedAt: null,
			VendorTask: {
				vendorId: Number(event.params.vendorId),
				taskStatus: 'COMPLETED',
				paymentStatus: true
			}
		},
		include: {
			VendorTask: true
		}
	});

	const addPaymentForm = await superValidate(addPaymentSchema);

	const editVendorForm = await superValidate(
		{
			name: vendor.name || '',
			phoneNumber: vendor.phoneNumber || '',
			email: vendor.email || '',
			ServiceType: vendor.serviceType as ServiceType,
			score: vendor.score || '',
			serviceDescription: vendor.serviceDescription || '',
			address: vendor.address || ''
		},
		editVendorSchema
	);

	return { editVendorForm, payments, addPaymentForm, vendor };
};

export const actions = {
	editVendorInfo: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_VENDOR';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const editVendorForm = await superValidate(event.request, editVendorSchema);
		if (!editVendorForm) {
			return fail(400, { editVendorForm });
		}

		console.log({ editVendorForm });
		const vendor = await prisma.vendor.update({
			where: {
				id: parseInt(event.params.vendorId)
			},
			data: {
				name: editVendorForm.data.name,
				phoneNumber: editVendorForm.data.phoneNumber,
				email: editVendorForm.data.email,
				address: editVendorForm.data.address,
				serviceType: editVendorForm.data.ServiceType as ServiceType,
				score: editVendorForm.data.score,
				serviceDescription: editVendorForm.data.serviceDescription
			}
		});

		return { editVendorForm, vendor };
	},

	addPayment: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_PAYMENT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const addPaymentForm = await superValidate(event.request, addPaymentSchema);
		if (!addPaymentForm) {
			return fail(400, { addPaymentForm });
		}
		const vendorTask = await prisma.vendorTask.update({
			where: {
				id: addPaymentForm.data.taskId
			},
			data: {
				paymentStatus: true,
				taskStatus: 'COMPLETED',
				Payment: {
					create: {
						amount: addPaymentForm.data.amount,
						depositedToBank: addPaymentForm.data.depositedToBank,
						paidOn: addPaymentForm.data.paidOn
					}
				}
			}
		});

		return { addPaymentForm, vendorTask };
	},
	downloadVendorFile: async (event) => {
		const data = await event.request.formData();
		const vendorFileKey = data.get('vendorFileKey');
		if (typeof vendorFileKey !== 'string') {
			return fail(500, { errorMessage: 'Issus with file download' });
		}

		const vendorFileUrl = await getFile(vendorFileKey);

		return { vendorFileUrl };
	},
	deleteVendorFile: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_VENDOR';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const data = await event.request.formData();
		const deleteVendorFileId = data.get('deleteVendorFileId');

		if (typeof deleteVendorFileId !== 'string') {
			return fail(500, { errorMessage: 'Issus with file id' });
		}

		const deletedVendorFile = await prisma.file.delete({
			where: {
				id: Number(deleteVendorFileId)
			}
		});

		return { deletedVendorFile };
	},
	editVendorFile: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_VENDOR';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const data = await event.request.formData();
		const file = data.getAll('vendorFile');

		const allNewFiles = await Promise.all(
			file.map(async (file) => {
				if (!(file instanceof File)) {
					return fail(500, { errorMessage: 'Issue with the file uploaded.' });
				}

				const newFile = await prisma.file.create({
					data: {
						key: `vendorFile/${event.params.vendorId}/${file.name}`,
						fileName: file.name,
						VendorFile: {
							create: {
								vendorId: Number(event.params.vendorId)
							}
						}
					}
				});
				return newFile;
			})
		);

		return { allNewFiles };
	}
};
