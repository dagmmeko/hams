import { prisma } from '$lib/utils/prisma.js';
import { sendEmail } from '$lib/utils/send-email.js';
import { fail, redirect } from '@sveltejs/kit';

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
				take: 1,
				include: {
					RentalUnits: true
				}
			},
			Receipts: {
				orderBy: { createdAt: 'desc' },
				take: 1
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
	return { tenants, priceChangeRequest };
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

			await sendEmail(
				['dagixmeko@gmail.com'],
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
			await sendEmail(
				['dagixmeko@gmail.com'],
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
