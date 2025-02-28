import { prisma } from '$lib/utils/prisma.js';
import { sendEmail } from '$lib/utils/send-email.js';
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
	securityDeposit: z.number().optional(),
	companyName: z.string().optional()
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
		error(500, 'Invalid price change request..');
	}

	return {
		priceChange,
		approveRentForm
	};
};
export const actions = {
	rentApprovedRoom: async (event) => {
		const approveRentForm = await superValidate(event.request, approveRentSchema);

		const priceChangeRequest = await prisma.priceChange.findFirst({
			where: {
				id: approveRentForm.data.priceChangeId
			},
			include: {
				Tenant: true,
				RentalUnits: true
			}
		});

		if (!priceChangeRequest) {
			return fail(400, { approveRentForm, errorMessage: 'Invalid price change request.' });
		}

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
						companyName: approveRentForm.data.companyName,
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

		const unit = await prisma.rentalUnits.update({
			where: {
				id: priceChangeRequest?.RentalUnits?.id
			},
			data: {
				active: true
			}
		});

		const emailsTpSendTo = await prisma.user.findMany({
			where: {
				Employee: {
					Role: {
						sendToEmail: true
					}
				}
			},
			select: {
				email: true
			}
		});

		await sendEmail(
			emailsTpSendTo,
			'Approved Tenant',
			`${tenant.fullName} has been approved to rent room ${unit.roomNumber}. With price change from ${unit.price} to ${priceChangeRequest.price}.`
		);

		return { approveRentForm, tenant };
	}
};
