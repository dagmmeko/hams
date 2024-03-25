import { prisma } from '$lib/utils/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const addVendorSchema = z.object({
	name: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	address: z.string(),
	serviceDescription: z.string(),
	serviceType: z.enum(['CLEANING', 'ELECTRICITY', 'PLUMBING', 'PAINTING', 'SECURITY']),
	score: z.string(),
	tinNumber: z.string().optional()
});

const addTaskSchema = z.object({
	taskDescription: z.string(),
	paymentTerm: z.string(),
	regularJob: z.boolean().optional(),
	estimatedTime: z.string(),
	dueDate: z.date(),
	vendorId: z.number().int()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_VENDOR_PAGE';
	});

	if (!hasRole) {
		throw redirect(302, '/no-permission');
	}
	const addVendorForm = await superValidate(addVendorSchema);
	const addTaskForm = await superValidate(addTaskSchema);
	const searchVendor = event.url.searchParams.get('searchVendor');
	const searchTask = event.url.searchParams.get('searchTask');

	const vendor = await prisma.vendor.findMany({
		where: {
			...(searchVendor && {
				name: {
					contains: searchVendor
				}
			}),
			deletedAt: null
		}
	});
	const tasks = await prisma.vendorTask.findMany({
		where: {
			...(searchTask && {
				taskDescription: {
					contains: searchTask
				}
			}),
			deletedAt: null,
			taskStatus: {
				not: 'COMPLETED'
			}
		},
		include: {
			Vendor: true,
			CreatedBy: {
				include: {
					User: true,
					Role: true
				}
			}
		}
	});

	return { vendor, addVendorForm, tasks, addTaskForm };
};

export const actions = {
	addVendor: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_VENDOR';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const addVendorForm = await superValidate(event.request, addVendorSchema);
		if (!addVendorForm) {
			return fail(400, { addVendorForm });
		}

		const vendor = await prisma.vendor.create({
			data: {
				name: addVendorForm.data.name,
				phoneNumber: addVendorForm.data.phoneNumber,
				email: addVendorForm.data.email,
				address: addVendorForm.data.address,
				serviceDescription: addVendorForm.data.serviceDescription,
				serviceType: addVendorForm.data.serviceType,
				score: addVendorForm.data.score,
				tinNumber: addVendorForm.data.tinNumber
			}
		});

		console.log({ vendor, data: addVendorForm.data });
		return {
			addVendorForm,
			vendor
		};
	},
	addVendorTask: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'ADD_TASK';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}
		const addTaskForm = await superValidate(event.request, addTaskSchema);
		if (!addTaskForm) {
			return fail(400, { addTaskForm });
		}

		const vendorTask = await prisma.vendorTask.create({
			data: {
				taskDescription: addTaskForm.data.taskDescription,
				paymentTerms: addTaskForm.data.paymentTerm,
				taskStatus: 'PENDING',
				regularJob: addTaskForm.data.regularJob ?? false,
				estimatedTimeToComplete: addTaskForm.data.estimatedTime,
				dueDate: addTaskForm.data.dueDate,
				vendorId: addTaskForm.data.vendorId,
				creatorEmployeeId: session?.authUser.Employee.id
			}
		});

		return {
			addTaskForm,
			vendorTask
		};
	}
};
