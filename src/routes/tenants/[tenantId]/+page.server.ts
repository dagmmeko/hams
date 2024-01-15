import { prisma } from '$lib/utils/prisma.js';

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
	return { tenant };
};
