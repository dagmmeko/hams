<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import PdfPrint from '$lib/components/pdf-print.svelte';
	import dayjs from 'dayjs';

	export let data;

	let modal = false;

	const {
		form: editPaymentForm,
		enhance: editPaymentFormEnhance,
		constraints
	} = superForm(data.editPaymentForm, {
		onUpdate: () => {
			modal = false;
		}
	});
</script>

<div class="mx-10 my-12 bg-white rounded-sm p-12 shadow-lg border-[1px] border-black/20">
	<p class="text-xl font-medium mb-6">Payment Attachment</p>
	<PdfPrint>
		<div class="my-6">
			<p class="text-xl print:block hidden font-medium mb-6">Payment Attachment</p>

			<div>
				<p>
					<span class="font-medium text-lg pr-1">Paid To:</span>
					{data.payment.VendorTask?.Vendor?.name}
				</p>
				<p>
					<span class="font-medium text-lg pr-1">Paid for task: </span>
					{data.payment.VendorTask?.taskDescription}
				</p>
			</div>
			<hr class="my-2" />
			<div>
				<p>
					<span class="font-medium text-lg pr-1">Paid Via: </span>
					{data.payment.depositedToBank ?? 'N/A'}
				</p>
				<p><span class="font-medium text-lg pr-1">Paid Amount: </span>{data.payment.amount}</p>
				<p>
					<span class="font-medium text-lg pr-1">Paid on: </span>{dayjs(data.payment.paidOn).format(
						'MMM DD/YY'
					)}
				</p>
			</div>
		</div>
	</PdfPrint>
</div>
