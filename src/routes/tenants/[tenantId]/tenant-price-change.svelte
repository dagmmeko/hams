<script lang="ts">
	import { enhance } from '$app/forms';
	import { numberToCurrency } from '$lib/utils/currency';
	import { toast } from '@zerodevx/svelte-toast';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
	<div class="text-3xl">Rental History</div>
	<div class="grid grid-cols-3 mt-6">
		{#each data.tenant?.PriceChange || [] as priceChange}
			<div class="bg-ghost rounded-md shadow-md p-4">
				{#if priceChange.approved}
					<form
						use:enhance={({ formData }) => {
							formData.set('priceChangeId', priceChange.id.toString());
							return async ({ update }) => {
								await update();
								toast.push('Price change has been changed');
							};
						}}
						method="post"
						action="?/updatePriceChange"
					>
						<label class="flex items-center gap-2">
							<input
								on:change={(e) => e.currentTarget.form?.requestSubmit()}
								type="checkbox"
								name="priceChangeToggle"
								checked={priceChange.active}
								class=" h-4 w-4 border-[1px] border-black/60 rounded-md p-2"
							/>
							<span> Active </span>
						</label>
					</form>

					<hr class="my-2" />
					<p><span> Room: </span>{priceChange.RentalUnits.roomNumber}</p>
					<p>
						<span> Real Price: </span>
						{numberToCurrency(priceChange.RentalUnits.price, {
							currency: priceChange.RentalUnits.currency,
							currencyDisplay: 'code'
						})}
					</p>
					<p>
						<span> New Price: </span>
						{numberToCurrency(priceChange.price, {
							currency: priceChange.RentalUnits.currency,
							currencyDisplay: 'code'
						})}
					</p>
				{/if}
			</div>
		{/each}
	</div>
</div>
