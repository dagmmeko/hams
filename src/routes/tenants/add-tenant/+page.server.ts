import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

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
	rentalUnitsId: z.number()
});

export const load = async (event) => {
	const addTenantForm = await superValidate(addTenantSchema);
	const rentalUnits = await prisma.rentalUnits.findMany({
		where: {
			deletedAt: null
		}
	});

	return { addTenantForm, rentalUnits };
};

export const actions = {
	addTenant: async (event) => {
		const addTenantForm = await superValidate(event.request, addTenantSchema);

		if (!addTenantForm) {
			return fail(400, { addTenantForm });
		}

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
				rentalUnitsId: addTenantForm.data.rentalUnitsId
			}
		});

		return { addTenantForm, addTenant };
	}
};
