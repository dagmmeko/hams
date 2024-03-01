import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import { uploadFileToS3 } from '$lib/utils/aws-file.js';
import type { ContactSource } from '@prisma/client';

const addTenantSchema = z.object({
	fullName: z.string(),
	companyName: z.string(),
	phoneNumber: z.string(),
	purposeOfRent: z.string(),
	contractStartDate: z.date(),
	contractEndDate: z.date(),
	durationOfStayInCountry: z.number(),
	email: z.string().email(),
	emergencyContactName: z.string(),
	emergencyContactPhoneNumber: z.string(),
	emergencyContactEmail: z.string().email(),
	tenantScore: z.number().optional(),
	rentalUnitsId: z.number(),
	newPrice: z.number().optional(),
	priceChange: z.boolean().optional(),
	passportNumber: z.string().optional(),
	tinNumber: z.string().optional(),
	contactSource: z.string().optional(),
	securityDeposit: z.number().optional()
});

export const load = async (event) => {
	const addTenantForm = await superValidate(addTenantSchema);

	const rentalUnits = await prisma.rentalUnits.findMany({
		where: {
			deletedAt: null,
			active: false
		}
	});

	return { addTenantForm, rentalUnits };
};

export const actions = {
	addTenant: async (event) => {
		const data = await event.request.clone().formData();
		const tenantFile = data.getAll('tenantFile');

		tenantFile.map(async (file) => {
			if (!(file instanceof File)) {
				return fail(500, { addTenantForm, errorMessage: 'Issue with the file uploaded.' });
			}
		});
		const addTenantForm = await superValidate(event.request.clone(), addTenantSchema);

		if (!addTenantForm) {
			return fail(400, { addTenantForm });
		}

		try {
			const addTenant = await prisma.tenants.create({
				data: {
					fullName: addTenantForm.data.fullName,
					phoneNumber: addTenantForm.data.phoneNumber,
					email: addTenantForm.data.email,
					emergencyContactName: addTenantForm.data.emergencyContactName,
					emergencyContactPhoneNumber: addTenantForm.data.emergencyContactPhoneNumber,
					emergencyContactEmail: addTenantForm.data.emergencyContactEmail,
					passportNumber: addTenantForm.data.passportNumber,
					tenantScore: addTenantForm.data.tenantScore,
					contactSource: addTenantForm.data.contactSource as ContactSource,
					...(addTenantForm.data.priceChange &&
						addTenantForm.data.newPrice && {
							PriceChange: {
								create: {
									price: addTenantForm.data.newPrice,
									unitId: addTenantForm.data.rentalUnitsId
								}
							}
						}),
					...(!addTenantForm.data.priceChange && {
						TenantRental: {
							create: {
								unitId: addTenantForm.data.rentalUnitsId,
								purposeOfRent: addTenantForm.data.purposeOfRent,
								contractStartDate: addTenantForm.data.contractStartDate,
								contractEndDate: addTenantForm.data.contractEndDate,
								companyName: addTenantForm.data.fullName,
								durationOfStayInCountry: addTenantForm.data.durationOfStayInCountry,
								active: addTenantForm.data.priceChange ? false : true,
								tinNumber: addTenantForm.data.tinNumber,
								securityDeposit: addTenantForm.data.securityDeposit
							}
						}
					})
				}
			});

			if (!addTenant) return fail(500, { addTenantForm, errorMessage: 'Tenant not created.' });

			//update unit status
			if (!addTenantForm.data.priceChange) {
				await prisma.rentalUnits.update({
					where: {
						id: addTenantForm.data.rentalUnitsId
					},
					data: {
						active: true
					}
				});
			}

			//upload files
			tenantFile.map(async (file) => {
				if (!(file instanceof File) || file.size === 0) {
					return fail(500, { errorMessage: 'Issue with the file uploaded.' });
				}
				const buffer = await file.arrayBuffer();
				const send = Buffer.from(buffer);
				try {
					const fileUpload = await uploadFileToS3(`tenantsFile/${addTenant.id}/${file.name}`, send);

					if (fileUpload) {
						await prisma.file.create({
							data: {
								key: `tenantsFile/${addTenant.id}/${file.name}`,
								fileName: file.name,
								TenantsFile: {
									create: {
										tenantsId: Number(addTenant.id)
									}
								}
							}
						});
					}
				} catch (error) {
					console.log(error as Error);
				}
			});

			return { addTenantForm, addTenant };
		} catch (error) {
			return fail(500, { addTenantForm, errorMessage: 'Tenant not created.' });
		}
	}
};
