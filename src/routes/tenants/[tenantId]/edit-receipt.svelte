<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Receipts } from '@prisma/client'
	import { toast } from '@zerodevx/svelte-toast'
	import dayjs from 'dayjs'
	import type { ActionData, PageData } from './$types'

	interface Props {
		data: PageData
		receiptId: number | undefined
		form: ActionData
		editModal: any
	}

	let { data, receiptId, form, editModal = $bindable() }: Props = $props()

	let receipt: Receipts | undefined = $derived(
		data.tenant?.Receipts.find((receipt) => {
			return receipt.id === receiptId
		}),
	)
	let dateInput: any = $state()
	let dateInput2: any = $state()
</script>

<form
	use:enhance={({ formData }) => {
		if (!receiptId) {
			toast.push('No receipt found')
		}
		formData.set('receiptId', receiptId?.toString() ?? '')
		return async ({ update }) => {
			await update()
			toast.push('Receipt updated successfully')

			editModal = false
		}
	}}
	class="grid gap-4"
	method="post"
	action="?/editReceipts"
>
	<label class="grid">
		<span class="font-medium text-primary"> Payment Start Date </span>
		<input
			type="date"
			value={dayjs(receipt?.startDate).format('YYYY-MM-DD')}
			name="editPaymentStartDate"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
			bind:this={dateInput}
			onclick={() => {
				dateInput && dateInput.showPicker()
			}}
		/>
	</label>
	<label class="grid">
		<span class="font-medium text-primary"> Payment End Date </span>
		<input
			type="date"
			value={dayjs(receipt?.endDate).format('YYYY-MM-DD')}
			name="editPaymentEndDate"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
			bind:this={dateInput2}
			onclick={() => {
				dateInput2 && dateInput2.showPicker()
			}}
		/>
	</label>
	<div class="flex gap-2">
		<label class="flex gap-2">
			<input
				type="checkbox"
				checked={receipt?.isRentPayment}
				name="editIsRentPayment"
				class=" rounded-md border-[1px] border-black/60 p-2"
			/>
			<span class="font-medium text-primary"> Rent Payment </span>
		</label>
		<label class="flex gap-2">
			<input
				type="checkbox"
				checked={receipt?.isUtilityPayment}
				name="editIsUtilityPayment"
				class=" rounded-md border-[1px] border-black/60 p-2"
			/>
			<span class="font-medium text-primary"> Utility Payment </span>
		</label>
	</div>
	<label class="flex gap-2">
		<input
			type="checkbox"
			checked={receipt?.crvReceipt}
			name="editCRVReceipt"
			class=" rounded-md border-[1px] border-black/60 p-2"
		/>
		<span class="font-medium text-primary"> CRV Receipt </span>
	</label>

	<label class="grid">
		<span class="font-medium text-primary">
			Amount <span class="text-xs"> (In ETB) </span>
		</span>
		<input
			value={receipt?.amount}
			name="editAmount"
			step="0.01"
			type="number"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
		/>
	</label>
	<label class="grid">
		<span class="font-medium text-primary"> Deposited Bank Name </span>

		<input
			value={receipt?.bankName}
			name="editBankName"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
		/>
	</label>

	<label class="grid">
		<span class="font-medium text-primary"> Receipt No. </span>

		<input
			value={receipt?.receiptReferenceNumber}
			name="editRefNumber"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
		/>
	</label>
	<button type="submit" class="rounded-md bg-primary py-2 text-white"> Edit Receipt </button>
</form>
