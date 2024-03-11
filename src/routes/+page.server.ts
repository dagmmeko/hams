import { prisma } from '$lib/utils/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const usdRateSchema = z.object({
	id: z.number(),
	usdRate: z.number()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_OVERVIEW_PAGE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}

	// Unit Data
	const allUnits = await prisma.rentalUnits.findMany({
		orderBy: {
			floor: 'asc'
		}
	});
	const activeUnits = allUnits.filter((unit) => unit.active).length;
	const goodUnits = allUnits.filter(
		(unit) => unit.latestInspectionStatus === 'GOOD_CONDITION'
	).length;
	const repairUnits = allUnits.filter(
		(unit) => unit.latestInspectionStatus === 'NEEDS_REPAIR'
	).length;
	const badUnits = allUnits.filter(
		(unit) => unit.latestInspectionStatus === 'OUT_OF_SERVICE'
	).length;

	// USD Rate Data
	const usdRate = await prisma.currencyRate.findMany({});
	const usdRateForm = await superValidate(
		{
			id: usdRate[0]?.id,
			usdRate: usdRate[0]?.rate
		},
		usdRateSchema
	);

	// Tenant Data
	const tenants = await prisma.tenants.findMany({});

	const tenantFromWebsite = tenants.filter((tenant) => tenant.contactSource === 'WEBSITE').length;
	const tenantFromReferral = tenants.filter((tenant) => tenant.contactSource === 'REFERRAL').length;
	const tenantFromWalkIn = tenants.filter((tenant) => tenant.contactSource === 'WALK_IN').length;
	const tenantFromPhone = tenants.filter((tenant) => tenant.contactSource === 'PHONE').length;
	const tenantFromEmail = tenants.filter((tenant) => tenant.contactSource === 'EMAIL').length;
	const tenantFromSocial = tenants.filter(
		(tenant) => tenant.contactSource === 'SOCIAL_MEDIA'
	).length;
	const tenantFromBroker = tenants.filter((tenant) => tenant.contactSource === 'BROKER').length;
	const tenantFromOther = tenants.filter((tenant) => tenant.contactSource === 'OTHER').length;

	return {
		allUnits,
		activeUnits,
		goodUnits,
		repairUnits,
		badUnits,
		usdRateForm,
		tenantFromWebsite,
		tenantFromReferral,
		tenantFromWalkIn,
		tenantFromPhone,
		tenantFromEmail,
		tenantFromSocial,
		tenantFromBroker,
		tenantFromOther
	};
};

export const actions = {
	changeRate: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_DOLLAR_VALUE';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}

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
