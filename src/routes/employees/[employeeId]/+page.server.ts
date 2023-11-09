import { prisma } from '$lib/utils/prisma.js';
import type { EmploymentType } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editEmployeeSchema = z.object({
	userName: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	address: z.string(),
	roleId: z.number(),
	managerId: z.number(),
	hiredDate: z.date(),
	dob: z.date(),
	employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'TEMPORARY']),
	bloodType: z.string(),
	height: z.number(),

	jobTitle: z.string()
});
export type editEmployeeType = z.infer<typeof editEmployeeSchema>;

const addLeaveSchema = z.object({
	startingDate: z.date(),
	endDate: z.date(),
	description: z.string()
});

export const load = async (event) => {
	const addLeaveForm = await superValidate(addLeaveSchema);
	if (!event.params.employeeId) {
		throw error(404, 'Employee ID not found');
	}

	const allEmployees = await prisma.employee.findMany({
		where: {
			isFired: false,
			isSuspended: false
		},
		include: {
			User: true,
			Role: true,
			Manager: true
		}
	});

	const employee = await prisma.employee.findFirst({
		where: {
			id: parseInt(event.params.employeeId)
		},
		include: {
			Fired: true,
			Role: true,
			Suspensions: true,
			EmployeesLeaves: {
				include: {
					ApprovedBy: {
						include: {
							User: true
						}
					}
				}
			},
			Attendance: true,
			User: true,
			Manager: true
		}
	});
	if (!employee) {
		throw error(404, 'Employee not found');
	}
	const roles = await prisma.role.findMany({
		where: {
			deletedAt: null
		}
	});

	console.log({ employee });
	const editEmployeeForm = await superValidate(
		{
			userName: employee.User.userName || '',
			phoneNumber: employee.User.phoneNumber || '',
			email: employee.User.email || '',
			hiredDate: employee.hiredDate,
			address: employee.address || '',
			dob: employee.dateOfBirth || new Date(),
			// employmentType: employee.employmentType,
			bloodType: employee.bloodType,
			height: employee.height,
			jobTitle: employee.jobTitle,
			roleId: employee.Role.id,
			managerId: employee.Manager?.id
		},
		editEmployeeSchema
	);

	return { addLeaveForm, editEmployeeForm, employee, roles, allEmployees };
};

export const actions = {
	editEmployeeInfo: async (event) => {
		const editEmployeeForm = await superValidate(event.request, editEmployeeSchema);
		if (!editEmployeeForm) {
			return fail(400, { editEmployeeForm });
		}

		console.log({ editEmployeeForm });

		const employee = await prisma.employee.update({
			where: {
				id: parseInt(event.params.employeeId)
			},
			data: {
				hiredDate: editEmployeeForm.data.hiredDate,
				address: editEmployeeForm.data.address,
				dateOfBirth: editEmployeeForm.data.dob,
				EmploymentType: editEmployeeForm.data.employmentType as EmploymentType,
				bloodType: editEmployeeForm.data.bloodType,
				height: editEmployeeForm.data.height,
				jobTitle: editEmployeeForm.data.jobTitle,
				roleId: editEmployeeForm.data.roleId,
				managerUserId: editEmployeeForm.data.managerId
			}
		});

		const user = await prisma.user.update({
			where: {
				id: employee.userId
			},
			data: {
				userName: editEmployeeForm.data.userName,
				phoneNumber: editEmployeeForm.data.phoneNumber,
				email: editEmployeeForm.data.email
			}
		});

		return { editEmployeeForm, employee, user };
	},
	addLeave: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const addLeaveForm = await superValidate(event.request, addLeaveSchema);

		const leave = await prisma.employee.update({
			where: {
				id: Number(event.params.employeeId)
			},
			data: {
				onLeave: true,
				EmployeesLeaves: {
					create: {
						description: addLeaveForm.data.description,
						startingDate: addLeaveForm.data.startingDate,
						endDate: addLeaveForm.data.endDate,
						// @ts-ignore
						creatorId: session?.authUser.Employee.id
					}
				}
			}
		});

		return { addLeaveForm, leave };
	},
	markAbsent: async (event) => {
		const absent = await prisma.attendance.create({
			data: {
				employeeId: Number(event.params.employeeId),
				description: 'Absent'
			}
		});

		console.log({ absent });
		return { absent };
	}
};
