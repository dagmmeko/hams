<script lang="ts">
	import dayjs from 'dayjs';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';

	interface Props {
		data: PageData;
		form: ActionData;
		selectedRentedUnitId: number;
		editRentedUnitModal: boolean;
	}

	let { data, form, selectedRentedUnitId, editRentedUnitModal = $bindable() }: Props = $props();

	let dateInput: any = $state();
	let dateInput2: any = $state();

	const rentedUnit = data.tenant?.TenantRental.find((rental) => {
		return rental.id === selectedRentedUnitId;
	});
</script>

<form
	use:enhance={({ formData }) => {
		if (!selectedRentedUnitId) {
			toast.push('No rented unit found');
		}
		formData.set('rentedUnitId', selectedRentedUnitId.toString());
		return async ({ update }) => {
			await update();
			toast.push('Rented unit updated successfully');
			editRentedUnitModal = false;
		};
	}}
	class="grid gap-4"
	method="post"
	action="?/editRentedUnit"
>
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1"> Start Date</span>
		<input
			type="date"
			name="editStartDate"
			value={dayjs(rentedUnit?.contractStartDate).format('YYYY-MM-DD')}
			class=" border-[1px] border-black/60 rounded-md p-2 mt-1"
			bind:this={dateInput}
			onclick={() => {
				dateInput && dateInput.showPicker();
			}}
		/>
	</label>
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1"> End Date</span>
		<input
			type="date"
			name="editEndDate"
			value={dayjs(rentedUnit?.contractEndDate).format('YYYY-MM-DD')}
			class=" border-[1px] border-black/60 rounded-md p-2 mt-1"
			bind:this={dateInput2}
			onclick={() => {
				dateInput2 && dateInput2.showPicker();
			}}
		/>
	</label>
	<label class="grid">
		<span class="text-primary font-medium"> Company Name </span>

		<input
			value={rentedUnit?.companyName}
			name="editCompanyName"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
		/>
	</label>

	<label class="grid">
		<span class="text-primary font-medium"> Security Deposit </span>

		<input
			value={rentedUnit?.securityDeposit}
			name="editSecurityDeposit"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
			type="number"
			step="0.01"
		/>
	</label>
	<label class="grid">
		<span class="text-primary font-medium"> Purpose Of Rent </span>

		<input
			value={rentedUnit?.purposeOfRent}
			name="editPurposeOfRent"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
		/>
	</label>

	<label class="grid">
		<span class="text-primary font-medium"> TIN </span>

		<input
			value={rentedUnit?.tinNumber}
			name="editTIN"
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
		/>
	</label>
	<button class="bg-primary text-white rounded-md py-2 w-full mt-4"> Edit </button>
</form>
