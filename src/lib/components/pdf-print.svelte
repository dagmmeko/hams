<script lang="ts">
	import Store from '$lib/assets/store.svg.svelte';
	import { numberToCurrency } from '$lib/utils/currency';
	import type { Tenants } from '@prisma/client';
	import dayjs from 'dayjs';
	import PrintPdf from 'svelte-printpdf';

	let print = false;
	export let info: any;
	export let tenant: Tenants | null;
</script>

<div class="">
	<PrintPdf bind:print>
		<div class="">
			<div class="text-2xl font-semibold my-2">
				Receipt Reference: {info.receiptReferenceNumber}
			</div>
			<div class="text-xl font-medium flex gap-4">
				Name: <p class="text-lg font-normal">{tenant?.fullName}</p>
			</div>
			<div class="grid grid-cols-3 gap-10 mt-3">
				{#each info.receipts ?? [] as rec}
					<div class="bg-white shadow-sm border-[1px] border-black/10 p-2 rounded-md">
						<p class="italic font-light">
							Issued Date: <span class="">{dayjs(rec.receiptReceivedOn).format('MMM DD/YY')}</span>
						</p>
						<div class="flex gap-4">
							<div>
								<p class="font-medium">
									Room No: <span class="font-normal">{rec.PayToUnit?.roomNumber}</span>
								</p>

								<p class="font-medium">
									Amount:
									<span class="font-normal">{numberToCurrency(rec.amount)}</span>
								</p>
								<p class="font-medium">
									Reason: <span class="font-normal">{rec.paymentReason}</span>
								</p>
							</div>
							<div>
								<p class="font-medium">
									Start Date: <span class="font-normal">
										{dayjs(rec.startDate).format('MMM DD/YY')}</span
									>
								</p>

								<p class="font-medium">
									End Date: <span class="font-normal">{dayjs(rec.endDate).format('MMM DD/YY')}</span
									>
								</p>
								<p class="font-medium">
									Bank Name: <span class="font-normal"> {rec.bankName}</span>
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</PrintPdf>
	<button
		class="bg-primary text-white rounded-md h-fit p-1 flex mt-2"
		on:click={() => {
			print = true;
		}}
		><Store /> Print PDF
	</button>
	<hr class="my-1" />
</div>
