import { prisma } from '$lib/utils/prisma.js';
import { sendEmail } from '$lib/utils/send-email.js';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { boolean } from 'zod';

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_TENANTS_PAGE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}
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
		},
		include: {
			TenantRental: {
				orderBy: { createdAt: 'desc' },
				include: {
					RentalUnits: true
				}
			},
			Receipts: {
				orderBy: { createdAt: 'desc' }
			}
		}
	});

	const priceChangeRequest = await prisma.priceChange.findMany({
		where: {
			active: null,
			deletedAt: null
		},
		include: {
			Tenant: true,
			RentalUnits: true
		}
	});

	if (!tenants) {
		return fail(400, { tenants });
	}

	const fullDataTenant = await Promise.all(
		tenants?.map(async (t) => {
			let someContractExpiresSoon: boolean = false;
			let someContractsExpired: boolean = false;
			let paymentDueSoon: boolean = false;
			let paymentExpired: boolean = false;

			for (const tr of t.TenantRental) {
				if (
					dayjs(tr.contractEndDate).isBefore(dayjs().add(10, 'days')) &&
					dayjs(tr.contractEndDate).isAfter(dayjs())
				) {
					someContractExpiresSoon = true;
				}
				if (dayjs(tr.contractEndDate).isBefore(dayjs())) {
					someContractsExpired = true;
				}

				const arrayReceipts = t.Receipts.filter((r) => r.payToUnitId === tr.unitId).sort(
					(a, b) => b.endDate.getTime() - a.endDate.getTime()
				);
				console.log({ arrayReceipts });
				for (let i = 0; i < arrayReceipts.length; i++) {
					if (!arrayReceipts[i].isRentPayment && !arrayReceipts[i].isUtilityAndRentPayment) {
						console.log('receipt not rent', arrayReceipts[i].paymentReason);
					} else {
						if (arrayReceipts[i].crvReceipt) {
							console.log('crv receipt', arrayReceipts[i].crvReceipt);
						} else {
							if (
								dayjs(arrayReceipts[i].endDate).isBefore(dayjs().add(10, 'days')) &&
								dayjs(arrayReceipts[i].endDate).isAfter(dayjs())
							) {
								paymentDueSoon = true;
								break;
							}
							if (dayjs(arrayReceipts[0].endDate).isBefore(dayjs())) {
								console.log('payment expired', arrayReceipts[0]);
								paymentExpired = true;
								break;
							}
						}
					}
				}
			}
			console.log({
				tenant: t.id,
				contractSoonExpires: someContractExpiresSoon,
				contractExpired: someContractsExpired,
				paymentDueSoon: paymentDueSoon,
				paymentExpired: paymentExpired
			});

			return {
				tenant: t,
				contractSoonExpires: someContractExpiresSoon,
				contractExpired: someContractsExpired,
				paymentDueSoon: paymentDueSoon,
				paymentExpired: paymentExpired
			};
		})
	);

	// console.log({ fullDataTenant: fullDataTenant[0] });

	return { tenants, priceChangeRequest, fullDataTenant };
};

export const actions = {
	acceptPending: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'APPROVE_PENDING';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
					approved: true
				},
				include: {
					RentalUnits: true,
					Tenant: true
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
				'Price change request approved',
				`Tenant ${priceChange.Tenant.fullName}'s price change request for ${priceChange.RentalUnits.roomNumber} from ${priceChange.RentalUnits.price} to ${priceChange.price} has been approved.`
			);

			return { priceChange };
		} catch (error) {
			console.log(error);
			return fail(400, { error });
		}
	},
	denyPending: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'APPROVE_PENDING';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
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
				},
				include: {
					RentalUnits: true,
					Tenant: true
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
				'Price change request denied',
				`Tenant ${priceChange.Tenant.fullName}'s price change request for ${priceChange.RentalUnits.roomNumber} from ${priceChange.RentalUnits.price} to ${priceChange.price} has been denied.`
			);
			return { priceChange };
		} catch (error) {
			console.log(error);
			return fail(400, { error });
		}
	}
};
