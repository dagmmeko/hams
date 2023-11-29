import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';

export const load = async (event) => {
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
		}
	});
	if (!tenants) {
		return fail(400, { tenants });
	}
	console.log(tenants);
	return { tenants };
};
