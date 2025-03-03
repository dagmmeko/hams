<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { toast } from '@zerodevx/svelte-toast'
	import { superForm } from 'sveltekit-superforms/client'
	import ChartComponent from '$lib/components/ChartComponent.svelte'
	import dayjs from 'dayjs'

	import {
		ArcElement,
		BarElement,
		CategoryScale,
		Chart,
		Legend,
		LinearScale,
		Title,
		Tooltip,
	} from 'chart.js'

	Chart.register(
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		Title,
		BarElement,

		LinearScale,
	)

	let { data, form } = $props()

	const { form: usdRateForm, enhance: usdRateEnhance, constraints } = superForm(data.usdRateForm)
	$effect.pre(() => {
		form?.updatedRate ? toast.push('Rate updated successfully') : null
	})
	let filterStartDate: any = $state()
	let filterEndDate: any = $state()
	let dateInput: any = $state()
	let dateInput2: any = $state()
	let disableChangeDollar: boolean = $state(true)

	// Chart data configurations
	const bookingsData = {
		labels: ['Website', 'Referral', 'Walk-in', 'Phone', 'Email', 'Social Media', 'Broker', 'Other'],
		datasets: [
			{
				data: [
					data.tenantFromWebsite,
					data.tenantFromReferral,
					data.tenantFromWalkIn,
					data.tenantFromPhone,
					data.tenantFromEmail,
					data.tenantFromSocial,
					data.tenantFromBroker,
					data.tenantFromOther,
				],
				backgroundColor: [
					'#F7464A',
					'#46BFBD',
					'#FDB45C',
					'#949FB1',
					'#4D5360',
					'#AC64AD',
					'#123456',
					'#654321',
				],
				hoverBackgroundColor: [
					'#FF5A5E',
					'#5AD3D1',
					'#FFC870',
					'#A8B3C5',
					'#616774',
					'#DA92DB',
					'#789ABC',
					'#CBA987',
				],
			},
		],
	}

	const unitStatusData = {
		labels: ['Out of Service', 'Good Condition', 'Needs Repair'],
		datasets: [
			{
				data: [data.badUnits, data.goodUnits, data.repairUnits],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
			},
		],
	}

	const employeeTypeData = {
		labels: ['Temporary', 'Part Time', 'Full Time'],
		datasets: [
			{
				label: 'Types',
				data: [data.temporaryEmployees, data.partTimeEmployees, data.fullTimeEmployees],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
			},
		],
	}

	const taskStatusData = {
		labels: ['Pending', 'In Progress', 'Checking', 'Completed'],
		datasets: [
			{
				data: [data.pendingTasks, data.inProgressTasks, data.checkingTasks, data.completedTasks],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
			},
		],
	}
	const vendorTaskData = {
		labels: ['Pending', 'In Progress', 'Checking', 'Completed'],
		datasets: [
			{
				data: [
					data.pendingVendorTasks,
					data.inProgressVendorTasks,
					data.checkingVendorTasks,
					data.completedVendorTasks,
				],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
			},
		],
	}

	const attendanceData = {
		labels: ['On Leave', 'Absent', 'Present', 'Is Fired'],
		datasets: [
			{
				label: 'Attendance',
				data: [
					data.onLeaveEmployees,
					data.absentEmployees,
					data.activeEmployees,
					data.firedEmployees,
				],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
			},
		],
	}
</script>

<div class="mx-10 my-12">
	<form use:usdRateEnhance method="post" action="?/changeRate">
		<label class="grid">
			<span class="font-semibold text-primary"> USD Rate</span>
			<span class="flex gap-2 py-1 text-xs">
				<p class="font-semibold">Last Updated:</p>
				{dayjs(data.usdRate[0].updatedAt).format('MMM DD/YY')}
			</span>
			<input
				class="w-24 rounded-md border-[1px] border-black/60 p-1"
				name="usdRate"
				bind:value={$usdRateForm.usdRate}
				{...$constraints.usdRate}
				oninput={() => {
					disableChangeDollar = false
				}}
			/>
		</label>
		<label class="hidden">
			<input name="id" bind:value={$usdRateForm.id} {...$constraints.id} />
		</label>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_DOLLAR_VALUE')}
			<button
				disabled={disableChangeDollar}
				type="submit"
				class=" {disableChangeDollar
					? 'bg-primary/50'
					: 'bg-primary'} mt-2 h-fit rounded-md p-1 text-sm text-white"
			>
				Save
			</button>
		{/if}
	</form>
	<div class="w-fit"></div>
	<div class="my-6">
		<p class="text-2xl font-medium text-primary">General Statistics</p>
	</div>
	<div class="grid rounded-sm bg-white p-3 text-center">
		<span class="my-2 text-xl font-semibold">Occupied Rooms</span>
		<div class="grid grid-cols-2 sm:grid-cols-4">
			{#each data.allUnits as units, key}
				<div
					class={`${
						units.active ? 'bg-[#FF6384] text-gray-200' : 'bg-[#36A2EB] text-gray-200'
					} border-[1px] border-white p-4`}
				>
					{units.roomNumber}
				</div>
			{/each}
		</div>

		<div class="mb-3 mt-6 text-left">
			<span class="text-lg font-semibold">Occupancy Rate</span>
			{(
				(data.allUnits.reduce((acc, unit) => (unit.active ? unit.kareMeter + acc : acc), 0) /
					data.allUnits.reduce((acc, unit) => unit.kareMeter + acc, 0)) *
				100
			).toFixed(2)} %
		</div>
		<div class="flex w-full">
			<div
				style="width: {((data.allUnits.reduce((acc, unit) => unit.kareMeter + acc, 0) -
					data.allUnits.reduce((acc, unit) => (unit.active ? unit.kareMeter + acc : acc), 0)) /
					data.allUnits.reduce((acc, unit) => unit.kareMeter + acc, 0)) *
					100}%;"
				class="bg-[#36A2EB] p-2 italic text-white"
			>
				{data.allUnits.reduce((acc, unit) => unit.kareMeter + acc, 0) -
					data.allUnits.reduce((acc, unit) => (unit.active ? unit.kareMeter + acc : acc), 0)} Available
				Square Meters
			</div>
			<div
				style="width: {(data.allUnits.reduce(
					(acc, unit) => (unit.active ? unit.kareMeter + acc : acc),
					0,
				) /
					data.allUnits.reduce((acc, unit) => unit.kareMeter + acc, 0)) *
					100}%;"
				class="bg-[#FF6384] p-2 italic text-white"
			>
				{data.allUnits.reduce((acc, unit) => (unit.active ? unit.kareMeter + acc : acc), 0)}
				Occupied Square Meter
			</div>
		</div>
	</div>
	<div class=" mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		<div class="rounded-sm border-[1px] border-subtitle bg-white p-3 text-center">
			<span class="my-2 text-xl"> Bookings by source </span>

			<ChartComponent
				type="pie"
				rawData={{
					type: 'bookings',
					values: [
						data.tenantFromWebsite,
						data.tenantFromReferral,
						data.tenantFromWalkIn,
						data.tenantFromPhone,
						data.tenantFromEmail,
						data.tenantFromSocial,
						data.tenantFromBroker,
						data.tenantFromOther,
					],
				}}
			/>
		</div>
		<div class="rounded-sm border-[1px] border-subtitle bg-white p-3 text-center">
			<span class="my-2 text-xl"> Unit Status </span>
			<ChartComponent
				type="pie"
				rawData={{
					type: 'unitStatus',
					values: [data.badUnits, data.goodUnits, data.repairUnits],
				}}
			/>
		</div>
		<div class="rounded-sm border-[1px] border-subtitle bg-white p-3 text-center sm:col-span-2">
			<span class="my-2 text-xl"> Employee Type </span>
			<ChartComponent
				type="bar"
				rawData={{
					type: 'employeeType',
					label: 'Types',
					values: [data.temporaryEmployees, data.partTimeEmployees, data.fullTimeEmployees],
				}}
			/>
		</div>
	</div>

	<form class="mt-6 grid grid-cols-4 items-end gap-4">
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
					await goto(`?${newFilterParams.toString()}`)
				} else {
					await goto(`?`)
				}
			}}
			class="mr-4 h-fit rounded-md bg-primary px-6 py-2 text-gray-200"
		>
			Filter result
		</button>
	</form>
	<div class=" mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		<div class="rounded-sm border-[1px] border-subtitle bg-white p-3 text-center">
			<span class="my-2 text-xl"> Internal Task Status </span>
			<ChartComponent
				type="pie"
				rawData={{
					type: 'taskStatus',
					values: [
						data.pendingTasks,
						data.inProgressTasks,
						data.checkingTasks,
						data.completedTasks,
					],
				}}
			/>
			<div class="mt-6 flex w-full justify-center bg-[#F7464A] p-1 italic text-gray-200">
				{data.expiredTasks} - tasks expired
			</div>
		</div>
		<div class="rounded-sm border-[1px] border-subtitle bg-white p-3 text-center">
			<span class="my-2 text-xl"> Vendor Task Status </span>
			<ChartComponent
				type="pie"
				rawData={{
					type: 'taskStatus',
					values: [
						data.pendingVendorTasks,
						data.inProgressVendorTasks,
						data.checkingVendorTasks,
						data.completedVendorTasks,
					],
				}}
			/>
			<div class="mt-6 flex w-full justify-center bg-[#F7464A] p-1 italic text-gray-200">
				{data.expiredVendorTasks} - tasks expired
			</div>
		</div>
		<div class="rounded-sm border-[1px] border-subtitle bg-white p-3 text-center sm:col-span-2">
			<span class="my-2 text-xl"> Attendance </span>
			<ChartComponent
				type="bar"
				rawData={{
					type: 'attendance',
					label: 'Attendance',
					values: [
						data.onLeaveEmployees,
						data.absentEmployees,
						data.activeEmployees,
						data.firedEmployees,
					],
				}}
			/>
		</div>
	</div>
</div>
