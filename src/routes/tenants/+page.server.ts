import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';

export const load = async (event) => {
	const searchTenant = event.url.searchParams.get('searchTenant');

	const tenants = await prisma.tenants.findMany({
		where: {
			deletedAt: null,
			...(searchTenant && {
				OR: [
					{
						fullName: {
							contains: searchTenant
						}
					},
					{
						email: {
							contains: searchTenant
						}
					},
					{
						phoneNumber: {
							contains: searchTenant
						}
					}
				]
			})
		}
	});

	const priceChangeRequest = await prisma.priceChange.findMany({
		where: {
			approved: null
		},
		include: {
			Tenant: true,
			RentalUnits: true
		}
	});
	if (!tenants) {
		return fail(400, { tenants });
	}
	return { tenants, priceChangeRequest };
};

export const actions = {
	acceptPending: async (event) => {
		const data = await event.request.formData();
		const priceChangeId = data.get('priceChangeId');

		if (!priceChangeId && typeof priceChangeId !== 'string') {
			return fail(400, { errorMessage: 'Invalid priceChangeId' });
		}

		try {
			const priceChange = await prisma.priceChange.update({
				where: {
					id: Number(priceChangeId)
				},
				data: {
					approved: true,
					active: true
				}
			});

			const rentalUnit = await prisma.rentalUnits.update({
				where: {
					id: priceChange.unitId
				},
				data: {
					active: true,
					TenantRental: {
						create: {
							tenantId: priceChange.tenantId
						}
					}
				}
			});
			return { rentalUnit, priceChange };
		} catch (error) {
			console.log(error);
			return fail(400, { error });
		}
	},
	denyPending: async (event) => {
		const data = await event.request.formData();
		const priceChangeId = data.get('priceChangeId');

		if (!priceChangeId && typeof priceChangeId !== 'string') {
			return fail(400, { errorMessage: 'Invalid priceChangeId' });
		}
		try {
			const priceChange = await prisma.priceChange.update({
				where: {
					id: Number(priceChangeId)
				},
				data: {
					approved: false,
					active: false
				}
			});
			console.log({ priceChange });
			return { priceChange };
		} catch (error) {
			console.log(error);
			return fail(400, { error });
		}
	}
};
