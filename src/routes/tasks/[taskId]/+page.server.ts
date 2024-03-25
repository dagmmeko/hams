import { prisma } from '$lib/utils/prisma.js';
import type { SeverityStatus, TaskStatus } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const editInternalTaskSchema = z.object({
	taskTitle: z.string(),
	taskDescription: z.string(),
	taskDueDate: z.date(),
	taskStatus: z.string(),
	assignedTo: z.number(),
	taskSeverity: z.string()
});

export const load = async (event) => {
	const employees = await prisma.employee.findMany({
		where: {
			isFired: false,
			deletedAt: null
		},
		include: {
			User: true,
			Role: true
		}
	});
	const internalTask = await prisma.internalTask.findFirst({
		where: {
			id: Number(event.params.taskId),
			deletedAt: null
		},
		include: {
			AssignedTo: {
				include: {
					User: true,
					Role: true
				}
			},
			CreatedBy: {
				include: {
					User: true,
					Role: true
				}
			}
		}
	});

	const editInternalTaskForm = await superValidate(
		{
			taskTitle: internalTask?.title,
			taskDescription: internalTask?.description,
			taskDueDate: internalTask?.dueDate,
			taskStatus: internalTask?.taskStatus,
			assignedTo: internalTask?.assignedEmployeeId,
			taskSeverity: internalTask?.taskSeverity
		},
		editInternalTaskSchema
	);

	return { internalTask, editInternalTaskForm, employees };
};
export const actions = {
	editInternalTask: async (event) => {
		const editInternalTaskForm = await superValidate(event.request, editInternalTaskSchema);
		if (!editInternalTaskForm) {
			return fail(400, { editInternalTaskForm });
		}

		const updatedInternalTask = await prisma.internalTask.update({
			where: {
				id: Number(event.params.taskId)
			},
			data: {
				title: editInternalTaskForm.data.taskTitle,
				description: editInternalTaskForm.data.taskDescription,
				dueDate: editInternalTaskForm.data.taskDueDate,
				taskStatus: editInternalTaskForm.data.taskStatus as TaskStatus,
				assignedEmployeeId: editInternalTaskForm.data.assignedTo,
				taskSeverity: editInternalTaskForm.data.taskSeverity as SeverityStatus
			}
		});

		return { editInternalTaskForm, updatedInternalTask };
	}
};
