import { prisma } from '$lib/utils/prisma.js';

export const load = async (event) => {
	const roles = await prisma.role.findMany({
		include: {
			Employees: true
		}
	});

	return { roles };
};

export const actions =