<script lang="ts">
	import PdfPrint from '$lib/components/pdf-print.svelte';
	import { clickOutside } from '$lib/utils/click-outside';
	import { numberToCurrency } from '$lib/utils/currency';
	import dayjs from 'dayjs';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';

	let modal = false;

	export let data: PageData;
	// export let form: ActionData;

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

<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
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
</div>
<div>
	{#each data.groupedReceipts as receipts}
		<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
			<PdfPrint>
				<div>
					<div class="print:block hidden">
						<p><span class="font-semibold">Address: </span> A.A. Bole Wereda 03 H.No 567</p>
						<p><span class="font-semibold">VAT Reg. No:</span> 11296</p>
						<p><span class="font-semibold">VAT Reg Date:</span> 03-Oct-2023</p>
						<p><span class="font-semibold">TIN:</span> 0000024081</p>
					</div>
					<hr class="my-1" />

					<div class="print:block hidden">
						<span class="font-semibold">Tenants Name:</span>
						{data.tenant?.fullName}
					</div>
					<div class="print:block hidden">
						<span class="font-semibold">Tenants phone:</span>
						{data.tenant?.phoneNumber}
					</div>
					<hr class="mt-1" />
					<div class="text-lg font-semibold my-1 print:block hidden">
						Receipt Reference: {receipts.receiptReferenceNumber}
					</div>
					<div class="hidden">
						<p class="text-lg font-medium">Name:</p>
						<p class="text-base font-normal">{data.tenant?.fullName}</p>
					</div>
					<div class="grid grid-cols-1 gap-10">
						{#each receipts.receipts ?? [] as rec}
							<div class="bg-white shadow-sm border-[1px] border-black/10 p-2 rounded-md">
								<div class="print:grid print:grid-cols-2 flex print:gap-2 gap-12">
									<div>
										<div class="">
											<span class="font-semibold">TIN Number:</span>
											{data.tenant?.TenantRental.find(
												(tenantRental) => tenantRental.RentalUnits.id === rec.payToUnitId
											)?.tinNumber ?? 'N/A'}
										</div>
										<p class="font-medium">
											Room No: <span class="font-normal">{rec.PayToUnit?.roomNumber}</span>
										</p>
										<p class="font-medium">
											Reason: <span class="font-normal">{rec.paymentReason}</span>
										</p>
									</div>
									<div class="print:hidden block">
										<p class="font-medium">
											Amount:
											<span class="font-normal"
												>{numberToCurrency(rec.amount / 1.15, {
													currency: rec.PayToUnit?.currency,
													currencyDisplay: 'code'
												})}</span
											>
										</p>
										<p class="font-medium">
											VAT:
											<span class="font-normal"
												>{numberToCurrency(rec.amount - rec.amount / 1.15, {
													currency: rec.PayToUnit?.currency,
													currencyDisplay: 'code'
												})}</span
											>
										</p>
										<p class="font-medium">
											Total Amount:
											<span class="font-normal"
												>{numberToCurrency(rec.amount, {
													currency: rec.PayToUnit?.currency,
													currencyDisplay: 'code'
												})}</span
											>
										</p>
									</div>
									<div class="print:block hidden">
										<p class="font-medium">
											Amount:
											<span class="font-normal"
												>{numberToCurrency((rec.amount / 1.15) * (rec.usdRateAtPayment || 1), {
													currency: 'ETB',
													currencyDisplay: 'code'
												})}</span
											>
										</p>

										<p class="font-medium">
											VAT:
											<span class="font-normal"
												>{numberToCurrency(
													(rec.amount - rec.amount / 1.15) * (rec.usdRateAtPayment || 1),
													{
														currency: 'ETB',
														currencyDisplay: 'code'
													}
												)}</span
											>
										</p>
										<p class="font-medium">
											Total Amount:
											<span class="font-normal"
												>{numberToCurrency(rec.amount * (rec.usdRateAtPayment || 1), {
													currency: 'ETB',
													currencyDisplay: 'code'
												})}</span
											>
										</p>
									</div>
									<div>
										<p class="italic font-light">
											Issued Date: <span class=""
												>{dayjs(rec.receiptReceivedOn).format('MMM DD/YY')}</span
											>
										</p>
										<p class="font-medium">
											Start Date: <span class="font-normal">
												{dayjs(rec.startDate).format('MMM DD/YY')}</span
											>
										</p>

										<p class="font-medium">
											End Date: <span class="font-normal"
												>{dayjs(rec.endDate).format('MMM DD/YY')}</span
											>
										</p>
									</div>
									<div>
										<p class="font-medium">
											Bank Name: <span class="font-normal"> {rec.bankName}</span>
										</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</PdfPrint>
		</div>
	{/each}
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
										)?.price ?? 0,
										{
											currency: data.tenant?.TenantRental.find(
												(unit) => unit.RentalUnits.id === $addReceiptForm.payToUnit
											)?.RentalUnits.currency,
											currencyDisplay: 'code'
										}
								  )
								: numberToCurrency(
										data.tenant?.TenantRental.find(
											(unit) => unit.RentalUnits.id === $addReceiptForm.payToUnit
										)?.RentalUnits.price ?? 0,
										{
											currency: data.tenant?.TenantRental.find(
												(unit) => unit.RentalUnits.id === $addReceiptForm.payToUnit
											)?.RentalUnits.currency,
											currencyDisplay: 'code'
										}
								  )}
						</p>
						<p>
							{data.tenant?.PriceChange.find(
								(changed) => changed.unitId === $addReceiptForm.payToUnit
							)
								? numberToCurrency(
										data.tenant?.TenantRental.find(
											(unit) => unit.RentalUnits.id === $addReceiptForm.payToUnit
										)?.RentalUnits.price ?? 0,
										{
											currency: data.tenant?.TenantRental.find(
												(unit) => unit.RentalUnits.id === $addReceiptForm.payToUnit
											)?.RentalUnits.currency,
											currencyDisplay: 'code'
										}
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
					bind:value={$addReceiptForm.paymentStartDate}
					{...$constraints.paymentStartDate}
					name="receiptIssueDate"
					class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
					bind:this={dateInput3}
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
