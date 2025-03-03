<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import PdfPrint from '$lib/components/pdf-print.svelte';
	import dayjs from 'dayjs';

	let { data } = $props();

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

<div class="md:mx-10 mx-5 my-12 bg-white rounded-sm p-12 shadow-lg border-[1px] border-black/20">
	<p class="text-xl font-medium mb-6">Payment Attachment</p>
	<PdfPrint>
		<div class="my-6">
			<p class="text-xl print:block hidden font-medium mb-6">Payment Attachment</p>

			<div>
				<p>
					<span class="font-medium text-lg pr-1">Paid To:</span>
					<span class="underline">{data.payment.VendorTask?.Vendor?.name}</span>
				</p>
				<p>
					<span class="font-medium text-lg pr-1">Paid for task: </span>
					<span class="underline">{data.payment.VendorTask?.taskDescription}</span>
				</p>
				<p>
					<span class="font-medium text-lg pr-1">Payment Term: </span>
					<span class="underline">{data.payment.VendorTask?.paymentTerms}</span>
				</p>
			</div>
			<hr class="my-2" />
			<div class="grid grid-cols-3">
				<p class="grid">
					<span class="font-medium text-lg pr-1">Paid Via: </span>
					<span>{data.payment.depositedToBank ?? 'N/A'}</span>
				</p>
				<p class="grid">
					<span class="font-medium text-lg pr-1">Paid Amount: </span>
					<span>{data.payment.amount}</span>
				</p>
				<p class="grid">
					<span class="font-medium text-lg pr-1">Paid on: </span>
					<span>{dayjs(data.payment.paidOn).format('MMM DD/YY')}</span>
				</p>
			</div>
			<hr class="my-12" />
			<div class="grid grid-cols-3">
				<p class="grid justify-items-stretch">
					<span> ___________________</span>
					<span> Prepared By</span>
				</p>
				<p class="grid justify-items-stretch">
					<span> ___________________</span>
					<span> Approved By</span>
				</p>
				<p class="grid justify-items-stretch">
					<span> ___________________</span>
					<span> Received By</span>
				</p>
			</div>
		</div>
	</PdfPrint>
</div>
