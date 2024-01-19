import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editTenantSchema = z.object({
	fullName: z.string(),
	companyName: z.string(),
	phoneNumber: z.string(),
	email: z.string().email(),
	emergencyContactName: z.string(),
	emergencyContactPhoneNumber: z.string(),
	emergencyContactEmail: z.string().email()
});

export const load = async (event) => {
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
			Receipts: true,
			TenantsFile: {
				include: {
					File: true
				}
			}
		}
	});

	const editTenantForm = await superValidate(
		{
			fullName: tenant?.fullName,
			companyName: tenant?.companyName,
			phoneNumber: tenant?.phoneNumber,
			email: tenant?.email ?? undefined,
			emergencyContactName: tenant?.emergencyContactName ?? undefined,
			emergencyContactPhoneNumber: tenant?.emergencyContactPhoneNumber ?? undefined,
			emergencyContactEmail: tenant?.emergencyContactEmail ?? undefined
		},
		editTenantSchema
	);

	return { editTenantForm, tenant };
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
				companyName: editTenantForm.data.companyName,
				phoneNumber: editTenantForm.data.phoneNumber,
				email: editTenantForm.data.email,
				emergencyContactName: editTenantForm.data.emergencyContactName,
				emergencyContactPhoneNumber: editTenantForm.data.emergencyContactPhoneNumber,
				emergencyContactEmail: editTenantForm.data.emergencyContactEmail
			}
		});
		return { editTenantForm, editTenant };
	}
};
