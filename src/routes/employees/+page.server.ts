import { prisma } from '$lib/utils/prisma';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z, { unknown } from 'zod';
const addEmployeeSchema = z.object({
	userName: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	roleId: z.number(),
	hiredDate: z.string()
});

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

	console.log({ employees: employees[0].User });
	return { employees };
};

export const actions = {
	addEmployee: async (event) => {
		const addEmployeeForm = await superValidate(event.request, addEmployeeSchema);
		if (!addEmployeeForm) {
			return fail(400, { addEmployeeForm });
		}

		try {
			const user = await prisma.user.create({
				data: {
					userName: addEmployeeForm.data.userName,
					phoneNumber: addEmployeeForm.data.phoneNumber,
					email: addEmployeeForm.data.email
				}
			});
			const employee = await prisma.employee.create({
				data: {
					userId: user.id,
					roleId: addEmployeeForm.data.roleId,
					isFired: false,
					hiredDate: addEmployeeForm.data.hiredDate,
					isSuspended: false,
					staffIdNumber: `HAMS/${addEmployeeForm.data.roleId}/${user.id}`,
					address: 'address'
				}
			});
			return { user };
		} catch (error) {
			return fail(400, { addEmployeeForm, error });
		}
	}
};
