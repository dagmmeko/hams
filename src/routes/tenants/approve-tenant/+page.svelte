<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { toast } from '@zerodevx/svelte-toast'
	import { superForm } from 'sveltekit-superforms/client'
	let { data, form } = $props()

	let dateInput: any = $state()
	let dateInput2: any = $state()

	const {
		form: approveRentForm,
		enhance: approveRentEnhance,
		constraints: approveRentConstraints,
	} = superForm(data.approveRentForm, {
		onSubmit: ({ formData }) => {
			formData.set('priceChangeId', page.url.searchParams.get('priceChangeId') ?? '')
		},
	})
	data.approveRentForm
	$effect.pre(() => {
		form?.tenant ? goto(`/tenants/${form.tenant.id}?display=receipts`) : null
	})
	$effect.pre(() => {
		form?.tenant ? toast.push('Tenant Rented') : null
	})
</script>

<div class="mx-5 mt-6 md:mx-10">
	<p class="text-xs text-black/50">Tenants / Rent Room</p>
	<div class=" mt-6 rounded-md border-[1px] border-black/20 bg-white p-6 shadow-sm">
		<form use:approveRentEnhance method="post" action="?/rentApprovedRoom">
			<div class="">
				<p class="text-2xl font-medium">Approved Discount</p>
				<p class="py-2 text-sm">Fill out the details and rent the unit.</p>
				<button class="mt-6 rounded-md bg-primary px-10 py-2 text-white sm:px-24 md:px-32">
					Rent Room</button
				>
			</div>

			<div class="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
				{#if data.priceChange?.RentalUnits.unitType !== 'COMMERCIAL'}
					<label class="grid gap-2">
						<span class="font-medium text-primary">
							Purpose of Rent <span class="text-xs font-light text-danger"> * Required </span></span
						>
						<input
							class="w-full rounded-md border-[1px] border-black/60 p-2"
							name="purposeOfRent"
							bind:value={$approveRentForm.purposeOfRent}
							{...$approveRentConstraints.purposeOfRent}
							required
						/>
					</label>
				{/if}
				{#if data.priceChange?.RentalUnits.unitType !== 'COMMERCIAL'}
					<label class="grid gap-2">
						<span class="font-medium text-primary"> Duration of stay (in days) </span>
						<input
							class=" rounded-md border-[1px] border-black/60 p-2"
							type="number"
							name="durationOfStay"
							bind:value={$approveRentForm.durationOfStay}
							{...$approveRentConstraints.durationOfStay}
						/>
					</label>
				{/if}
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary">
						Start Date <span class="text-xs font-light text-danger"> * Required </span></span
					>
					<input
						type="date"
						name="startDate"
						class=" rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput}
						onclick={() => {
							dateInput && dateInput.showPicker()
						}}
						bind:value={$approveRentForm.startDate}
						{...$approveRentConstraints.startDate}
					/>
				</label>
				<label class="grid h-fit w-full gap-2">
					<span class="font-medium text-primary">
						End Date <span class="text-xs font-light text-danger"> * Required </span></span
					>
					<input
						type="date"
						name="endDate"
						class="rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput2}
						onclick={() => {
							dateInput2 && dateInput2.showPicker()
						}}
						bind:value={$approveRentForm.endDate}
						{...$approveRentConstraints.endDate}
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> TIN number </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="tinNumber"
						bind:value={$approveRentForm.tinNumber}
						{...$approveRentConstraints.tinNumber}
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class=" w-full font-medium text-primary"> Security Deposit</span>
					<input
						name="securityDeposit"
						type="number"
						class=" rounded-md border-[1px] border-black/60 p-2"
						bind:value={$approveRentForm.securityDeposit}
						{...$approveRentConstraints.securityDeposit}
					/>
				</label>

				<label class="grid h-fit w-full gap-2">
					<span class=" w-full font-medium text-primary"> Company Name</span>
					<input
						name="companyName"
						class=" rounded-md border-[1px] border-black/60 p-2"
						bind:value={$approveRentForm.companyName}
						{...$approveRentConstraints.companyName}
					/>
				</label>
			</div>
		</form>
	</div>
</div>
