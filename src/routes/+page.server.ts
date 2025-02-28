import { updated } from '$app/stores';
import { prisma } from '$lib/utils/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const usdRateSchema = z.object({
	id: z.number(),
	usdRate: z.number()
});

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_OVERVIEW_PAGE';
	});

	if (!hasRole) {
		redirect(302, '/no-permission');
	}

	const filterStartDate = event.url.searchParams.get('filterStartDate');
	const filterEndDate = event.url.searchParams.get('filterEndDate');

	//fetch all vendors
	const vendors = await prisma.vendorTask.findMany({
		where: {
			deletedAt: null
		},
		orderBy: {
			createdAt: 'desc'
		},
		...(filterStartDate !== null &&
			filterStartDate !== '' &&
			filterEndDate !== null &&
			filterEndDate !== '' && {
				where: {
					createdAt: {
						gte: new Date(filterStartDate),
						lte: new Date(filterEndDate)
					}
				}
			})
	});
	// filter vendors tasks where the created date is between the start and end date

	const completedVendorTasks = vendors.filter((task) => task.taskStatus === 'COMPLETED').length;
	const pendingVendorTasks = vendors.filter((task) => task.taskStatus === 'PENDING').length;
	const inProgressVendorTasks = vendors.filter((task) => task.taskStatus === 'IN_PROGRESS').length;
	const checkingVendorTasks = vendors.filter((task) => task.taskStatus === 'CHECKING').length;

	const expiredVendorTasks = vendors.filter(
		(task) => task.taskStatus !== 'COMPLETED' && new Date(task.dueDate) > new Date()
	).length;

	//fetch all employees
	const employees = await prisma.employee.findMany({
		where: {
			deletedAt: null
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	const activeEmployees = employees.filter((employee) => !employee.isFired).length;
	const firedEmployees = employees.filter((employee) => employee.isFired).length;
	const onLeaveEmployees = employees.filter(
		(employee) => employee.onLeave && !employee.isFired
	).length;
	const absentEmployees = employees.filter(
		(employee) => employee.isAbsent && !employee.isFired
	).length;
	const fullTimeEmployees = employees.filter(
		(employee) => employee.EmploymentType === 'FULL_TIME' && !employee.isFired
	).length;
	const partTimeEmployees = employees.filter(
		(employee) => employee.EmploymentType === 'PART_TIME' && !employee.isFired
	).length;
	const temporaryEmployees = employees.filter(
		(employee) => employee.EmploymentType === 'TEMPORARY' && !employee.isFired
	).length;

	//fetch all internal tasks
	const internalTasks = await prisma.internalTask.findMany({
		where: {
			deletedAt: null
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	const completedTasks = internalTasks.filter((task) => task.taskStatus === 'COMPLETED').length;
	const pendingTasks = internalTasks.filter((task) => task.taskStatus === 'PENDING').length;
	const inProgressTasks = internalTasks.filter((task) => task.taskStatus === 'IN_PROGRESS').length;
	const checkingTasks = internalTasks.filter((task) => task.taskStatus === 'CHECKING').length;

	const expiredTasks = internalTasks.filter(
		(task) => task.taskStatus !== 'COMPLETED' && new Date(task.dueDate) > new Date()
	).length;

	// Unit Data
	const allUnits = await prisma.rentalUnits.findMany({
		where: {
			deletedAt: null
		},
		orderBy: {
			floor: 'asc'
		}
	});
	const activeUnits = allUnits.filter((unit) => unit.active).length;
	const goodUnits = allUnits.filter(
		(unit) => unit.latestInspectionStatus === 'GOOD_CONDITION'
	).length;
	const repairUnits = allUnits.filter(
		(unit) => unit.latestInspectionStatus === 'NEEDS_REPAIR'
	).length;
	const badUnits = allUnits.filter(
		(unit) => unit.latestInspectionStatus === 'OUT_OF_SERVICE'
	).length;

	// USD Rate Data
	const usdRate = await prisma.currencyRate.findMany({});
	const usdRateForm = await superValidate(
		{
			id: usdRate[0]?.id,
			usdRate: usdRate[0]?.rate
		},
		usdRateSchema
	);

	// Tenant Data
	const tenants = await prisma.tenants.findMany({
		where: {
			deletedAt: null
		}
	});

	const tenantFromWebsite = tenants.filter((tenant) => tenant.contactSource === 'WEBSITE').length;
	const tenantFromReferral = tenants.filter((tenant) => tenant.contactSource === 'REFERRAL').length;
	const tenantFromWalkIn = tenants.filter((tenant) => tenant.contactSource === 'WALK_IN').length;
	const tenantFromPhone = tenants.filter((tenant) => tenant.contactSource === 'PHONE').length;
	const tenantFromEmail = tenants.filter((tenant) => tenant.contactSource === 'EMAIL').length;
	const tenantFromSocial = tenants.filter(
		(tenant) => tenant.contactSource === 'SOCIAL_MEDIA'
	).length;
	const tenantFromBroker = tenants.filter((tenant) => tenant.contactSource === 'BROKER').length;
	const tenantFromOther = tenants.filter((tenant) => tenant.contactSource === 'OTHER').length;

	return {
		allUnits,
		activeUnits,
		goodUnits,
		repairUnits,
		badUnits,
		usdRateForm,
		tenantFromWebsite,
		tenantFromReferral,
		tenantFromWalkIn,
		tenantFromPhone,
		tenantFromEmail,
		tenantFromSocial,
		tenantFromBroker,
		tenantFromOther,
		internalTasks,
		completedTasks,
		pendingTasks,
		inProgressTasks,
		checkingTasks,
		expiredTasks,
		employees,
		activeEmployees,
		firedEmployees,
		onLeaveEmployees,
		absentEmployees,
		fullTimeEmployees,
		partTimeEmployees,
		temporaryEmployees,
		vendors,
		completedVendorTasks,
		pendingVendorTasks,
		inProgressVendorTasks,
		checkingVendorTasks,
		expiredVendorTasks
	};
};

export const actions = {
	changeRate: async (event) => {
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
			return scope.name === 'EDIT_DOLLAR_VALUE';
		});

		if (!hasRole) {
			return fail(403, { errorMessage: 'You do not have permission to perform this action.' });
		}

		const usdRateForm = await superValidate(event.request, usdRateSchema);

		if (!usdRateForm) {
			return fail(400, { usdRateForm });
		}

		const updatedRate = await prisma.currencyRate.update({
			where: {
				id: usdRateForm.data.id
			},
			data: {
				rate: usdRateForm.data.usdRate,
				updatedAt: new Date()
			}
		});
		console.log({ updatedRate });

		return {
			usdRateForm,
			updatedRate
		};
	}
};
