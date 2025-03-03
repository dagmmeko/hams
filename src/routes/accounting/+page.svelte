<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';
	import ChartComponent from '$lib/components/ChartComponent.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toast } from '@zerodevx/svelte-toast';
	import dayjs from 'dayjs';

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
		PointElement
	} from 'chart.js';
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
		LinearScale
	);

	import { numberToCurrency } from '$lib/utils/currency';
	import { map } from 'zod';

	let { data } = $props();

	let filterStartDate: any = $state();
	let filterEndDate: any = $state();
	let dateInput: any = $state();
	let dateInput2: any = $state();

	let crvSum = data.crvReceipts.reduce((acc, receipt) => {
		if (receipt.crvReceipt) {
			return acc + receipt.amount;
		}
		return acc;
	}, 0);

	const depositsSum = data.totalSecurityDeposit.reduce((acc, tenantRental) => {
		if (tenantRental.active && tenantRental.securityDeposit !== null) {
			return acc + tenantRental?.securityDeposit;
		}
		return acc;
	}, 0);
</script>

<div class="md:mx-10 mx-5 my-12">
	<div class="mb-6">
		<p class="text-2xl font-medium text-primary">General Financial Statistics</p>
	</div>
	<form class="grid grid-cols-4 items-end mb-6 gap-4">
		<label class="grid gap-2">
			<span class="text-primary font-medium"> Start Date </span>
			<input
				type="date"
				required={filterEndDate}
				class=" border-[1px] border-primary/60 rounded-md p-2"
				name="filterStartDate"
				bind:value={filterStartDate}
				bind:this={dateInput}
				onclick={() => {
					dateInput && dateInput.showPicker();
				}}
			/>
		</label>
		<label class="grid gap-2">
			<span class="text-primary font-medium"> End Date </span>
			<input
				type="date"
				required={filterStartDate}
				class=" border-[1px] border-primary/60 rounded-md p-2"
				name="filterEndDate"
				bind:value={filterEndDate}
				bind:this={dateInput2}
				onclick={() => {
					dateInput2 && dateInput2.showPicker();
				}}
			/>
		</label>
		<button
			onclick={stopPropagation(async () => {
				if (filterStartDate && filterEndDate) {
					const newFilterParams = new URLSearchParams(page.url.search);

					newFilterParams.set('filterStartDate', filterStartDate);
					newFilterParams.set('filterEndDate', filterEndDate);
					await goto(`/accounting?${newFilterParams.toString()}`);
				} else {
					toast.push('Please select both start and end date');
					await goto(`?/accounting`);
				}
			})}
			class="bg-primary text-gray-200 rounded-md py-2 px-6 mr-4 h-fit"
		>
			Filter result
		</button>
	</form>
	<p class="text-xl font-medium text-primary mb-3">Income</p>

	<div class=" grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-1 gap-4">
		<div class="bg-white border-[1px] col-span-2 border-subtitle p-3 rounded-sm text-center">
			Total revenue - income from rentals & Utility bills
			<p class="mt-2">
				{numberToCurrency(data.totalRentalPayment, {
					currency: 'ETB',
					currencyDisplay: 'code'
				})}
			</p>
			<ChartComponent 
				type="line" 
				rawData={{
					type: 'revenue',
					label: 'Total revenue',
					values: data.receipts.map((receipt) => receipt.amount)
				}}
			/>
		</div>

		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			<div class="font-semibold">Deposits income - Advance deposits collected from guests</div>
			<hr class="p-1" />
			<p>
				<span class="font-semibold"> Total </span>
				{numberToCurrency(depositsSum, {
					currency: 'ETB',
					currencyDisplay: 'code'
				})}
			</p>
			<div
				class="overflow-y-auto flex-1 max-h-96 p-3"
				style:-webkit-mask-image={`linear-gradient(to top, hsla(0,0%,0%,0) 0, hsla(0,0%,0%,1) 16px, hsla(0,0%,0%,1) 100%)`}
				style:mask-image={`linear-gradient(to top, hsla(0,0%,0%,0) 0, hsla(0,0%,0%,1) 16px, hsla(0,0%,0%,1) 100%)`}
			>
				{#each data.totalSecurityDeposit as deposit}
					<div class="text-left mt-2 p-2 rounded bg-ghost">
						<p class="font-semibold">{deposit.Tenants?.fullName}</p>
						<p class="text-sm">
							<span class="font-semibold">Amount</span>
							{numberToCurrency(deposit.securityDeposit || 0, {
								currency: 'ETB',
								currencyDisplay: 'code'
							})}
						</p>
					</div>
				{:else}
					<p>No Deposits</p>
				{/each}
			</div>
		</div>
		<div class="bg-white flex flex-col border-[1px] border-subtitle rounded-sm text-center pt-2">
			<div class="text-lg font-semibold">CRV Receipts</div>
			<p>
				<span class="font-semibold">Total: </span>
				{numberToCurrency(crvSum, {
					currency: 'ETB',
					currencyDisplay: 'code'
				})}
			</p>
			<div
				class="overflow-y-auto flex-1 max-h-96 p-3"
				style:-webkit-mask-image={`linear-gradient(to top, hsla(0,0%,0%,0) 0, hsla(0,0%,0%,1) 16px, hsla(0,0%,0%,1) 100%)`}
				style:mask-image={`linear-gradient(to top, hsla(0,0%,0%,0) 0, hsla(0,0%,0%,1) 16px, hsla(0,0%,0%,1) 100%)`}
			>
				{#each data.crvReceipts as receipt}
					<div class="text-left mt-2 p-2 rounded bg-primary/20">
						<p class="font-semibold">{receipt.Tenants?.fullName}</p>
						<p class="text-sm">
							<span class="font-semibold">Amount</span>
							{numberToCurrency(receipt.amount, {
								currency: 'ETB',
								currencyDisplay: 'code'
							})}
						</p>
					</div>
				{:else}
					<p>No CRV Receipts</p>
				{/each}
			</div>
		</div>
	</div>
	<p class="text-xl font-medium text-primary mt-6 mb-3">Expenses</p>
	<div class=" grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4">
		<div class="bg-white border-[1px] col-span-2 border-subtitle p-3 rounded-sm text-center">
			Utility bills - Electricity, water, gas, internet, phone bills
			{numberToCurrency(
				data.receipts.reduce((acc, receipt) => {
					if (!receipt.crvReceipt && !receipt.isRentPayment && !receipt.isUtilityAndRentPayment) {
						return acc + receipt.amount;
					}
					return acc;
				}, 0),
				{
					currency: 'ETB',
					currencyDisplay: 'code'
				}
			)}
			<ChartComponent 
				type="line" 
				rawData={{
					type: 'utility',
					label: 'Utility Bills',
					values: data.receipts.map((receipt) => {
						if (!receipt.crvReceipt && !receipt.isRentPayment && !receipt.isUtilityAndRentPayment) {
							return receipt.amount;
						}
						return 0;
					})
				}}
			/>
		</div>

		<div class="bg-white border-[1px] col-span-2 border-subtitle p-3 rounded-sm text-center">
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
						currencyDisplay: 'code'
					}
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
						data.totalSecurityFee
					]
				}}
			/>
		</div>
	</div>
</div>
