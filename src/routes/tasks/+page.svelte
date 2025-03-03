<script lang="ts">
	import dayjs from 'dayjs'
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { clickOutside } from '$lib/utils/click-outside'
	import { superForm } from 'sveltekit-superforms/client'
	import SvelteTable from 'svelte-table'

	let { data } = $props()

	let rows = $derived(data.internalTask || [])

	let columns = $derived([
		{
			key: 'title',
			title: 'Title',
			value: (v: (typeof rows)[number]) => v.title ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'taskStatus',
			title: 'Task Status',
			value: (v: (typeof rows)[number]) => v.taskStatus ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'dueDate',
			title: 'Due Date',
			value: (v: (typeof rows)[number]) =>
				v.dueDate ? dayjs(v.dueDate).format('MMM DD, YYYY') : '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'taskSeverity',
			title: 'Task Severity',
			value: (v: (typeof rows)[number]) => v.taskSeverity ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'assignedTo',
			title: 'Assigned To',
			value: (v: (typeof rows)[number]) =>
				v.AssignedTo.User.userName + ` (${v.AssignedTo.Role.name})`,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'createdBy',
			title: 'Created By',
			value: (v: (typeof rows)[number]) =>
				v.CreatedBy.User.userName + ` (${v.CreatedBy.Role.name})`,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
	])

	let filterModal = $state(false)
	let addTaskModal = $state(false)
	let dateInput: any = $state()

	const {
		form: addInternalTaskForm,
		enhance: addInternalTaskFormEnhance,
		constraints,
	} = superForm(data.addInternalTaskForm, {
		onUpdate: () => {
			addTaskModal = false
		},
	})
</script>

<div class=" mx-10 my-12 rounded-md border-[1px] border-black/20 bg-white shadow-md">
	<div class="flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Tasks</p>
			<p class="h-fit rounded-xl bg-[#F9F5FF] p-2 text-xs">{data.internalTask?.length} Tasks</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_INTERNAL_TASK')}
			<button
				class="rounded-md bg-primary px-6 py-2 text-white"
				onclick={() => (addTaskModal = true)}
			>
				Add Task
			</button>
		{/if}
	</div>
	<div class="flex justify-between bg-ghost/60 p-6">
		<button
			class="grid grid-flow-col items-center gap-1 rounded-md bg-white px-4 py-2 text-sm shadow-md"
			onclick={() => (filterModal = !filterModal)}
		>
			<FiltersLines class="h-4 w-4" /> Add filters
		</button>

		{#if filterModal}
			<div class="fixed z-50 mt-12">
				<div
					use:clickOutside={() => (filterModal = false)}
					class="grid justify-items-start gap-4 rounded-xl border-[1px] border-black/20 bg-white p-6 shadow-md"
				>
					<button
						onclick={async () => {
							await goto(`?`)
						}}
						class="hover:text-primary hover:underline"
					>
						All
					</button>

					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams(page.url.search)
							newSearchParams.set('unitType', 'COMMERCIAL')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Rent Payment Expired
					</button>
				</div>
			</div>
		{/if}
	</div>
	<SvelteTable
		on:clickCell={(event) => {
			const taskId = event.detail.row.id
			goto(`/tasks/${taskId}`)
		}}
		{columns}
		{rows}
	/>
</div>

{#if addTaskModal}
	<form use:addInternalTaskFormEnhance method="post" action="?/addInternalTask">
		<div
			class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		>
			<div
				use:clickOutside={() => (addTaskModal = false)}
				class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
			>
				<div>
					<p class="text-xl font-semibold">New Task</p>
					<p class="pt-2 text-sm text-subtitle">Create new Task here and assign to Employee.</p>
				</div>

				<label class="grid w-full gap-1">
					<span class="font-medium text-primary"> Task Title </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="taskTitle"
						required
						bind:value={$addInternalTaskForm.taskTitle}
						{...$constraints.taskTitle}
					/>
				</label>

				<label class="grid w-full gap-1">
					<span class="font-medium text-primary"> Task Description </span>
					<textarea
						name="taskDescription"
						required
						bind:value={$addInternalTaskForm.taskDescription}
						{...$constraints.taskDescription}
						class=" rounded-md border-[1px] border-black/60 p-2"
					></textarea>
				</label>
				<label class="grid gap-1">
					<span class="w-full font-medium text-primary"> Task Due Date </span>
					<input
						type="date"
						name="taskDueDate"
						class=" mt-1 rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput}
						required
						onclick={() => {
							dateInput && dateInput.showPicker()
						}}
						bind:value={$addInternalTaskForm.taskDueDate}
						{...$constraints.taskDueDate}
					/>
				</label>
				<label class="grid w-full gap-1">
					<span class="font-medium text-primary"> Task Severity </span>
					<select
						name="taskSeverity"
						bind:value={$addInternalTaskForm.taskSeverity}
						{...$constraints.taskSeverity}
						required
						class="mt-1 rounded-md border-[1px] border-black/60 p-2"
					>
						<option selected disabled> Select Severity </option>
						<option value="LOW"> Low</option>
						<option value="MEDIUM"> Medium </option>
						<option value="HIGH"> High</option>
						<option value="URGENT"> Urgent</option>
					</select>
				</label>
				<label class="grid h-fit w-full gap-1">
					<span class="font-medium text-primary"> Assign To </span>
					<select
						name="assignedTo"
						bind:value={$addInternalTaskForm.assignedTo}
						{...$constraints.assignedTo}
						class="mt-1 rounded-md border-[1px] border-black/60 p-2"
						required
					>
						<option selected disabled> Pick an Employee </option>
						{#each data.employees as employee}
							<option
								disabled={employee.isAbsent || employee.onLeave || employee.isSuspended}
								value={employee.id}
							>
								{employee.User.userName} - {`( ${employee.Role.name} )`}

								{employee.isAbsent ? ' - Absent' : ''}
								{employee.onLeave ? ' - On Leave' : ''}
								{employee.isSuspended ? ' - Suspended' : ''}
							</option>
						{/each}
					</select>
				</label>
				<button class="rounded-md bg-primary py-2 text-white"> Save Employee</button>
			</div>
		</div>
	</form>
{/if}
