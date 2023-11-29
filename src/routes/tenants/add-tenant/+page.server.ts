import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import { s3, getFile } from '$lib/utils/aws-file.js';
import { S3_BUCKET_NAME } from '$env/static/private';

const addTenantSchema = z.object({
	fullName: z.string(),
	phoneNumber: z.string(),
	purposeOfRent: z.string(),
	contractStartDate: z.date(),
	contractEndDate: z.date(),
	durationOfStayInCountry: z.number(),
	email: z.string().email(),
	emergencyContactName: z.string(),
	emergencyContactPhoneNumber: z.string(),
	emergencyContactEmail: z.string().email(),
	tenantScore: z.number(),
	rentalUnitsId: z.number(),
	newPrice: z.number().optional(),
	priceChange: z.boolean().optional()
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
				return fail(500, { errorMessage: 'Issue with the file uploaded.' });
			}
		});
		const addTenantForm = await superValidate(event.request.clone(), addTenantSchema);

		console.log({ addTenantForm });
		if (!addTenantForm) {
			return fail(400, { addTenantForm });
		}

		try {
			const addTenant = await prisma.tenants.create({
				data: {
					fullName: addTenantForm.data.fullName,
					phoneNumber: addTenantForm.data.phoneNumber,
					purposeOfRent: addTenantForm.data.purposeOfRent,
					contractStartDate: addTenantForm.data.contractStartDate,
					contractEndDate: addTenantForm.data.contractEndDate,
					durationOfStayInCountry: addTenantForm.data.durationOfStayInCountry,
					email: addTenantForm.data.email,
					emergencyContactName: addTenantForm.data.emergencyContactName,
					emergencyContactPhoneNumber: addTenantForm.data.emergencyContactPhoneNumber,
					emergencyContactEmail: addTenantForm.data.emergencyContactEmail,
					tenantScore: addTenantForm.data.tenantScore,
					rentalUnitsId: addTenantForm.data.rentalUnitsId,
					...(addTenantForm.data.priceChange &&
						addTenantForm.data.newPrice && {
							PriceChange: {
								create: {
									price: addTenantForm.data.newPrice,
									unitId: addTenantForm.data.rentalUnitsId,
									active: false
								}
							}
						}),
					...(!addTenantForm.data.priceChange && {
						TenantRental: {
							create: {
								unitId: addTenantForm.data.rentalUnitsId
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
						id: addTenant.rentalUnitsId
					},
					data: {
						active: true
					}
				});
			}

			//upload files
			tenantFile.map(async (file) => {
				if (!(file instanceof File)) {
					return fail(500, { errorMessage: 'Issue with the file uploaded.' });
				}
				console.log({ file });
				const buffer = await file.arrayBuffer();
				const send = Buffer.from(buffer);
				try {
					await s3
						.putObject({
							Bucket: S3_BUCKET_NAME,
							Key: `tenantsFile/${addTenant.id}/${file.name}`,
							Body: send
						})
						.promise();

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
