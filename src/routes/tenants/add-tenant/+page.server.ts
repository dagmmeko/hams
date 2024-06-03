import { prisma } from '$lib/utils/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import { getFile, uploadFileToS3 } from '$lib/utils/aws-file.js';
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
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'ADD_NEW_TENANT';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_NEW_TENANT';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const data = await event.request.clone().formData();

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
								companyName: addTenantForm.data.companyName,
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

			// if (!addTenantForm.data.priceChange) {
			// 	await prisma.rentalUnits.update({
			// 		where: {
			// 			id: addTenantForm.data.rentalUnitsId
			// 		},
			// 		data: {
			// 			active: true
			// 		}
			// 	});
			// }

			return {
				addTenantForm,
				addTenant
			};
		} catch (error) {
			return fail(500, { addTenantForm, errorMessage: 'Tenant not created.' });
		}
	}
};
