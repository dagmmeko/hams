import { getFile } from '$lib/utils/aws-file.js'
import { prisma } from '$lib/utils/prisma.js'
import type { EmploymentType } from '@prisma/client'
import { error, fail, redirect } from '@sveltejs/kit'
import dayjs from 'dayjs'
import { superValidate } from 'sveltekit-superforms/server'
import z from 'zod'

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

	jobTitle: z.string(),
	emergencyContactName: z.string().optional(),
	emergencyContactPhoneNumber: z.string().optional(),
	emergencyContactEmail: z.string().optional(),
	suretyName: z.string().optional(),
	suretyPhoneNumber: z.string().optional(),
	suretyAddress: z.string().optional(),
})
export type editEmployeeType = z.infer<typeof editEmployeeSchema>

const addLeaveSchema = z.object({
	startingDate: z.date(),
	endDate: z.date(),
	description: z.string(),
})

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_EMPLOYEE_DETAIL_PAGE'
	})

	if (!hasRole) {
		redirect(302, '/no-permission')
	}
	const addLeaveForm = await superValidate(addLeaveSchema)
	if (!event.params.employeeId) {
		error(404, 'Employee ID not found')
	}

	const allEmployees = await prisma.employee.findMany({
		where: {
			isFired: false,
			isSuspended: false,
		},
		include: {
			User: true,
			Role: true,
			Manager: true,
		},
	})

	const employee = await prisma.employee.findFirst({
		where: {
			id: parseInt(event.params.employeeId),
		},
		include: {
			Fired: true,
			Role: true,
			Suspensions: true,
			EmployeesLeaves: {
				include: {
					ApprovedBy: {
						include: {
							User: true,
							Role: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			},
			Attendance: {
				include: {
					ApprovedBy: {
						include: {
							User: true,
							Role: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			},
			User: true,
			Manager: true,
			EmployeeFile: {
				include: {
					File: true,
				},
			},
		},
	})
	const attendanceDate1 = dayjs(employee?.Attendance[0]?.createdAt).format('YYYY-MM-DD')
	const attendanceDate2 = dayjs(new Date()).format('YYYY-MM-DD')
	const leaveDate1 = dayjs(employee?.EmployeesLeaves[0]?.endDate).format('YYYY-MM-DD')
	const leaveDate2 = dayjs(new Date()).format('YYYY-MM-DD')

	if (leaveDate1 > leaveDate2) {
		const updateLeave = await prisma.employee.update({
			where: {
				id: parseInt(event.params.employeeId),
			},
			data: {
				onLeave: false,
			},
		})
	}

	if (attendanceDate1 !== attendanceDate2) {
		const updateAttendance = await prisma.employee.update({
			where: {
				id: parseInt(event.params.employeeId),
			},
			data: {
				isAbsent: false,
			},
		})
	}

	if (!employee) {
		error(404, 'Employee not found')
	}
	const roles = await prisma.role.findMany({
		where: {
			deletedAt: null,
		},
	})

	const editEmployeeForm = await superValidate(
		{
			userName: employee.User.userName || '',
			phoneNumber: employee.User.phoneNumber || '',
			email: employee.User.email || '',
			hiredDate: employee.hiredDate,
			address: employee.address || '',
			dob: employee.dateOfBirth || new Date(),
			employmentType: employee.EmploymentType as EmploymentType,
			bloodType: employee.bloodType,
			height: employee.height,
			jobTitle: employee.jobTitle,
			roleId: employee.Role.id,
			managerId: employee.Manager?.id,
			emergencyContactName: employee.emergencyContactName || '',
			emergencyContactPhoneNumber: employee.emergencyContactPhoneNumber || '',
			emergencyContactEmail: employee.emergencyContactEmail || '',
			suretyName: employee.suretyName || '',
			suretyPhoneNumber: employee.suretyPhoneNumber || '',
			suretyAddress: employee.suretyAddress || '',
		},
		editEmployeeSchema,
	)

	return { addLeaveForm, editEmployeeForm, employee, roles, allEmployees }
}

export const actions = {
	editEmployeeInfo: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_EMPLOYEE'
		})

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' })
		}
		const editEmployeeForm = await superValidate(event.request, editEmployeeSchema)
		if (!editEmployeeForm) {
			return fail(400, { editEmployeeForm })
		}

		const employee = await prisma.employee.update({
			where: {
				id: parseInt(event.params.employeeId),
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
				managerUserId: editEmployeeForm.data.managerId,
				emergencyContactEmail: editEmployeeForm.data.emergencyContactEmail,
				emergencyContactName: editEmployeeForm.data.emergencyContactName,
				emergencyContactPhoneNumber: editEmployeeForm.data.emergencyContactPhoneNumber,
				suretyName: editEmployeeForm.data.suretyName,
				suretyPhoneNumber: editEmployeeForm.data.suretyPhoneNumber,
				suretyAddress: editEmployeeForm.data.suretyAddress,
			},
		})

		const user = await prisma.user.update({
			where: {
				id: employee.userId,
			},
			data: {
				userName: editEmployeeForm.data.userName,
				phoneNumber: editEmployeeForm.data.phoneNumber,
				email: editEmployeeForm.data.email,
			},
		})

		return { editEmployeeForm, employee, user }
	},
	addLeave: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_LEAVES'
		})

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' })
		}

		const addLeaveForm = await superValidate(event.request, addLeaveSchema)

		const leave = await prisma.employee.update({
			where: {
				id: Number(event.params.employeeId),
			},
			data: {
				onLeave: true,
				EmployeesLeaves: {
					create: {
						description: addLeaveForm.data.description,
						startingDate: addLeaveForm.data.startingDate,
						endDate: addLeaveForm.data.endDate,
						creatorId: session?.authUser.Employee.id || 0,
					},
				},
			},
		})

		return { addLeaveForm, leave }
	},
	markAbsent: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_ABSENT'
		})

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' })
		}
		const absent = await prisma.employee.update({
			where: {
				id: Number(event.params.employeeId),
				isAbsent: false,
			},
			data: {
				isAbsent: true,
				Attendance: {
					create: {
						description: 'Absent',
						creatorId: session?.authUser.Employee.id || 0,
					},
				},
			},
		})

		return { absent }
	},
	editAttendance: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_ABSENT'
		})

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' })
		}
		const data = await event.request.formData()
		const attendanceId = data.get('attendanceId')
		const description = data.get('description')

		if (typeof attendanceId !== 'string' || typeof description !== 'string') {
			return fail(500, { errorMessage: 'Query is not a string' })
		}

		const attendance = await prisma.attendance.update({
			where: {
				id: Number(attendanceId),
			},
			data: {
				description: description,
			},
		})

		return { attendance }
	},
	archiveEmployee: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'DELETE_EMPLOYEE'
		})

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' })
		}
		const employeeArchived = await prisma.employee.update({
			where: {
				id: parseInt(event.params.employeeId),
			},
			data: {
				isFired: true,
				deletedAt: null,
				User: {
					update: {
						jwtPassword: null,
					},
				},
			},
		})

		return { employeeArchived }
	},
	editLeave: async (event) => {
		const data = await event.request.formData()
		const leaveId = data.get('leaveId')
		const editedDescription = data.get('editedDescription')
		const editedStartingDate = data.get('editedStartingDate')
		const editedEndDate = data.get('editedEndDate')

		if (!leaveId || typeof leaveId !== 'string') {
			return fail(500, { errorMessage: 'Wrong leaves id.' })
		}

		if (!editedDescription || typeof editedDescription !== 'string') {
			return fail(500, { errorMessage: 'Wrong edited description.' })
		}
		if (!editedStartingDate || typeof editedStartingDate !== 'string') {
			return fail(500, { errorMessage: 'Wrong edited starting date.' })
		}
		if (!editedEndDate || typeof editedEndDate !== 'string') {
			return fail(500, { errorMessage: 'Wrong edited end date.' })
		}

		const updatedLeave = await prisma.leaves.update({
			where: {
				id: Number(leaveId),
			},
			data: {
				description: editedDescription,
				startingDate: new Date(editedStartingDate),
				endDate: new Date(editedEndDate),
			},
		})

		return { updatedLeave }
	},
	editEmployeeFile: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null
		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_EMPLOYEE'
		})

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' })
		}

		const data = await event.request.formData()
		const fileNames = data.get('fileNames')
		if (typeof fileNames !== 'string') {
			return fail(500, { errorMessage: 'Issus with file upload' })
		}
		const names = fileNames.split(',')
		const allNewFiles = await Promise.all(
			names.map(async (file) => {
				const newFile = await prisma.file.create({
					data: {
						key: `employeeFiles/${event.params.employeeId}/${file}`,
						fileName: file,
						EmployeeFile: {
							create: {
								employeeId: Number(event.params.employeeId),
							},
						},
					},
				})
				return newFile
			}),
		)

		return { allNewFiles }
	},
	downloadEmployeeFile: async (event) => {
		const data = await event.request.formData()
		const employeeKey = data.get('employeeKey')

		if (typeof employeeKey !== 'string') {
			return fail(500, { errorMessage: 'Issus with file download' })
		}

		const fileUrl = await getFile(employeeKey)

		return { fileUrl }
	},
	deleteEmployeeFile: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_EMPLOYEE'
		})

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' })
		}
		const data = await event.request.formData()
		const employeeFileId = data.get('employeeFileId')

		if (typeof employeeFileId !== 'string') {
			return fail(500, { errorMessage: 'Issus with file deletion' })
		}
		const deleteFile = await prisma.file.delete({
			where: {
				id: Number(employeeFileId),
			},
		})

		return { deleteFile }
	},
}
