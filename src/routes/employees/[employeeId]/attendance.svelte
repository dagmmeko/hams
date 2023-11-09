<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import QR from '$lib/assets/qr.png';
	import SvelteTable, { type TableColumn } from 'svelte-table';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import DeleteLeavesTableComponent from './delete-leaves-table-component.svelte';
	import { clickOutside } from '$lib/utils/click-outside';
	import { enhance } from '$app/forms';

	export let data: PageData;
	let dateInput: any;
	let dateInput2: any;

	let modal = false;

	let hasDeleteLeavesScope = true;
	const {
		form: addLeaveForm,
		enhance: addLeaveFormEnhance,
		constraints
	} = superForm(data.addLeaveForm, {
		onUpdate: () => {
			modal = false;
		}
	});

	// const hireDate = dateProxy(editEmployeeForm, 'hiredDate', { format: 'date', empty: 'undefined' });
</script>

<div class="">
	<div class="flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Employee Attendance</p>
		</div>
		<form method="post" use:enhance action="?/markAbsent">
			<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 px-6">
				Mark Today absent</button
			>
		</form>
	</div>
	<div>
		{#each data.employee.Attendance as attendance}
			{attendance.description}
			{attendance.createdAt}
		{/each}
	</div>
</div>

{#if modal}
	<form use:addLeaveFormEnhance method="post" action="?/addLeave">
		<div
			class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		>
			<div
				use:clickOutside={() => (modal = false)}
				class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
			>
				<div>
					<p class="text-xl font-semibold">New Leave Permission</p>
					<p class="text-sm text-subtitle pt-2">
						Register new leave here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="text-primary font-medium"> Reason </span>
					<textarea
						required
						bind:value={$addLeaveForm.description}
						{...$constraints.description}
						name="description"
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>

				<label class="grid">
					<span class="text-primary font-medium"> Start Date </span>
					<input
						type="date"
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
						bind:this={dateInput}
						on:click={() => {
							dateInput && dateInput.showPicker();
						}}
						required
						bind:value={$addLeaveForm.startingDate}
						{...$constraints.startingDate}
						name="startingDate"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> End Date </span>
					<input
						type="date"
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
						bind:this={dateInput2}
						on:click={() => {
							dateInput2 && dateInput2.showPicker();
						}}
						required
						bind:value={$addLeaveForm.endDate}
						{...$constraints.endDate}
						name="endDate"
					/>
				</label>
				<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2">
					Save Leave
				</button>
			</div>
		</div>
	</form>
{/if}
