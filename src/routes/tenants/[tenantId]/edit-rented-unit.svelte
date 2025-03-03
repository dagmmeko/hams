<script lang="ts">
	import dayjs from 'dayjs'
	import type { ActionData, PageData } from './$types'
	import { enhance } from '$app/forms'
	import { toast } from '@zerodevx/svelte-toast'

	interface Props {
		data: PageData
		form: ActionData
		selectedRentedUnitId: number
		editRentedUnitModal: boolean
	}

	let { data, form, selectedRentedUnitId, editRentedUnitModal = $bindable() }: Props = $props()

	let dateInput: any = $state()
	let dateInput2: any = $state()

	const rentedUnit = data.tenant?.TenantRental.find((rental) => {
		return rental.id === selectedRentedUnitId
	})
</script>

<form
	use:enhance={({ formData }) => {
		if (!selectedRentedUnitId) {
			toast.push('No rented unit found')
		}
		formData.set('rentedUnitId', selectedRentedUnitId.toString())
		return async ({ update }) => {
			await update()
			toast.push('Rented unit updated successfully')
			editRentedUnitModal = false
		}
	}}
	class="grid gap-4"
	method="post"
	action="?/editRentedUnit"
>
	<label class="grid flex-1">
		<span class="py-1 font-semibold text-primary"> Start Date</span>
		<input
			type="date"
			name="editStartDate"
			value={dayjs(rentedUnit?.contractStartDate).format('YYYY-MM-DD')}
			class=" mt-1 rounded-md border-[1px] border-black/60 p-2"
			bind:this={dateInput}
			onclick={() => {
				dateInput && dateInput.showPicker()
			}}
		/>
	</label>
	<label class="grid flex-1">
		<span class="py-1 font-semibold text-primary"> End Date</span>
		<input
			type="date"
			name="editEndDate"
			value={dayjs(rentedUnit?.contractEndDate).format('YYYY-MM-DD')}
			class=" mt-1 rounded-md border-[1px] border-black/60 p-2"
			bind:this={dateInput2}
			onclick={() => {
				dateInput2 && dateInput2.showPicker()
			}}
		/>
	</label>
	<label class="grid">
		<span class="font-medium text-primary"> Company Name </span>

		<input
			value={rentedUnit?.companyName}
			name="editCompanyName"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
		/>
	</label>

	<label class="grid">
		<span class="font-medium text-primary"> Security Deposit </span>

		<input
			value={rentedUnit?.securityDeposit}
			name="editSecurityDeposit"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
			type="number"
			step="0.01"
		/>
	</label>
	<label class="grid">
		<span class="font-medium text-primary"> Purpose Of Rent </span>

		<input
			value={rentedUnit?.purposeOfRent}
			name="editPurposeOfRent"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
		/>
	</label>

	<label class="grid">
		<span class="font-medium text-primary"> TIN </span>

		<input
			value={rentedUnit?.tinNumber}
			name="editTIN"
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
		/>
	</label>
	<button class="mt-4 w-full rounded-md bg-primary py-2 text-white"> Edit </button>
</form>
