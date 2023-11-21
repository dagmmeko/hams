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
	import { updated } from '$app/stores';

	export let data: PageData;
	let dateInput: any;
	let dateInput2: any;

	let modal = false;
	let hasDeleteLeavesScope = true;

	let selectedAttendance: any;

	// const hireDate = dateProxy(editEmployeeForm, 'hiredDate', { format: 'date', empty: 'undefined' });
</script>

<div class="p-6">
	<div class="flex justify-between">
		<div class="flex space-x-4">
			<p class="text-lg">Employee Attendance</p>
		</div>
		<form method="post" use:enhance action="?/markAbsent">
			<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 px-6">
				Mark Today absent</button
			>
		</form>
	</div>
	<div class="grid grid-cols-3 gap-4 my-6">
		{#each data.employee.Attendance as attendance}
			<button
				on:click={() => {
					modal = true;
					selectedAttendance = attendance;
				}}
				class="shadow-md text-left rounded bg-primary/10 p-4"
			>
				<p class="font-medium">
					Description <br /> <span class="font-normal"> {attendance.description} </span>
				</p>
				<p class="font-medium">
					Absent on <br />
					<span class="font-normal"> {dayjs(attendance.createdAt).format('MMM DD, YYYY')} </span>
				</p>
			</button>
		{/each}
	</div>
</div>

{#if modal}
	<form
		use:enhance={({ formData }) => {
			formData.set('id', selectedAttendance.id.toString());
			return (updated) => {
				if (updated) {
					modal = false;
				}
			};
		}}
		method="post"
		action="?/editAttendance"
	>
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
				<div class="gird">
					<span class="text-primary font-medium"> On </span>
					<span class="font-normal">
						{dayjs(selectedAttendance.createdAt).format('MMM DD, YYYY')}
					</span>
				</div>

				<label class="grid">
					<span class="text-primary font-medium"> Reason </span>
					<textarea
						required
						bind:value={selectedAttendance.description}
						name="description"
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>

				<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2">
					Save Attendance
				</button>
			</div>
		</div>
	</form>
{/if}
