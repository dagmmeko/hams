<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { clickOutside } from '$lib/utils/click-outside';
	import { numberToCurrency } from '$lib/utils/currency';
	import { MultiSelect } from 'svelte-multiselect';
	import type { PriceChange } from '@prisma/client';

	let modal = true;

	export let data: PageData;
	export let form: ActionData;
	const tenantRentalActiveUnits = data.tenant?.TenantRental.filter((unit) => unit.active) ?? [];

	let payToUnit: { label: string; value: number }[] = [];
	let payToUtility: { label: string; value: number }[] = [];

	let changedPrice: { price: number; unit: string; changed: boolean }[] = [];
	$: {
		changedPrice = payToUnit.map((payToUnitItem) => {
			const priceChangeItem = data.tenant?.PriceChange.find(
				(priceChangeUnit) => priceChangeUnit.unitId === payToUnitItem.value
			);

			if (priceChangeItem) {
				return {
					price: priceChangeItem.price,
					unit: payToUnitItem.label,
					changed: true
				};
			} else {
				const rentalUnitItem = tenantRentalActiveUnits.find(
					(rentalUnit) => rentalUnit.unitId === payToUnitItem.value
				);

				return {
					price: rentalUnitItem ? rentalUnitItem.RentalUnits.price : 0,
					unit: payToUnitItem.label,
					changed: false
				};
			}
		});
	}

	$: console.log({ payToUtility });
</script>

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

{#if modal}
	<div class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
		<div
			use:clickOutside={() => (modal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
		>
			<div>
				<p class="text-lg font-medium mb-2">Rent Payment</p>
				<MultiSelect
					bind:selected={payToUnit}
					options={tenantRentalActiveUnits.map((unit) => ({
						label: unit.RentalUnits.roomNumber,
						value: unit.RentalUnits.id
					}))}
					--sms-padding="10px"
				/>
				{#if changedPrice.length}
					<div class="grid grid-cols-3 mt-4 mb-2">
						<p class="text-base font-medium">Room No.</p>
						<p class="text-base font-medium">Negotiated</p>
						<p class="text-base font-medium">Price</p>
					</div>
					<hr />
					{#each changedPrice as price}
						<div class="grid grid-cols-3 my-2">
							<p class="text-base font-light">{price.unit}</p>
							<p class="text-base font-light">{price.changed}</p>
							<p class="text-base font-light">{numberToCurrency(price.price)}</p>
						</div>
					{/each}
					<hr />
					<div class="grid grid-cols-3 mt-2 mb-4">
						<p class="text-base font-semibold">Total:</p>
						<p />
						<p class="text-base font-semibold">
							{numberToCurrency(changedPrice.reduce((total, price) => total + price.price, 0))}
						</p>
					</div>
				{/if}
			</div>
			<div>
				<p class="text-lg font-medium mb-2">Utility</p>
				<MultiSelect
					bind:selected={payToUtility}
					options={tenantRentalActiveUnits.map((unit) => ({
						label: unit.RentalUnits.roomNumber,
						value: unit.RentalUnits.id
					}))}
					--sms-padding="10px"
				/>
				{#if payToUtility.length}
					{#each payToUtility as unit}
						<label class="grid p-4">
							<span class="text-primary font-light text-base"> Amount </span>

							<input
								placeholder="Amount"
								class="border-[1px] mt-1 border-black/10 rounded-md p-2"
								name="search"
							/>
						</label>
					{/each}
				{/if}
			</div>
			{#if payToUtility.length || payToUnit.length}
				<button class="bg-primary text-white rounded-md py-2 px-6"> Generate Bill</button>
			{/if}
		</div>
	</div>
{/if}
