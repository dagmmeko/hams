import { prisma } from '$lib/utils/prisma.js';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import { fail } from '@sveltejs/kit';
import type { SeverityStatus } from '@prisma/client';

const addInternalTaskSchema = z.object({
	taskTitle: z.string(),
	taskDescription: z.string(),
	taskDueDate: z.date(),
	assignedTo: z.number(),
	taskSeverity: z.string()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const addInternalTaskForm = await superValidate(addInternalTaskSchema);
	const internalTask = await prisma.internalTask.findMany({
		where: {
			deletedAt: null,
			taskStatus: {
				not: 'COMPLETED'
			}
		},
		include: {
			AssignedTo: {
				include: {
					User: true
				}
			},
			CreatedBy: {
				include: {
					User: true
				}
			}
		}
	});
	const employees = await prisma.employee.findMany({
		where: {
			isFired: false,
			deletedAt: null
		},
		include: {
			User: true
		}
	});

	return { internalTask, addInternalTaskForm, employees };
};

export const actions = {
	addInternalTask: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const addInternalTaskForm = await superValidate(event.request, addInternalTaskSchema);
		if (!addInternalTaskForm) {
			return fail(400, { addInternalTaskForm });
		}

		if (!session?.authUser.Employee.id) {
			return fail(400, { addInternalTaskForm, errorMessage: 'No session found.' });
		}

		const internalTask = await prisma.internalTask.create({
			data: {
				title: addInternalTaskForm.data.taskTitle,
				description: addInternalTaskForm.data.taskDescription,
				dueDate: addInternalTaskForm.data.taskDueDate,
				assignedEmployeeId: addInternalTaskForm.data.assignedTo,
				creatorEmployeeId: session?.authUser.Employee.id,
				taskStatus: 'PENDING',
				taskSeverity: addInternalTaskForm.data.taskSeverity as SeverityStatus
			}
		});
		return { internalTask, addInternalTaskForm };
	}
};
