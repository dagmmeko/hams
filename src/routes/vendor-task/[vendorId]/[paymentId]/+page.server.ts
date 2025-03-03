import { prisma } from '$lib/utils/prisma.js'
import type { ServiceType } from '@prisma/client'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import z, { number } from 'zod'

const editPaymentSchema = z.object({
	id: z.number().int(),
	amount: z.number(),
	depositedToBank: z.string(),
	paidOn: z.date(),
})

export type paymentType = z.infer<typeof editPaymentSchema>

export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null

	const hasRole = session?.authUser.Employee.Role.Scopes.find((scope) => {
		return scope.name === 'VIEW_PAYMENT_DETAIL'
	})

	if (!hasRole) {
		redirect(302, '/no-permission')
	}
	const payment = await prisma.payment.findFirst({
		where: {
			id: parseInt(event.params.paymentId),
		},
		include: {
			VendorTask: {
				include: {
					Vendor: true,
				},
			},
		},
	})

	if (!payment) {
		error(404, 'payment not found')
	}

	const editPaymentForm = await superValidate(
		{
			id: payment?.id || 0,
			amount: payment?.amount || 0,
			depositedToBank: payment?.depositedToBank || '',
			paidOn: payment?.paidOn || new Date(),
		},
		editPaymentSchema,
	)

	return { editPaymentForm, payment }
}

export const actions = {
	editPaymentInfo: async (event) => {
		const editPaymentForm = await superValidate(event.request, editPaymentSchema)
		if (!editPaymentForm) {
			return fail(400, { editPaymentForm })
		}

		const payment = await prisma.payment.update({
			where: {
				id: parseInt(event.params.paymentId),
			},
			data: {
				amount: editPaymentForm.data.amount,
				depositedToBank: editPaymentForm.data.depositedToBank,
				paidOn: editPaymentForm.data.paidOn,
			},
		})
	},
}
