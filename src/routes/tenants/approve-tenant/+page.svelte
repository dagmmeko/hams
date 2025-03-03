<script lang="ts">
	import { run } from 'svelte/legacy';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	let { data, form } = $props();

	let dateInput: any = $state();
	let dateInput2: any = $state();

	const {
		form: approveRentForm,
		enhance: approveRentEnhance,
		constraints: approveRentConstraints
	} = superForm(data.approveRentForm, {
		onSubmit: ({ formData }) => {
			formData.set('priceChangeId', page.url.searchParams.get('priceChangeId') ?? '');
		}
	});
	data.approveRentForm;
	run(() => {
		form?.tenant ? goto(`/tenants/${form.tenant.id}?display=receipts`) : null;
	});
	run(() => {
		form?.tenant ? toast.push('Tenant Rented') : null;
	});
</script>

<div class="mt-6 md:mx-10 mx-5">
	<p class="text-xs text-black/50">Tenants / Rent Room</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<form use:approveRentEnhance method="post" action="?/rentApprovedRoom">
			<div class="">
				<p class="text-2xl font-medium">Approved Discount</p>
				<p class="text-sm py-2">Fill out the details and rent the unit.</p>
				<button class="bg-primary text-white rounded-md py-2 md:px-32 sm:px-24 px-10 mt-6">
					Rent Room</button
				>
			</div>

			<div class="grid sm:grid-cols-2 grid-cols-1 gap-x-10 gap-y-4 mt-6">
				{#if data.priceChange?.RentalUnits.unitType !== 'COMMERCIAL'}
					<label class="grid gap-2">
						<span class="text-primary font-medium">
							Purpose of Rent <span class="text-xs font-light text-danger"> * Required </span></span
						>
						<input
							class="w-full border-[1px] border-black/60 rounded-md p-2"
							name="purposeOfRent"
							bind:value={$approveRentForm.purposeOfRent}
							{...$approveRentConstraints.purposeOfRent}
							required
						/>
					</label>
				{/if}
				{#if data.priceChange?.RentalUnits.unitType !== 'COMMERCIAL'}
					<label class="grid gap-2">
						<span class="text-primary font-medium"> Duration of stay (in days) </span>
						<input
							class=" border-[1px] border-black/60 rounded-md p-2"
							type="number"
							name="durationOfStay"
							bind:value={$approveRentForm.durationOfStay}
							{...$approveRentConstraints.durationOfStay}
						/>
					</label>
				{/if}
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium">
						Start Date <span class="text-xs font-light text-danger"> * Required </span></span
					>
					<input
						type="date"
						name="startDate"
						class=" border-[1px] border-black/60 rounded-md p-2"
						bind:this={dateInput}
						onclick={() => {
							dateInput && dateInput.showPicker();
						}}
						bind:value={$approveRentForm.startDate}
						{...$approveRentConstraints.startDate}
					/>
				</label>
				<label class="w-full h-fit gap-2 grid">
					<span class="text-primary font-medium">
						End Date <span class="text-xs font-light text-danger"> * Required </span></span
					>
					<input
						type="date"
						name="endDate"
						class="border-[1px] border-black/60 rounded-md p-2"
						bind:this={dateInput2}
						onclick={() => {
							dateInput2 && dateInput2.showPicker();
						}}
						bind:value={$approveRentForm.endDate}
						{...$approveRentConstraints.endDate}
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

				<label class="w-full h-fit grid gap-2">
					<span class=" text-primary w-full font-medium"> Company Name</span>
					<input
						name="companyName"
						class=" border-[1px] border-black/60 rounded-md p-2"
						bind:value={$approveRentForm.companyName}
						{...$approveRentConstraints.companyName}
					/>
				</label>
			</div>
		</form>
	</div>
</div>
