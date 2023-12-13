import { prisma } from '$lib/utils/prisma.js';
import type { ServiceType } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z, { number } from 'zod';


const editPaymentSchema = z.object({
	id : z.number().int(),
	amount: z.number(),
	despositedToBank :z.string(),
	paidOn :z.date(),
	
});


export type paymentType = z.infer<typeof editPaymentSchema>;


export const load = async (event) => {


	
	const payment = await prisma.payment.findFirst(
		{
			where : {
				id : parseInt(event.params.vendorId)
			},
			include :
			{
				VendorTask:true
				}
			});
	
	

if (!payment) {
		throw error(404, 'payment not found');
	}
	
	const editPaymentForm = await superValidate(
		{
			id: payment?.id || 0 ,
			amount: payment?.amount || 0 ,
			despositedToBank :payment?.despositedToBank || '',
			paidOn :payment?.paidOn || new Date()
			
		},
		editPaymentSchema
	);



	
	return {editPaymentForm };
};


export const actions = {
	editPaymentInfo: async (event) => {
		const editPaymentForm = await superValidate(event.request, editPaymentSchema);
		if (!editPaymentForm) {
			return fail(400, { editPaymentForm });
		}

		

		const payment = await prisma.payment.update({
			where: {
				id: parseInt(event.params.paymentId)
			},
			data: {
			
				amount: editPaymentForm.data.amount,
				despositedToBank : editPaymentForm.data.despositedToBank,
				paidOn :editPaymentForm.data.paidOn,
			}
		});

	

		
	},

	
};

