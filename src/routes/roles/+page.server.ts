import { prisma } from '$lib/utils/prisma.js';

export const load = async (event) => {
	const roles = await prisma.role.findMany({});
	return { roles };
};
