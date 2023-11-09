import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const addVendorSchema = z.object({
	name: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	address: z.string(),
	serviceDescription: z.string(),
	serviceType: z.enum(['CLEANING', 'ELECTRICITY', 'PLUMBING', 'PAINTING', 'SECURITY']),
	score: z.string()
});

export const load = async () => {
	const addVendorForm = await superValidate(addVendorSchema);
	const vendor = await prisma.vendor.findMany({
		where: {
			deletedAt: null
		}
	});

	return { vendor, addVendorForm };
};

export const actions = {
	addVendor: async (event) => {
		const addVendorForm = await superValidate(event.request, addVendorSchema);
		if (!addVendorForm) {
			return fail(400, { addVendorForm });
		}

		const vendor = await prisma.vendor.create({
			data: {
				name: addVendorForm.data.name,
				phoneNumber: addVendorForm.data.phoneNumber,
				email: addVendorForm.data.email,
				address: addVendorForm.data.address,
				serviceDescription: addVendorForm.data.serviceDescription,
				serviceType: addVendorForm.data.serviceType,
				score: addVendorForm.data.score
			}
		});

		console.log({ vendor, data: addVendorForm.data });
		return {
			addVendorForm,
			vendor
		};
	}
};
