import { prisma } from '$lib/utils/prisma.js';

export const load = async (event) => {
	const tenant = await prisma.tenants.findFirst({
		where: {
			id: Number(event.params.tenantId)
		}
	});
	return { tenant };
};
