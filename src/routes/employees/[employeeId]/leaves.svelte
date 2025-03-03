<script lang="ts">
	import { clickOutside } from '$lib/utils/click-outside'
	import dayjs from 'dayjs'
	import SvelteTable, { type TableColumn } from 'svelte-table'
	import { superForm } from 'sveltekit-superforms/client'
	import { page, updated } from '$app/state'
	import type { PageData } from './$types'
	import DeleteLeavesTableComponent from './delete-leaves-table-component.svelte'
	import { enhance } from '$app/forms'
	import { toast } from '@zerodevx/svelte-toast'

	interface Props {
		data: PageData
	}

	let { data = $bindable() }: Props = $props()
	let dateInput: any = $state()
	let dateInput2: any = $state()

	let modal = $state(false)
	let editModal = $state(false)

	let hasDeleteLeavesScope = true
	const {
		form: addLeaveForm,
		enhance: addLeaveFormEnhance,
		constraints,
	} = superForm(data.addLeaveForm, {
		onUpdate: () => {
			modal = false
		},
	})

	// const hireDate = dateProxy(editEmployeeForm, 'hiredDate', { format: 'date', empty: 'undefined' });

	let rows = $derived(data.employee.EmployeesLeaves)
	let columns = $derived([
		{
			key: 'title',
			title: 'Reason',
			value: (v: (typeof rows)[number]) => v?.description ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60  border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'from',
			title: 'Start Date',
			value: (v: (typeof rows)[number]) =>
				dayjs(v?.startingDate).format('MMM DD, YYYY').toString() ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60  border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'to',
			title: 'End Date',
			value: (v: (typeof rows)[number]) =>
				dayjs(v?.endDate).format('MMM DD, YYYY').toString() ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60  border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'by',
			title: 'Approved By',
			value: (v: (typeof rows)[number]) =>
				v.ApprovedBy.User.userName + ` (${v.ApprovedBy.Role.name})`,
			headerClass:
				'text-left pl-2 bg-ghost/60  border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},

		hasDeleteLeavesScope
			? {
					key: 'delete',
					title: '',
					renderComponent: {
						component: DeleteLeavesTableComponent,
						props: {
							data: data,
						},
					},
					headerClass:
						'bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
					class: 'border-b-[1px] border-[#B3B4B8]',
				}
			: (null as unknown as TableColumn<(typeof rows)[number]>),
	])

	let selectedLeave: any = $state()
</script>

<div class="">
	<div class="justify-between p-6 md:flex">
		<div class="flex space-x-4">
			<p class="text-lg">Employee Leave</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_LEAVES')}
			<button onclick={() => (modal = true)} class="rounded-md bg-primary px-6 py-2 text-white">
				New Leave Permission</button
			>
		{/if}
	</div>
	<div class="overflow-x-auto">
		<SvelteTable
			classNameTable="rolesTable"
			on:clickCell={(event) => {
				if (
					page.data.session?.authUser.Employee.Role.Scopes.find(
						(s) => s.name === 'VIEW_EMPLOYEE_DETAIL_PAGE',
					)
				) {
					selectedLeave = event.detail.row
					editModal = true
				} else {
					toast.push('You do not have permission to edit leaves')
				}
			}}
			{columns}
			{rows}
		/>
	</div>
</div>

{#if modal}
	<form use:addLeaveFormEnhance method="post" action="?/addLeave">
		<div
			class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		>
			<div
				use:clickOutside={() => (modal = false)}
				class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
			>
				<div>
					<p class="text-xl font-semibold">New Leave Permission</p>
					<p class="pt-2 text-sm text-subtitle">
						Register new leave here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="font-medium text-primary"> Reason </span>
					<textarea
						required
						bind:value={$addLeaveForm.description}
						{...$constraints.description}
						name="description"
						class="w-[420px] rounded-md border-[1px] border-black/60 p-2"
					></textarea>
				</label>

				<label class="grid">
					<span class="font-medium text-primary"> Start Date </span>
					<input
						type="date"
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput}
						onclick={() => {
							dateInput && dateInput.showPicker()
						}}
						required
						bind:value={$addLeaveForm.startingDate}
						{...$constraints.startingDate}
						name="startingDate"
					/>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> End Date </span>
					<input
						type="date"
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput2}
						onclick={() => {
							dateInput2 && dateInput2.showPicker()
						}}
						required
						bind:value={$addLeaveForm.endDate}
						{...$constraints.endDate}
						name="endDate"
					/>
				</label>
				<button
					onclick={(e) => {
						e.stopPropagation()
					}}
					class="rounded-md bg-primary py-2 text-white"
				>
					Save Leave
				</button>
			</div>
		</div>
	</form>
{/if}

{#if editModal}
	<form
		use:enhance={({ formData }) => {
			formData.set('leaveId', selectedLeave.id.toString())
			return ({ result }) => {
				if (result.status === 200) {
					editModal = false
					toast.push('Leave edited successfully')
				} else {
					toast.push('Failed to edit leave')
				}
			}
		}}
		method="post"
		action="?/editLeave"
	>
		<div
			class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		>
			<div
				use:clickOutside={() => (editModal = false)}
				class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
			>
				<div>
					<p class="text-xl font-semibold">Edit Leave Permission</p>
					<p class="pt-2 text-sm text-subtitle">
						Edit leave detail here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="font-medium text-primary"> Reason </span>
					<textarea
						required
						value={selectedLeave.description}
						name="editedDescription"
						class="w-[420px] rounded-md border-[1px] border-black/60 p-2"
					></textarea>
				</label>

				<label class="grid">
					<span class="font-medium text-primary"> Start Date </span>
					<input
						type="date"
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput}
						onclick={() => {
							dateInput && dateInput.showPicker()
						}}
						required
						value={dayjs(selectedLeave.startingDate).format('YYYY-MM-DD')}
						name="editedStartingDate"
					/>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> End Date </span>
					<input
						type="date"
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput2}
						onclick={() => {
							dateInput2 && dateInput2.showPicker()
						}}
						required
						value={dayjs(selectedLeave.endDate).format('YYYY-MM-DD')}
						name="editedEndDate"
					/>
				</label>
				<button
					onclick={(e) => {
						e.stopPropagation()
					}}
					class="rounded-md bg-primary py-2 text-white"
				>
					Edit Leave
				</button>
			</div>
		</div>
	</form>
{/if}
