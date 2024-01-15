import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';

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
				],
				deletedAt: null
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
		const endDate = data.get('endDate');
		const selectedTenantId = data.get('selectedTenantId');
		const rentalUnitId = data.get('selectedUnitId');
		const durationOfStayInCountry = data.get('duration');
		const newPrice = data.get('newPrice');
		const priceChange = data.get('priceChange');

		if (selectedTenantId && typeof selectedTenantId !== 'string') {
			return fail(400, { errorMessage: 'Invalid tenant id.' });
		}
		if (rentalUnitId && typeof rentalUnitId !== 'string') {
			return fail(400, { errorMessage: 'Invalid rental unit id.' });
		}
		if (purposeOfRent && typeof purposeOfRent !== 'string') {
			return fail(400, { errorMessage: 'Invalid purpose of rent.' });
		}
		if (startDate && typeof startDate !== 'string') {
			return fail(400, { errorMessage: 'Invalid start date.' });
		}
		if (endDate && typeof endDate !== 'string') {
			return fail(400, { errorMessage: 'Invalid end date.' });
		}
		if (durationOfStayInCountry && typeof durationOfStayInCountry !== 'string') {
			return fail(400, { errorMessage: 'Invalid duration of stay in country.' });
		}
		if (newPrice && typeof newPrice !== 'string') {
			return fail(400, { errorMessage: 'Invalid new price.' });
		}
		if (priceChange && typeof priceChange !== 'string') {
			return fail(400, { errorMessage: 'Invalid price change.' });
		}

		const rentTenant = await prisma.tenants.update({
			where: {
				id: Number(selectedTenantId)
			},
			data: {
				...(priceChange === 'on' &&
					newPrice && {
						PriceChange: {
							create: {
								price: Number(newPrice),
								unitId: Number(rentalUnitId)
							}
						}
					}),
				...(priceChange !== 'on' && {
					TenantRental: {
						create: {
							unitId: Number(rentalUnitId),
							purposeOfRent: purposeOfRent ?? '',
							contractStartDate: new Date(startDate ?? Date.now()),
							contractEndDate: new Date(endDate ?? Date.now()),
							durationOfStayInCountry: Number(durationOfStayInCountry),
							active: priceChange === 'on' ? false : true
						}
					}
				})
			}
		});

		if (!rentTenant) return fail(500, { errorMessage: 'Tenant not rented.' });

		if (priceChange !== 'on') {
			await prisma.rentalUnits.update({
				where: {
					id: Number(rentalUnitId)
				},
				data: {
					active: true
				}
			});
		}

		return { rentTenant };
	}
};
