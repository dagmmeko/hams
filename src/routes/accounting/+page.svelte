<script lang="ts">
	import { numberToCurrency } from '$lib/utils/currency';
	import { Pie, Bar } from 'svelte-chartjs';
	import type { Receipts, Tenants, RentalUnits } from '@prisma/client';

	export let data;
	import {
		ArcElement,
		CategoryScale,
		Chart,
		Legend,
		Title,
		Tooltip,
		BarElement,
		LinearScale
	} from 'chart.js';
	Chart.register(
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		Title,
		BarElement,

		LinearScale
	);

	const piedata = data.receipts.reduce((acc: any, rec: any) => {
		console.log({ acc, rec });
		return rec;
	});
	const labeldata = data.receipts.map((rec) => {
		return rec;
	});
	console.log(piedata);
</script>

<div class="md:mx-10 mx-5 my-12">
	<div class="mb-6">
		<p class="text-2xl font-medium text-primary">GeneralFinancial Statistics</p>
	</div>
	<p class="text-xl font-medium text-primary mb-3">Income</p>
	<div class=" grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4">
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Room revenue - Total income from nightly/weekly rentals
			<!-- <Pie
				data={{
					labels: ['Out of Service', 'Good Condition', 'Needs Repair'],
					datasets: [
						{
							data: piedata,
							backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
							hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733']
						}
					]
				}}
			/> -->
			<p>
				{numberToCurrency(data.totalRentalPayment, {
					currency: 'ETB',
					currencyDisplay: 'code'
				})}
			</p>
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
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Utility bills - Electricity, water, gas, internet, phone bills
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Staff costs - Expenses for hiring, training new staff
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Repairs and maintenance - Costs for upkeep, repairs of property
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Contracted services - Expenses for outsourced services like housekeeping
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Housekeeping - Payments made to cleaning vendor(s)
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Repairs/maintenance - Payments to contractors for repairs
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Security - Payments to security vendor/team
		</div>
	</div>
</div>
