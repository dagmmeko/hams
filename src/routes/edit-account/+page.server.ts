import { prisma } from '$lib/utils/prisma.js';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editUserSchema = z.object({
	userName: z.string(),
	phoneNumber: z.string(),
	email: z.string().email(),
	address: z.string(),
	dateOfBirth: z.string(),
	bloodType: z.string(),
	height: z.number()
});
export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;
	const employee = await prisma.user.findFirst({
		where: {
			id: session?.authUser.id
		},
		include: {
			Employee: true
		}
	});

	const editUserForm = await superValidate(
		{
			userName: employee?.userName || '',
			phoneNumber: employee?.phoneNumber || '',
			email: employee?.email,
			address: employee?.Employee?.address,
			bloodType: employee?.Employee?.bloodType,
			height: employee?.Employee?.height
		},
		editUserSchema
	);

	return { editUserForm };
};
