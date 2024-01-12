import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';

export const actions = {
	rentApprovedRoom: async (event) => {
		const data = await event.request.formData();
		const purposeOfRent = data.get('purposeOfRent');
		const startDate = data.get('startDate');
		const endDate = data.get('endDate');
		const priceChangeId = data.get('priceChangeId');
		const durationOfStayInCountry = data.get('duration');

		const priceChangeRequest = await prisma.priceChange.findFirst({
			where: {
				id: Number(priceChangeId)
			},
			include: {
				Tenant: true,
				RentalUnits: true
			}
		});

		if (!priceChangeRequest) {
			return fail(400, { errorMessage: 'Invalid price change request.' });
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

		const tenant = await prisma.tenants.update({
			where: {
				id: priceChangeRequest?.Tenant?.id
			},
			data: {
				TenantRental: {
					create: {
						unitId: priceChangeRequest?.RentalUnits?.id,
						purposeOfRent: purposeOfRent ?? '',
						contractStartDate: new Date(parseInt(startDate ?? '')),
						contractEndDate: new Date(parseInt(endDate ?? '')),
						durationOfStayInCountry: Number(durationOfStayInCountry),
						active: true
					}
				},
				PriceChange: {
					update: {
						where: {
							id: Number(priceChangeId)
						},
						data: {
							active: true
						}
					}
				}
			}
		});

		if (!tenant) return fail(500, { errorMessage: 'Tenant not rented.' });

		await prisma.rentalUnits.update({
			where: {
				id: priceChangeRequest?.RentalUnits?.id
			},
			data: {
				active: true
			}
		});
		return { tenant };
	}
};
