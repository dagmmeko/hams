import { prisma } from '$lib/utils/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import bcrypt from 'bcrypt';

const addEmployeeSchema = z.object({
	userName: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	address: z.string(),
	roleId: z.number(),
	managerId: z.number(),
	hiredDate: z.date()
});

const encryptedPassword = await bcrypt.hash('Pass1234', 10);

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_EMPLOYEE_PAGE';
	});

	if (!hasRole) {
		redirect(302, '/no-permission');
	}
	const addEmployeeForm = await superValidate(addEmployeeSchema);
	const search = event.url.searchParams.get('search');

	const employees = await prisma.employee.findMany({
		where: {
			isFired: false,
			isSuspended: false,
			...(search && {
				User: {
					OR: [
						{ userName: { contains: search } },
						{ phoneNumber: { contains: search } },
						{ email: { contains: search } }
					]
				}
			})
		},
		include: {
			User: true,
			Role: true,
			Manager: true
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
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_EMPLOYEE';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const addEmployeeForm = await superValidate(event.request, addEmployeeSchema);
		if (!addEmployeeForm) {
			return fail(400, { addEmployeeForm });
		}

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
		let employee;
		if ('id' in user) {
			employee = await prisma.employee
				.create({
					data: {
						userId: user?.id,
						roleId: addEmployeeForm.data.roleId,
						isFired: false,
						hiredDate: addEmployeeForm.data.hiredDate,
						isSuspended: false,
						staffIdNumber: `HAMS/${addEmployeeForm.data.roleId}/${user.id}`,
						address: addEmployeeForm.data.address,
						managerUserId: addEmployeeForm.data.managerId
					}
				})
				.catch((e) => {
					return fail(400, { addEmployeeForm, e });
				});
		}

		return { addEmployeeForm, user, employee };
	}
};
