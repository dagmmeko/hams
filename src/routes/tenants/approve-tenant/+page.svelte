<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	export let form;

	let dateInput: any;
	let dateInput2: any;

	const {
		form: approveRentForm,
		enhance: approveRentEnhance,
		constraints: approveRentConstraints
	} = superForm(data.approveRentForm, {
		onSubmit: ({ formData }) => {
			formData.set('priceChangeId', $page.url.searchParams.get('priceChangeId') ?? '');
		}
	});
	data.approveRentForm;
	$: form?.tenant ? goto('/tenants') : null;
	$: form?.tenant ? toast.push('Tenant Rented') : null;
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Tenants / Rent Room</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<form use:approveRentEnhance method="post" action="?/rentApprovedRoom">
			<div class="">
				<p class="text-2xl font-medium">Approved Discount</p>
				<p class="text-sm py-2">Fill out the details and rent the unit.</p>
				<button class="bg-primary text-white rounded-md py-2 px-6 w-[420px] mt-6">
					Rent Room</button
				>
			</div>

			<div class="grid grid-cols-2 gap-10 mt-6">
				<div class="grid gap-4">
					{#if data.priceChange?.RentalUnits.unitType !== 'COMMERCIAL'}
						<label class="grid gap-2">
							<span class="text-primary font-medium"> Purpose of Rent </span>
							<input
								class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
								name="purposeOfRent"
								bind:value={$approveRentForm.purposeOfRent}
								{...$approveRentConstraints.purposeOfRent}
							/>
						</label>
					{/if}

					<label class="w-full grid gap-2">
						<span class="text-primary font-medium"> Start Date </span>
						<input
							type="date"
							name="startDate"
							class=" border-[1px] border-black/60 rounded-md p-2"
							bind:this={dateInput}
							on:click={() => {
								dateInput && dateInput.showPicker();
							}}
							bind:value={$approveRentForm.startDate}
							{...$approveRentConstraints.startDate}
						/>
					</label>
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium"> TIN number </span>
						<input
							class=" border-[1px] border-black/60 rounded-md p-2"
							name="tinNumber"
							bind:value={$approveRentForm.tinNumber}
							{...$approveRentConstraints.tinNumber}
						/>
					</label>
					<label class="w-full grid gap-2">
						<span class=" text-primary w-full font-medium"> Security Deposit</span>
						<input
							name="securityDeposit"
							type="number"
							class=" border-[1px] border-black/60 rounded-md p-2"
							bind:value={$approveRentForm.securityDeposit}
							{...$approveRentConstraints.securityDeposit}
						/>
					</label>
				</div>
				<div class="grid gap-4">
					{#if data.priceChange?.RentalUnits.unitType !== 'COMMERCIAL'}
						<label class="grid gap-2">
							<span class="text-primary font-medium"> Duration of stay </span>
							<input
								class=" border-[1px] border-black/60 rounded-md p-2"
								type="number"
								name="durationOfStay"
								bind:value={$approveRentForm.durationOfStay}
								{...$approveRentConstraints.durationOfStay}
							/>
						</label>
					{/if}
					<label class="w-full h-fit gap-2 grid">
						<span class="text-primary font-medium"> End Date </span>
						<input
							type="date"
							name="endDate"
							class="border-[1px] border-black/60 rounded-md p-2"
							bind:this={dateInput2}
							on:click={() => {
								dateInput2 && dateInput2.showPicker();
							}}
							bind:value={$approveRentForm.endDate}
							{...$approveRentConstraints.endDate}
						/>
					</label>
				</div>
			</div>
		</form>
	</div>
</div>
