<script lang="ts">
	import { enhance } from '$app/forms'
	import { numberToCurrency } from '$lib/utils/currency'
	import { toast } from '@zerodevx/svelte-toast'
	import type { ActionData, PageData } from './$types'
	import { page } from '$app/state'

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data = $bindable(), form = $bindable() }: Props = $props()
</script>

<div class=" mt-6 rounded-md border-[1px] border-black/20 bg-white p-6 shadow-sm">
	<div class="text-3xl">Rental History</div>
	<div class="mt-6 grid grid-cols-3">
		{#each data.tenant?.PriceChange || [] as priceChange}
			<div class="rounded-md bg-ghost p-4 shadow-md">
				{#if priceChange.approved}
					<form
						use:enhance={({ formData, cancel }) => {
							if (
								page.data.session?.authUser.Employee.Role.Scopes.find(
									(s) => s.name === 'EDIT_PRICE_CHANGE',
								)
							) {
								formData.set('priceChangeId', priceChange.id.toString())
							} else {
								toast.push('You do not have permission to edit price change')
								cancel()
							}
							return async ({ update }) => {
								await update()
								toast.push('Price change has been changed')
							}
						}}
						method="post"
						action="?/updatePriceChange"
					>
						<label class="flex items-center gap-2">
							<input
								onchange={(e) => e.currentTarget.form?.requestSubmit()}
								type="checkbox"
								name="priceChangeToggle"
								checked={priceChange.active}
								class=" h-4 w-4 rounded-md border-[1px] border-black/60 p-2"
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
							currencyDisplay: 'code',
						})}
					</p>
					<p>
						<span> New Price: </span>
						{numberToCurrency(priceChange.price, {
							currency: priceChange.RentalUnits.currency,
							currencyDisplay: 'code',
						})}
					</p>
				{/if}
			</div>
		{/each}
	</div>
</div>
