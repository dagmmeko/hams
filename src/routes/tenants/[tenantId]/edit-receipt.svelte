<script lang="ts">
	import { Receipts } from '@prisma/client';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';
	import { enhance } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';
	import { updated } from '$app/stores';

	export let data: PageData;
	export let receiptId;
	export let form: ActionData;

	let receipt: Receipts | undefined;
	let dateInput: any;
	let dateInput2: any;
	export let editModal;

	$: receipt = data.tenant?.Receipts.find((receipt) => {
		return receipt.id === receiptId;
	});

	$: form?.updatedReceipt && toast.push('Receipt updated successfully');
</script>

<form
	use:enhance={({ formData }) => {
		if (!receiptId) {
			toast.push('No receipt found');
		}
		formData.set('receiptId', receiptId);
		return async ({ update }) => {
			await update();
			editModal = false;
		};
	}}
	class="grid gap-4"
	method="post"
	action="?/editReceipts"
>
	<label class="grid">
		<span class="text-primary font-medium"> Payment Start Date </span>
		<input
			type="date"
			value={dayjs(receipt?.startDate).format('YYYY-MM-DD')}
			name="editPaymentStartDate"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
			bind:this={dateInput}
			on:click={() => {
				dateInput && dateInput.showPicker();
			}}
		/>
	</label>
	<label class="grid">
		<span class="text-primary font-medium"> Payment End Date </span>
		<input
			type="date"
			value={dayjs(receipt?.endDate).format('YYYY-MM-DD')}
			name="editPaymentEndDate"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
			bind:this={dateInput2}
			on:click={() => {
				dateInput2 && dateInput2.showPicker();
			}}
		/>
	</label>
	<div class="flex gap-2">
		<label class="flex gap-2">
			<input
				type="checkbox"
				checked={receipt?.isUtilityAndRentPayment}
				name="editIsBothPayment"
				class=" border-[1px] border-black/60 rounded-md p-2"
			/>
			<span class="text-primary font-medium"> Rent & Utility Payment </span>
		</label>
		<label class="flex gap-2">
			<input
				type="checkbox"
				checked={!receipt?.isRentPayment}
				name="editIsUtilityPayment"
				class=" border-[1px] border-black/60 rounded-md p-2"
			/>
			<span class="text-primary font-medium"> Utility Payment </span>
		</label>
	</div>
	<label class="flex gap-2">
		<input
			type="checkbox"
			checked={receipt?.crvReceipt}
			name="editCRVReceipt"
			class=" border-[1px] border-black/60 rounded-md p-2"
		/>
		<span class="text-primary font-medium"> CRV Receipt </span>
	</label>

	<label class="grid">
		<span class="text-primary font-medium">
			Amount <span class="text-xs"> (In ETB) </span>
		</span>
		<input
			value={receipt?.amount}
			name="editAmount"
			step="0.01"
			type="number"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
		/>
	</label>
	<label class="grid">
		<span class="text-primary font-medium"> Deposited Bank Name </span>

		<input
			value={receipt?.bankName}
			name="editBankName"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
		/>
	</label>

	<label class="grid">
		<span class="text-primary font-medium"> Receipt No. </span>

		<input
			value={receipt?.receiptReferenceNumber}
			name="editRefNumber"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
		/>
	</label>
	<button type="submit" class="bg-primary text-white rounded-md py-2"> Edit Receipt </button>
</form>
