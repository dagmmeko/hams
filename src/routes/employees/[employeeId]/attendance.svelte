<script lang="ts">
	import { enhance } from '$app/forms'
	import { clickOutside } from '$lib/utils/click-outside'
	import dayjs from 'dayjs'
	import type { PageData } from './$types'
	import { page } from '$app/state'
	import { toast } from '@zerodevx/svelte-toast'

	interface Props {
		data: PageData
	}

	let { data = $bindable() }: Props = $props()

	let modal = $state(false)

	let selectedAttendance: any = $state()

	// const hireDate = dateProxy(editEmployeeForm, 'hiredDate', { format: 'date', empty: 'undefined' });
</script>

<div class="p-6">
	<div class="justify-between md:flex">
		<div class="flex space-x-4">
			<p class="text-lg">Employee Attendance</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_ABSENT')}
			<form method="post" use:enhance action="?/markAbsent">
				<button
					onclick={(e) => {
						e.stopPropagation()
					}}
					class="rounded-md bg-primary px-6 py-2 text-white"
				>
					Mark Today absent</button
				>
			</form>
		{/if}
	</div>
	<div class="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each data.employee.Attendance as attendance}
			<button
				onclick={() => {
					if (
						page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_ABSENT')
					) {
						modal = true
						selectedAttendance = attendance
					} else {
						toast.push('You do not have permission to edit employee attendance')
					}
				}}
				class="rounded bg-primary/10 p-4 text-left shadow-md"
			>
				<p class="flex gap-2 font-medium text-primary">
					Absent on <br />
					<span class="font-normal underline">
						{dayjs(attendance.createdAt).format('MMM DD, YYYY')}
					</span>
				</p>
				<p class="flex gap-2 font-medium text-primary">
					Approved By <br />
					<span class="font-normal underline">
						{attendance.ApprovedBy?.User.userName}
						<span class="text-sm"> {` (${attendance.ApprovedBy?.Role.name})`} </span>
					</span>
				</p>
				<p class="mt-2 font-medium">
					Description <br /> <span class="font-normal"> {attendance.description} </span>
				</p>
			</button>
		{/each}
	</div>
</div>

{#if modal}
	<form
		use:enhance={({ formData }) => {
			formData.set('attendanceId', selectedAttendance.id.toString())
			return (updated) => {
				if (updated) {
					modal = false
				}
			}
		}}
		method="post"
		action="?/editAttendance"
	>
		<div
			class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		>
			<div
				use:clickOutside={() => (modal = false)}
				class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
			>
				<div>
					<p class="text-xl font-semibold">Edit Attendance</p>
					<p class="pt-2 text-sm text-subtitle">
						Edit attendance description here. Click save when you're done.
					</p>
				</div>
				<div class="gird">
					<span class="font-medium text-primary"> On </span>
					<span class="font-normal">
						{dayjs(selectedAttendance.createdAt).format('MMM DD, YYYY')}
					</span>
				</div>

				<label class="grid">
					<span class="font-medium text-primary"> Reason </span>
					<textarea
						required
						value={selectedAttendance.description}
						name="description"
						class="w-[420px] rounded-md border-[1px] border-black/60 p-2"
					></textarea>
				</label>

				<button
					onclick={(e) => {
						e.stopPropagation()
					}}
					class="rounded-md bg-primary py-2 text-white"
				>
					Save Attendance
				</button>
			</div>
		</div>
	</form>
{/if}
