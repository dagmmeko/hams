import { prisma } from '$lib/utils/prisma.js';

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;
	const activeUnit = await prisma.rentalUnits.count({
		where: {
			active: true
		}
	});
	const allUnits = await prisma.rentalUnits.count();

	const tenants = await prisma.tenants.findMany({});

	const tenantFromWebsite = tenants.filter((tenant) => tenant.contactSource === 'WEBSITE').length;

	console.log(tenantFromWebsite);

	return {
		activeUnit,
		allUnits
	};
};
