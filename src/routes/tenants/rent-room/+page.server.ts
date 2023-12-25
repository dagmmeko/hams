import { prisma } from '$lib/utils/prisma.js';

export const load = async (event) => {
	const searchTenant = event.url.searchParams.get('searchTenant');

	console.log({ searchTenant });
	let tenants;
	if (searchTenant) {
		tenants = await prisma.tenants.findMany({
			where: {
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
			}
		});
	}

	const rentalUnits = await prisma.rentalUnits.findMany({
		where: {
			deletedAt: null,
			active: false
		}
	});

	return { tenants, rentalUnits };
};

export const actions = {
	rentRoom: async (event) => {
		const data = await event.request.formData();
		const purposeOfRent = data.get('purposeOfRent');
		const startDate = data.get('startDate');
	}
};
