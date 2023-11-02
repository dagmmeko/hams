import { prisma } from '$lib/utils/prisma.js';

export const load = async (event) => {
	const search = event.url.searchParams.get('search');

	const roles = await prisma.role.findMany({
		where: {
			...(search && {
				name: {
					contains: search
				}
			})
		},
		include: {
			Employees: true
		}
	});

	console.log({ roles });

	return { roles };
};
