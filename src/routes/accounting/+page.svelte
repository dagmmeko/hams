<script lang="ts">
	import ChartComponent from '$lib/components/ChartComponent.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { toast } from '@zerodevx/svelte-toast'

	import {
		ArcElement,
		BarElement,
		CategoryScale,
		Chart,
		Legend,
		LinearScale,
		Title,
		Tooltip,
		LineElement,
		PointElement,
	} from 'chart.js'
	Chart.register(
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		Title,
		BarElement,
		LineElement,
		PointElement,
		LinearScale,
	)

	import { numberToCurrency } from '$lib/utils/currency'

	let { data } = $props()

	let filterStartDate: any = $state()
	let filterEndDate: any = $state()
	let dateInput: any = $state()
	let dateInput2: any = $state()

	let crvSum = data.crvReceipts.reduce((acc, receipt) => {
		if (receipt.crvReceipt) {
			return acc + receipt.amount
		}
		return acc
	}, 0)

	const depositsSum = data.totalSecurityDeposit.reduce((acc, tenantRental) => {
		if (tenantRental.active && tenantRental.securityDeposit !== null) {
			return acc + tenantRental?.securityDeposit
		}
		return acc
	}, 0)
</script>

<div class="mx-5 my-12 md:mx-10">
	<div class="mb-6">
		<p class="text-2xl font-medium text-primary">General Financial Statistics</p>
	</div>
	<form class="mb-6 grid grid-cols-4 items-end gap-4">
		<label class="grid gap-2">
			<span class="font-medium text-primary"> Start Date </span>
			<input
				type="date"
				required={filterEndDate}
				class=" rounded-md border-[1px] border-primary/60 p-2"
				name="filterStartDate"
				bind:value={filterStartDate}
				bind:this={dateInput}
				onclick={() => {
					dateInput && dateInput.showPicker()
				}}
			/>
		</label>
		<label class="grid gap-2">
			<span class="font-medium text-primary"> End Date </span>
			<input
				type="date"
				required={filterStartDate}
				class=" rounded-md border-[1px] border-primary/60 p-2"
				name="filterEndDate"
				bind:value={filterEndDate}
				bind:this={dateInput2}
				onclick={() => {
					dateInput2 && dateInput2.showPicker()
				}}
			/>
		</label>
		<button
			onclick={async (e) => {
				e.stopPropagation()
				if (filterStartDate && filterEndDate) {
					const newFilterParams = new URLSearchParams(page.url.search)

					newFilterParams.set('filterStartDate', filterStartDate)
					newFilterParams.set('filterEndDate', filterEndDate)
					await goto(`/accounting?${newFilterParams.toString()}`)
				} else {
					toast.push('Please select both start and end date')
					await goto(`?/accounting`)
				}
			}}
			class="mr-4 h-fit rounded-md bg-primary px-6 py-2 text-gray-200"
		>
			Filter result
		</button>
	</form>
	<p class="mb-3 text-xl font-medium text-primary">Income</p>

	<div class=" grid gap-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
		<div class="col-span-2 rounded-sm border-[1px] border-subtitle bg-white p-3 text-center">
			Total revenue - income from rentals & Utility bills
			<p class="mt-2">
				{numberToCurrency(data.totalRentalPayment, {
					currency: 'ETB',
					currencyDisplay: 'code',
				})}
			</p>
			<ChartComponent
				type="line"
				rawData={{
					type: 'revenue',
					label: 'Total revenue',
					values: data.receipts.map((receipt) => receipt.amount),
				}}
			/>
		</div>

		<div class="rounded-sm border-[1px] border-subtitle bg-white p-3 text-center">
			<div class="font-semibold">Deposits income - Advance deposits collected from guests</div>
			<hr class="p-1" />
			<p>
				<span class="font-semibold"> Total </span>
				{numberToCurrency(depositsSum, {
					currency: 'ETB',
					currencyDisplay: 'code',
				})}
			</p>
			<div
				class="max-h-96 flex-1 overflow-y-auto p-3"
				style:-webkit-mask-image={`linear-gradient(to top, hsla(0,0%,0%,0) 0, hsla(0,0%,0%,1) 16px, hsla(0,0%,0%,1) 100%)`}
				style:mask-image={`linear-gradient(to top, hsla(0,0%,0%,0) 0, hsla(0,0%,0%,1) 16px, hsla(0,0%,0%,1) 100%)`}
			>
				{#each data.totalSecurityDeposit as deposit}
					<div class="mt-2 rounded bg-ghost p-2 text-left">
						<p class="font-semibold">{deposit.Tenants?.fullName}</p>
						<p class="text-sm">
							<span class="font-semibold">Amount</span>
							{numberToCurrency(deposit.securityDeposit || 0, {
								currency: 'ETB',
								currencyDisplay: 'code',
							})}
						</p>
					</div>
				{:else}
					<p>No Deposits</p>
				{/each}
			</div>
		</div>
		<div class="flex flex-col rounded-sm border-[1px] border-subtitle bg-white pt-2 text-center">
			<div class="text-lg font-semibold">CRV Receipts</div>
			<p>
				<span class="font-semibold">Total: </span>
				{numberToCurrency(crvSum, {
					currency: 'ETB',
					currencyDisplay: 'code',
				})}
			</p>
			<div
				class="max-h-96 flex-1 overflow-y-auto p-3"
				style:-webkit-mask-image={`linear-gradient(to top, hsla(0,0%,0%,0) 0, hsla(0,0%,0%,1) 16px, hsla(0,0%,0%,1) 100%)`}
				style:mask-image={`linear-gradient(to top, hsla(0,0%,0%,0) 0, hsla(0,0%,0%,1) 16px, hsla(0,0%,0%,1) 100%)`}
			>
				{#each data.crvReceipts as receipt}
					<div class="mt-2 rounded bg-primary/20 p-2 text-left">
						<p class="font-semibold">{receipt.Tenants?.fullName}</p>
						<p class="text-sm">
							<span class="font-semibold">Amount</span>
							{numberToCurrency(receipt.amount, {
								currency: 'ETB',
								currencyDisplay: 'code',
							})}
						</p>
					</div>
				{:else}
					<p>No CRV Receipts</p>
				{/each}
			</div>
		</div>
	</div>
	<p class="mb-3 mt-6 text-xl font-medium text-primary">Expenses</p>
	<div class=" grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
		<div class="col-span-2 rounded-sm border-[1px] border-subtitle bg-white p-3 text-center">
			Utility bills - Electricity, water, gas, internet, phone bills
			{numberToCurrency(
				data.receipts.reduce((acc, receipt) => {
					if (!receipt.crvReceipt && !receipt.isRentPayment && !receipt.isUtilityAndRentPayment) {
						return acc + receipt.amount
					}
					return acc
				}, 0),
				{
					currency: 'ETB',
					currencyDisplay: 'code',
				},
			)}
			<ChartComponent
				type="line"
				rawData={{
					type: 'utility',
					label: 'Utility Bills',
					values: data.receipts.map((receipt) => {
						if (!receipt.crvReceipt && !receipt.isRentPayment && !receipt.isUtilityAndRentPayment) {
							return receipt.amount
						}
						return 0
					}),
				}}
			/>
		</div>

		<div class="col-span-2 rounded-sm border-[1px] border-subtitle bg-white p-3 text-center">
			Repairs and maintenance - Costs for upkeep, repairs of property
			<p>
				{numberToCurrency(
					data.totalCleaningFee +
						data.totalElectricityFee +
						data.totalPlumbingFee +
						data.totalPaintingFee +
						data.totalSecurityFee,
					{
						currency: 'ETB',
						currencyDisplay: 'code',
					},
				)}
			</p>
			<ChartComponent
				type="bar"
				rawData={{
					type: 'maintenance',
					label: 'Maintenance Costs',
					values: [
						data.totalCleaningFee,
						data.totalElectricityFee,
						data.totalPlumbingFee,
						data.totalPaintingFee,
						data.totalSecurityFee,
					],
				}}
			/>
		</div>
	</div>
</div>
