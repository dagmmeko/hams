import { prisma } from '$lib/utils/prisma.js';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const approveRentSchema = z.object({
	purposeOfRent: z.string().optional(),
	durationOfStay: z.number().optional(),
	priceChangeId: z.number(),
	startDate: z.date(),
	endDate: z.date(),
	tinNumber: z.string().optional(),
	securityDeposit: z.number().optional()
});

export const load = async (event) => {
	const approveRentForm = await superValidate(approveRentSchema);
	const priceChange = await prisma.priceChange.findFirst({
		where: {
			id: Number(event.url.searchParams.get('priceChangeId'))
		},
		include: {
			RentalUnits: true
		}
	});

	if (!priceChange) {
		throw error(500, 'Invalid price change request..');
	}

	return {
		priceChange,
		approveRentForm
	};
};
export const actions = {
	rentApprovedRoom: async (event) => {
		const approveRentForm = await superValidate(event.request, approveRentSchema);

		console.log({ s: event.url.searchParams.get('priceChangeId') });
		const priceChangeRequest = await prisma.priceChange.findFirst({
			where: {
				id: approveRentForm.data.priceChangeId
			},
			include: {
				Tenant: true,
				RentalUnits: true
			}
		});
		console.log({ priceChangeRequest });

		if (!priceChangeRequest) {
			return fail(400, { approveRentForm, errorMessage: 'Invalid price change request.' });
		}
		console.log('hello');

		console.log({ approveRentForm });

		if (!approveRentForm) {
			return fail(400, { approveRentForm });
		}

		const tenant = await prisma.tenants.update({
			where: {
				id: priceChangeRequest?.Tenant?.id
			},
			data: {
				TenantRental: {
					create: {
						unitId: priceChangeRequest?.RentalUnits?.id,
						purposeOfRent: approveRentForm.data.purposeOfRent,
						contractStartDate: approveRentForm.data.startDate,
						contractEndDate: approveRentForm.data.endDate,
						durationOfStayInCountry: approveRentForm.data.durationOfStay,
						active: true,
						tinNumber: approveRentForm.data.tinNumber,
						securityDeposit: approveRentForm.data.securityDeposit
					}
				},
				PriceChange: {
					update: {
						where: {
							id: approveRentForm.data.priceChangeId
						},
						data: {
							active: true
						}
					}
				}
			}
		});

		if (!tenant) return fail(500, { approveRentForm, errorMessage: 'Tenant not rented.' });

		await prisma.rentalUnits.update({
			where: {
				id: priceChangeRequest?.RentalUnits?.id
			},
			data: {
				active: true
			}
		});
		return { approveRentForm, tenant };
	}
};
