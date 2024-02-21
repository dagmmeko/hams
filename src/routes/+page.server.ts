import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const usdRateSchema = z.object({
	id: z.number(),
	usdRate: z.number()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;
	const activeUnit = await prisma.rentalUnits.count({
		where: {
			active: true
		}
	});
	const allUnits = await prisma.rentalUnits.count();

	const tenants = await prisma.tenants.findMany({});
	const usdRate = await prisma.currencyRate.findMany({});
	console.log({ usdRate });
	const usdRateForm = await superValidate(
		{
			id: usdRate[0]?.id,
			usdRate: usdRate[0]?.rate
		},
		usdRateSchema
	);

	const tenantFromWebsite = tenants.filter((tenant) => tenant.contactSource === 'WEBSITE').length;

	return {
		activeUnit,
		allUnits,
		usdRateForm
	};
};

export const actions = {
	changeRate: async (event) => {
		const usdRateForm = await superValidate(event.request, usdRateSchema);

		if (!usdRateForm) {
			return fail(400, { usdRateForm });
		}

		console.log({ usdRateForm });
		const updatedRate = await prisma.currencyRate.update({
			where: {
				id: usdRateForm.data.id
			},
			data: {
				rate: usdRateForm.data.usdRate
			}
		});

		return {
			usdRateForm,
			updatedRate
		};
	}
};
