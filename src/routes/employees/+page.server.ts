import { prisma } from '$lib/utils/prisma';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import bcrypt from 'bcrypt';

const addEmployeeSchema = z.object({
	userName: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	roleId: z.number(),
	hiredDate: z.string()
});
const encryptedPassword = await bcrypt.hash('Pass1234', 10);

export const load = async () => {
	const addEmployeeForm = await superValidate(addEmployeeSchema);
	const employees = await prisma.employee.findMany({
		where: {
			isFired: false,
			isSuspended: false
		},
		include: {
			User: true,
			Role: true
		}
	});

	const roles = await prisma.role.findMany({
		where: {
			deletedAt: null
		}
	});

	return { roles, employees, addEmployeeForm };
};

export const actions = {
	addEmployee: async (event) => {
		const addEmployeeForm = await superValidate(event.request, addEmployeeSchema);
		if (!addEmployeeForm) {
			return fail(400, { addEmployeeForm });
		}

		console.log({ addEmployeeForm });

		const user = await prisma.user
			.create({
				data: {
					userName: addEmployeeForm.data.userName,
					phoneNumber: addEmployeeForm.data.phoneNumber,
					email: addEmployeeForm.data.email,
					jwtPassword: encryptedPassword
				}
			})
			.catch((e) => {
				return fail(400, { addEmployeeForm, e });
			});
		console.log({ user });
		if ('id' in user) {
			const employee = await prisma.employee
				.create({
					data: {
						userId: user?.id,
						roleId: addEmployeeForm.data.roleId,
						isFired: false,
						hiredDate: addEmployeeForm.data.hiredDate,
						isSuspended: false,
						staffIdNumber: `HAMS/${addEmployeeForm.data.roleId}/${user.id}`,
						address: 'address'
					}
				})
				.catch((e) => {
					return fail(400, { addEmployeeForm, e });
				});

			console.log({ employee });
		}

		return { addEmployeeForm, user };
	}
};
