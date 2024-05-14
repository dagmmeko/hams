<script lang="ts">
	import { Line, Bar } from 'svelte-chartjs';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
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

	export let data;

	let filterStartDate: any;
	let filterEndDate: any;
	let dateInput: any;
	let dateInput2: any;
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
				on:click={() => {
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
				on:click={() => {
					dateInput2 && dateInput2.showPicker();
				}}
			/>
		</label>
		<button
			on:click|stopPropagation={async () => {
				if (filterStartDate && filterEndDate) {
					const newFilterParams = new URLSearchParams($page.url.search);

					newFilterParams.set('filterStartDate', filterStartDate);
					newFilterParams.set('filterEndDate', filterEndDate);
					await goto(`/accounting?${newFilterParams.toString()}`);
				} else {
					toast.push('Please select both start and end date');
					await goto(`?/accounting`);
				}
			}}
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
			<Line
				data={{
					labels: data.receipts.map((receipt) => {
						return dayjs(receipt.receiptReceivedOn).format('DD/MM/YYYY');
					}),
					datasets: [
						{
							label: 'Total revenue',
							data: data.receipts.map((receipt) => {
								return receipt.amount;
							}),
							backgroundColor: 'rgba(255, 99, 132, 0.2)',
							borderColor: 'rgba(255, 99, 132, 1)',
							borderWidth: 1,
							pointBackgroundColor: 'rgb(255, 255, 255)',
							pointBorderWidth: 10,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: 'rgb(0, 0, 0)',
							pointHoverBorderColor: 'rgba(220, 220, 220,1)',
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10
						}
					]
				}}
				options={{ responsive: true }}
			/>
		</div>

		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Deposits income - Advance deposits collected from guests
			<p>
				{numberToCurrency(data.totalSecurityDeposit, {
					currency: 'ETB',
					currencyDisplay: 'code'
				})}
			</p>
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			CRV Receipts
			<p>
				{numberToCurrency(data.crvReceipts, {
					currency: 'ETB',
					currencyDisplay: 'code'
				})}
			</p>
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
			<Line
				data={{
					labels: data.receipts.map((receipt) => {
						return dayjs(receipt.receiptReceivedOn).format('DD/MM/YYYY');
					}),
					datasets: [
						{
							label: '',
							data: data.receipts.map((receipt) => {
								if (
									!receipt.crvReceipt &&
									!receipt.isRentPayment &&
									!receipt.isUtilityAndRentPayment
								) {
									return receipt.amount;
								}
								return 0;
							}),
							backgroundColor: 'rgba(255, 99, 132, 0.2)',
							borderColor: 'rgba(255, 99, 132, 1)',
							borderWidth: 1,
							pointBackgroundColor: 'rgb(255, 255, 255)',
							pointBorderWidth: 10,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: 'rgb(0, 0, 0)',
							pointHoverBorderColor: 'rgba(220, 220, 220,1)',
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10
						}
					]
				}}
				options={{ responsive: true }}
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
			<Bar
				data={{
					labels: ['Cleaning', 'Electricity', 'Pluming', 'Painting', 'Security'],
					datasets: [
						{
							label: '',
							data: [
								data.totalCleaningFee,
								data.totalElectricityFee,
								data.totalPlumbingFee,
								data.totalPaintingFee,
								data.totalSecurityFee
							],
							backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
						}
					]
				}}
			/>
		</div>
	</div>
</div>
