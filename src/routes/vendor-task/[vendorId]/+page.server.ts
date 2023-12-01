import { prisma } from '$lib/utils/prisma.js';
import type { ServiceType } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editVendorSchema = z.object({
	name: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	ServiceType: z.enum(['CLEANING', 'ELECTRICITY', 'PLUMBING','PAINTING','SECURITY']),//
	CreatedAt: z.date(),// contract start date???
	score: z.string(),
});

export type vendorType = z.infer<typeof editVendorSchema>;


export const load = async (event) => {

	if (!event.params.vendorId) {
		throw error(404, 'Vendor ID not found');
	}

	const allVendors = await prisma.vendor.findMany();

	const vendor = await prisma.vendor.findFirst({
		where: {
			id: parseInt(event.params.vendorId)
			
		}	
	});

	
	if (!vendor) {
		throw error(404, 'Vendor not found');
	}


	const editVendorForm = await superValidate(
		{
			name: vendor.name || '',
			phoneNumber: vendor.phoneNumber || '',
			email: vendor.email || '',
			ServiceType: vendor.serviceType as ServiceType,
			CreatedAt: vendor.createdAt || '',// contract start date???
			score: vendor.score || '',

		},
		editVendorSchema
	);

	console.log('this is the '+ editVendorForm.data.name);
	return { editVendorForm,};
};

export const actions = {
	editVendorInfo: async (event) => {
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
			serviceType: editVendorForm.data.ServiceType as ServiceType,
			score: editVendorForm.data.score
			
			}
		});

	

		
	},

	
};
