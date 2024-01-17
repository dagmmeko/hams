<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { clickOutside } from '$lib/utils/click-outside';

	let modal = true;

	export let data: PageData;
	export let form: ActionData;
	const tenantsActiveUnits = data.tenant?.TenantRental.filter((unit) => unit.active) ?? [];
	const priceChange =
		data.tenant?.PriceChange.filter((unit) => unit.tenantId === data.tenant?.id) ?? [];
	// $: console.log({
	// 	tenantsActiveUnits: tenantsActiveUnits?.filter((unit) => unit.RentalUnits),
	// 	priceChange: priceChange
	// });
	let payToUnit: any;
	let val: any;
	$: {
		console.log(
			priceChange.filter((unit) => {
				return unit.unitId === payToUnit;
			})
		);
	}
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
			<label class="grid">
				<span class="text-primary font-medium"> Unit Type </span>
				<select
					bind:value={payToUnit}
					required
					name="unitType"
					class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
				>
					{#each tenantsActiveUnits ?? [] as unit}
						<option value={unit.id}>{unit.RentalUnits.roomNumber}</option>
					{/each}
				</select>
			</label>
			{#if priceChange.find((unit) => {
				unit.unitId === payToUnit;
			})}
				{priceChange.find((unit) => {
					unit.unitId === payToUnit;
				})?.price}
			{/if}
			{payToUnit}
		</div>
	</div>
{/if}
