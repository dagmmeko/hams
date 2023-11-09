import { prisma } from '$lib/utils/prisma.js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editEmployeeSchema = z.object({
	userName: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	hiredDate: z.date(),
	address: z.string(),
	dob: z.date()
});
export type editEmployeeType = z.infer<typeof editEmployeeSchema>;

export const load = async (event) => {
	if (!event.params.employeeId) {
		throw error(404, 'Employee ID not found');
	}

	const employee = await prisma.employee.findFirst({
		where: {
			id: parseInt(event.params.employeeId)
		},
		include: {
			Fired: true,
			Role: true,
			Suspensions: true,
			EmployeesLeaves: true,
			Attendance: true,
			User: true
		}
	});
	if (!employee) {
		throw error(404, 'Employee not found');
	}

	const editEmployeeForm = await superValidate(
		{
			userName: employee.User.userName || '',
			phoneNumber: employee.User.phoneNumber || '',
			email: employee.User.email || '',
			hiredDate: employee.hiredDate,
			address: employee.address,
			dob: employee.dateOfBirth || new Date()
		} satisfies editEmployeeType,
		editEmployeeSchema
	);

	console.log({ employee });
	return { editEmployeeForm, employee };
};
