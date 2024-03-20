<script lang="ts">
	import { enhance } from '$app/forms';
	import { clickOutside } from '$lib/utils/click-outside';
	import dayjs from 'dayjs';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';

	export let data: PageData;

	let modal = false;

	let selectedAttendance: any;

	// const hireDate = dateProxy(editEmployeeForm, 'hiredDate', { format: 'date', empty: 'undefined' });
</script>

<div class="p-6">
	<div class="md:flex justify-between">
		<div class="flex space-x-4">
			<p class="text-lg">Employee Attendance</p>
		</div>
		{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_ABSENT')}
			<form method="post" use:enhance action="?/markAbsent">
				<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 px-6">
					Mark Today absent</button
				>
			</form>
		{/if}
	</div>
	<div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 my-6">
		{#each data.employee.Attendance as attendance}
			<button
				on:click={() => {
					if (
						$page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_ABSENT')
					) {
						modal = true;
						selectedAttendance = attendance;
					} else {
						toast.push('You do not have permission to edit employee attendance');
					}
				}}
				class="shadow-md text-left rounded bg-primary/10 p-4"
			>
				<p class="font-medium flex gap-2 text-primary">
					Absent on <br />
					<span class="font-normal underline">
						{dayjs(attendance.createdAt).format('MMM DD, YYYY')}
					</span>
				</p>
				<p class="font-medium mt-2">
					Description <br /> <span class="font-normal"> {attendance.description} </span>
				</p>
			</button>
		{/each}
	</div>
</div>

{#if modal}
	<form
		use:enhance={({ formData }) => {
			formData.set('attendanceId', selectedAttendance.id.toString());
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
					<p class="text-xl font-semibold">Edit Attendance</p>
					<p class="text-sm text-subtitle pt-2">
						Edit attendance description here. Click save when you're done.
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
						value={selectedAttendance.description}
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
