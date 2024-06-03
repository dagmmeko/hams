import { prisma } from '$lib/utils/prisma.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { key, fileName, type, id } = await request.json();

	try {
		const fileAdded = await prisma.file.create({
			data: {
				key: key,
				fileName: fileName,
				...(type === 'payment' && {
					PaymentFile: {
						create: {
							paymentId: Number(id)
						}
					}
				}),
				...(type === 'task' && {
					TaskFile: {
						create: {
							taskId: Number(id)
						}
					}
				}),
				...(type === 'vendor' && {
					VendorFile: {
						create: {
							vendorId: Number(id)
						}
					}
				}),
				...(type === 'Receipts' && {
					ReceiptsFile: {
						create: {
							receiptsId: Number(id)
						}
					}
				}),
				...(type === 'tenants' && {
					TenantsFile: {
						create: {
							tenantsId: Number(id)
						}
					}
				}),
				...(type === 'units' && {
					UnitsFile: {
						create: {
							rentalUnitId: Number(id)
						}
					}
				}),
				...(type === 'internalTask' && {
					InternalTaskFile: {
						create: {
							internalTaskId: Number(id)
						}
					}
				})
			}
		});

		return json({ fileAdded, type: 'SUCCESS' });
	} catch (error) {
		return json({ error, type: 'ERROR' });
	}
}
