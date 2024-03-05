import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const rentRoomSchema = z.object({
	purposeOfRent: z.string().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	selectedTenantId: z.string().optional(),
	selectedUnitId: z.string().optional(),
	duration: z.string().optional(),
	newPrice: z.string().optional(),
	priceChange: z.boolean().optional(),
	tinNumber: z.string().optional(),
	securityDeposit: z.number().optional(),
	companyName: z.string().optional()
});

export const load = async (event) => {
	const searchTenant = event.url.searchParams.get('searchTenant');
	const rentRoomForm = await superValidate(rentRoomSchema);

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

	return { tenants, rentRoomForm, rentalUnits };
};

export const actions = {
	rentRoom: async (event) => {
		const rentRoomForm = await superValidate(event.request, rentRoomSchema);

		if (!rentRoomForm) {
			return fail(400, { rentRoomForm });
		}

		console.log({ rentRoomForm: rentRoomForm.data });

		const rentTenant = await prisma.tenants
			.update({
				where: {
					id: Number(rentRoomForm.data.selectedTenantId)
				},
				data: {
					...(rentRoomForm.data.priceChange &&
						rentRoomForm.data.newPrice && {
							PriceChange: {
								create: {
									price: Number(rentRoomForm.data.newPrice),
									unitId: Number(rentRoomForm.data.selectedUnitId)
								}
							}
						}),
					...(!rentRoomForm.data.priceChange && {
						TenantRental: {
							create: {
								RentalUnits: {
									connect: {
										id: Number(rentRoomForm.data.selectedUnitId)
									}
								},
								purposeOfRent: rentRoomForm.data.purposeOfRent ?? '',
								contractStartDate: new Date(rentRoomForm.data.startDate ?? Date.now()),
								contractEndDate: new Date(rentRoomForm.data.endDate ?? Date.now()),
								durationOfStayInCountry: Number(rentRoomForm.data.duration),
								active: rentRoomForm.data.priceChange ? false : true,
								tinNumber: rentRoomForm.data.tinNumber,
								securityDeposit: rentRoomForm.data.securityDeposit,
								companyName: rentRoomForm.data.companyName
							}
						}
					})
				}
			})
			.catch((e) => console.error(e));

		if (!rentTenant) return fail(500, { errorMessage: 'Tenant not rented.' });

		await prisma.rentalUnits.update({
			where: {
				id: Number(rentRoomForm.data.selectedUnitId)
			},
			data: {
				active: true
			}
		});

		return { rentTenant, rentRoomForm };
	}
};
