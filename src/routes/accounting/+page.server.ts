import { prisma } from '$lib/utils/prisma.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_ACCOUNT_PAGE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}

	const filterStartDate = event.url.searchParams.get('filterStartDate');
	const filterEndDate = event.url.searchParams.get('filterEndDate');

	const receipts = await prisma.receipts.findMany({
		...(filterStartDate !== null &&
			filterStartDate !== '' &&
			filterEndDate !== null &&
			filterEndDate !== '' && {
				where: {
					createdAt: {
						gte: new Date(filterStartDate),
						lte: new Date(filterEndDate)
					}
				}
			}),

		include: {
			PayToUnit: true,
			Tenants: true
		}
	});

	const tenantRentals = await prisma.tenantRental.findMany({
		include: {
			RentalUnits: true,
			Tenants: true
		}
	});
	console.log({ tenantRentals });

	// return the sum of amount from the receipts array if isRentalPayment is true
	const totalRentalPayment = receipts.reduce((acc, receipt) => {
		if (receipt.isRentPayment) {
			return acc + receipt.amount;
		} else if (receipt.isUtilityAndRentPayment && receipt.PayToUnit?.price) {
			//divide receipt.PayToUnit?.price with receipt.amount and return the reminder

			const num = Math.floor(receipt.amount / receipt.PayToUnit?.price);

			return acc + receipt.PayToUnit?.price * num;
		}
		return acc;
	}, 0);

	const crvReceipts = receipts.reduce((acc, receipt) => {
		if (receipt.crvReceipt) {
			return acc + receipt.amount;
		}
		return acc;
	}, 0);

	console.log({ tenantRentals });

	const totalSecurityDeposit = tenantRentals.reduce((acc, tenantRental) => {
		console.log({ tenantRental });

		if (tenantRental.active && tenantRental.securityDeposit !== null) {
			return acc + tenantRental?.securityDeposit;
		}
		return acc;
	}, 0);

	const paymentForVendor = await prisma.vendorTask.findMany({
		where: {
			...(filterStartDate !== null &&
				filterStartDate !== '' &&
				filterEndDate !== null &&
				filterEndDate !== '' && {
					createdAt: {
						gte: new Date(filterStartDate),
						lte: new Date(filterEndDate)
					}
				}),
			paymentStatus: true
		},
		include: {
			Vendor: true,
			Payment: true
		}
	});

	const totalSecurityFee = paymentForVendor.reduce((acc, vendorTask) => {
		if (vendorTask.Vendor?.serviceType === 'SECURITY') {
			return acc + (vendorTask.Payment?.amount || 0);
		}
		return acc;
	}, 0);

	const totalPlumbingFee = paymentForVendor.reduce((acc, vendorTask) => {
		if (vendorTask.Vendor?.serviceType === 'PLUMBING') {
			return acc + (vendorTask.Payment?.amount || 0);
		}
		return acc;
	}, 0);
	const totalElectricityFee = paymentForVendor.reduce((acc, vendorTask) => {
		if (vendorTask.Vendor?.serviceType === 'ELECTRICITY') {
			return acc + (vendorTask.Payment?.amount || 0);
		}
		return acc;
	}, 0);
	const totalCleaningFee = paymentForVendor.reduce((acc, vendorTask) => {
		if (vendorTask.Vendor?.serviceType === 'PAINTING') {
			return acc + (vendorTask.Payment?.amount || 0);
		}
		return acc;
	}, 0);
	const totalPaintingFee = paymentForVendor.reduce((acc, vendorTask) => {
		if (vendorTask.Vendor?.serviceType === 'PAINTING') {
			return acc + (vendorTask.Payment?.amount || 0);
		}
		return acc;
	}, 0);

	return {
		receipts,
		totalRentalPayment,
		totalSecurityDeposit,
		crvReceipts,
		totalCleaningFee,
		totalElectricityFee,
		totalPaintingFee,
		totalPlumbingFee,
		totalSecurityFee
	};
};
