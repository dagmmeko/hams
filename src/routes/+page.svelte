<script>
	import { toast } from '@zerodevx/svelte-toast';
	import { Pie, Bar } from 'svelte-chartjs';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';

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

	export let data;
	export let form;

	const { form: usdRateForm, enhance, constraints } = superForm(data.usdRateForm);
	$: form?.updatedRate ? toast.push('Rate updated successfully') : null;
</script>

<div class="mx-10 my-12">
	<form use:enhance method="post" action="?/changeRate">
		<label class="grid">
			<span class="text-primary font-semibold py-1"> USD Rate</span>
			<input
				class="w-24 border-[1px] border-black/60 rounded-md p-1"
				name="usdRate"
				bind:value={$usdRateForm.usdRate}
				{...$constraints.usdRate}
			/>
		</label>
		<label class="hidden">
			<input name="id" bind:value={$usdRateForm.id} {...$constraints.id} />
		</label>
		{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_DOLLAR_VALUE')}
			<button type="submit" class="bg-primary h-fit text-sm p-1 rounded-md mt-2 text-white">
				Save
			</button>
		{/if}
	</form>
	<div class="w-fit" />
	<div class="my-6">
		<p class="text-2xl font-medium text-primary">General Statistics</p>
	</div>
	<div class="bg-white p-3 grid rounded-sm text-center">
		<span class="text-xl my-2">Occupancy rates</span>
		<div class="grid-cols-4 grid">
			{#each data.allUnits as units, key}
				<div
					class={`${
						units.active ? 'bg-[#F7464A] text-gray-200' : 'bg-[#669966] text-gray-200'
					} border-[1px] border-white p-4`}
				>
					{units.roomNumber}
				</div>
			{/each}
		</div>

		<div class="w-full flex mt-6">
			<div
				style="width: {((data.allUnits.length - data.activeUnits) / data.allUnits.length) * 100}%;"
				class="bg-[#669966] text-white p-2 italic"
			>
				{data.allUnits.length - data.activeUnits} Available Units
			</div>
			<div
				style="width: {(data.activeUnits / data.allUnits.length) * 100}%;"
				class="bg-[#F7464A] p-2 text-white italic"
			>
				{data.activeUnits} Occupied Units
			</div>
		</div>
	</div>
	<div class=" grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-6">
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Bookings by source
			<Pie
				data={{
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
								data.tenantFromOther
							],
							backgroundColor: [
								'#F7464A',
								'#46BFBD',
								'#FDB45C',
								'#949FB1',
								'#4D5360',
								'#AC64AD',
								'#123456',
								'#654321'
							],
							hoverBackgroundColor: [
								'#FF5A5E',
								'#5AD3D1',
								'#FFC870',
								'#A8B3C5',
								'#616774',
								'#DA92DB',
								'#789ABC',
								'#CBA987'
							]
						}
					],
					labels: [
						'Website',
						'Referral',
						'Walk-in',
						'Phone',
						'Email',
						'Social Media',
						'Broker',
						'Other'
					]
				}}
				options={{ responsive: true }}
			/>
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Upcoming reservations
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			unit status

			<Pie
				data={{
					labels: ['Out of Service', 'Good Condition', 'Needs Repair'],
					datasets: [
						{
							data: [data.badUnits, data.goodUnits, data.repairUnits],
							backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
							hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733']
						}
					]
				}}
			/>
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			<span class="text-xl my-2"> Internal Task Status </span>
			<Pie
				data={{
					labels: ['Pending', 'In Progress', 'Checking', 'Completed'],
					datasets: [
						{
							data: [
								data.pendingTasks,
								data.inProgressTasks,
								data.checkingTasks,
								data.completedTasks
							],
							backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
							hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733']
						}
					]
				}}
			/>
			<div class="flex w-full bg-[#F7464A] mt-6 p-1 justify-center text-gray-200 italic">
				{data.expiredTasks} - tasks expired
			</div>
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			<span class="text-xl my-2"> Attendance </span>
			<Bar
				data={{
					labels: ['On Leave', 'Absent', 'Present', 'Is Fired'],
					datasets: [
						{
							label: 'Attendance',
							data: [
								data.onLeaveEmployees,
								data.absentEmployees,
								data.activeEmployees,
								data.firedEmployees
							],
							backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
						}
					]
				}}
			/>
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			<span class="text-xl my-2"> Employee Type </span>
			<Bar
				data={{
					labels: ['Temporary', 'Part Time', 'Full Time'],
					datasets: [
						{
							label: 'Types',
							data: [data.temporaryEmployees, data.partTimeEmployees, data.fullTimeEmployees],
							backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
						}
					]
				}}
			/>
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			vendor active tasks
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			vendor completed tasks
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">vendor types</div>
	</div>
</div>
