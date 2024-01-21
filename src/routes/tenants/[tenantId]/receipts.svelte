<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { clickOutside } from '$lib/utils/click-outside';
	import { numberToCurrency } from '$lib/utils/currency';
	import { MultiSelect } from 'svelte-multiselect';
	import type { PriceChange } from '@prisma/client';
	import { enhance } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	import PdfPrint from '$lib/components/pdf-print.svelte';
	import dayjs from 'dayjs';
	import Logo from '$lib/assets/Logo.svg.svelte';

	let modal = false;

	export let data: PageData;
	export let form: ActionData;

	let dateInput: any;
	let dateInput2: any;
	let dateInput3: any;

	const tenantRentalActiveUnits = data.tenant?.TenantRental.filter((unit) => unit.active) ?? [];

	const {
		form: addReceiptForm,
		enhance: addReceiptFormEnhance,
		constraints
	} = superForm(data.addReceiptsForm);
</script>

<div>
	<div class="grid grid-flow-col justify-items-stretch">
		<div class="grid">
			<p class="text-2xl">Tenant Receipts</p>
			<p class=" text-sm py-1 rounded-xl">Tenant Receipt here.</p>
		</div>
		<div class="justify-self-end">
			<button
				on:click={() => (modal = true)}
				class="bg-warning text-black/70 rounded-md py-2 px-6 mr-4"
			>
				Add Receipt
			</button>
		</div>
	</div>

	<div>
		{#each data.groupedReceipts as receipts}
			<PdfPrint info={receipts} tenant={data.tenant} />
		{/each}
	</div>
</div>

{#if modal}
	<form
		action="?/addReceipts"
		method="post"
		use:addReceiptFormEnhance
		class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
	>
		<div
			use:clickOutside={() => (modal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
		>
			<label class="grid">
				<span class="text-primary font-medium"> Pay for Unit </span>
				<select
					bind:value={$addReceiptForm.payToUnit}
					{...$constraints.payToUnit}
					name="payToUnit"
					class="mt-2 border-[1px] border-black/60 rounded-md p-2"
				>
					<option selected disabled> Select Unit to pay for </option>
					{#each tenantRentalActiveUnits as tenantRental}
						<option value={tenantRental.RentalUnits.id}>
							{tenantRental.RentalUnits.roomNumber}
						</option>
					{/each}
				</select>
			</label>
			{#if $addReceiptForm.payToUnit && !$addReceiptForm.isUtilityPayment}
				<div>
					<div class="grid grid-cols-2">
						<p class="text-base font-medium">Rent to Pay</p>
						<p class="text-base font-medium">Negotiated from</p>
					</div>
					<hr class="my-2" />
					<div class="grid grid-cols-2">
						<p>
							{data.tenant?.PriceChange.find(
								(changed) => changed.unitId === $addReceiptForm.payToUnit
							)
								? numberToCurrency(
										data.tenant?.PriceChange.find(
											(changed) => changed.unitId === $addReceiptForm.payToUnit
										)?.price ?? 0
								  )
								: numberToCurrency(
										data.tenant?.TenantRental.find(
											(unit) => unit.RentalUnits.id === $addReceiptForm.payToUnit
										)?.RentalUnits.price ?? 0
								  )}
						</p>
						<p>
							{data.tenant?.PriceChange.find(
								(changed) => changed.unitId === $addReceiptForm.payToUnit
							)
								? numberToCurrency(
										data.tenant?.TenantRental.find(
											(unit) => unit.RentalUnits.id === $addReceiptForm.payToUnit
										)?.RentalUnits.price ?? 0
								  )
								: 'No Negotiation'}
						</p>
					</div>
				</div>
			{/if}

			<label class="grid">
				<span class="text-primary font-medium"> Payment Start Date </span>
				<input
					type="date"
					bind:value={$addReceiptForm.paymentStartDate}
					{...$constraints.paymentStartDate}
					name="paymentStartDate"
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
					bind:value={$addReceiptForm.paymentEndDate}
					{...$constraints.paymentEndDate}
					name="paymentEndDate"
					class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
					bind:this={dateInput2}
					on:click={() => {
						dateInput2 && dateInput2.showPicker();
					}}
				/>
			</label>
			<label class="flex">
				<input
					type="checkbox"
					bind:checked={$addReceiptForm.isUtilityPayment}
					{...$constraints.isUtilityPayment}
					name="isUtilityPayment"
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
				<span class="text-primary font-medium"> Utility Payment </span>
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Amount </span>
				<input
					type="number"
					bind:value={$addReceiptForm.amount}
					{...$constraints.amount}
					name="amount"
					class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
				/>
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Receipt Issue Date </span>
				<input
					type="date"
					bind:value={$addReceiptForm.receiptIssueDate}
					{...$constraints.receiptIssueDate}
					name="receiptIssueDate"
					class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
					bind:this={dateInput3}
					on:click={() => {
						dateInput3 && dateInput3.showPicker();
					}}
				/>
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Receipt No. </span>
				<input
					bind:value={$addReceiptForm.receiptNumber}
					{...$constraints.receiptNumber}
					name="receiptNumber"
					class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
				/>
			</label>

			<label class="grid">
				<span class="text-primary font-medium"> Deposited Bank Name </span>
				<input
					bind:value={$addReceiptForm.depositedBank}
					{...$constraints.depositedBank}
					name="depositedBank"
					class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
				/>
			</label>
			<button class="bg-primary text-white rounded-md py-2"> Generate Attachment</button>
		</div>
	</form>
{/if}
