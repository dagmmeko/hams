<script lang="ts">
	import dayjs from 'dayjs';
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { clickOutside } from '$lib/utils/click-outside';
	import { superForm } from 'sveltekit-superforms/client';
	import SvelteTable from 'svelte-table';

	export let data;

	$: rows = data.internalTask || [];

	$: columns = [
		{
			key: 'title',
			title: 'Title',
			value: (v: typeof rows[number]) => v.title ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'taskStatus',
			title: 'Task Status',
			value: (v: typeof rows[number]) => v.taskStatus ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'dueDate',
			title: 'Due Date',
			value: (v: typeof rows[number]) => (v.dueDate ? dayjs(v.dueDate).format('MMM DD, YYYY') : ''),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'taskSeverity',
			title: 'Task Severity',
			value: (v: typeof rows[number]) => v.taskSeverity ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'assignedTo',
			title: 'Assigned To',
			value: (v: typeof rows[number]) =>
				v.AssignedTo.User.userName + ` (${v.AssignedTo.Role.name})` ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'createdBy',
			title: 'Created By',
			value: (v: typeof rows[number]) =>
				v.CreatedBy.User.userName + ` (${v.CreatedBy.Role.name})` ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	];

	let filterModal = false;
	let addTaskModal = false;
	let dateInput: any;

	const {
		form: addInternalTaskForm,
		enhance: addInternalTaskFormEnhance,
		constraints
	} = superForm(data.addInternalTaskForm, {
		onUpdate: () => {
			addTaskModal = false;
		}
	});
</script>

<div class=" bg-white rounded-md shadow-md border-[1px] border-black/20 mx-10 my-12">
	<div class="flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Tasks</p>
			<p class="bg-[#F9F5FF] h-fit text-xs rounded-xl p-2">{data.internalTask?.length} Tasks</p>
		</div>
		{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_INTERNAL_TASK')}
			<button
				class="bg-primary text-white rounded-md py-2 px-6"
				on:click={() => (addTaskModal = true)}
			>
				Add Task
			</button>
		{/if}
	</div>
	<div class="bg-ghost/60 p-6 flex justify-between">
		<button
			class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-1 text-sm shadow-md bg-white"
			on:click={() => (filterModal = !filterModal)}
		>
			<FiltersLines class="h-4 w-4" /> Add filters
		</button>

		{#if filterModal}
			<div class="fixed mt-12 z-50">
				<div
					use:clickOutside={() => (filterModal = false)}
					class="bg-white p-6 rounded-xl grid gap-4 justify-items-start shadow-md border-[1px] border-black/20"
				>
					<button
						on:click={async () => {
							await goto(`?`);
						}}
						class="hover:underline hover:text-primary"
					>
						All
					</button>

					<button
						on:click={async () => {
							const newSearchParams = new URLSearchParams($page.url.search);
							newSearchParams.set('unitType', 'COMMERCIAL');
							await goto(`?${newSearchParams.toString()}`);
						}}
						class="hover:underline hover:text-primary"
					>
						Rent Payment Expired
					</button>
				</div>
			</div>
		{/if}
	</div>
	<SvelteTable
		on:clickCell={(event) => {
			const taskId = event.detail.row.id;
			goto(`/tasks/${taskId}`);
		}}
		{columns}
		{rows}
	/>
</div>

{#if addTaskModal}
	<form use:addInternalTaskFormEnhance method="post" action="?/addInternalTask">
		<div
			class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		>
			<div
				use:clickOutside={() => (addTaskModal = false)}
				class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
			>
				<div>
					<p class="text-xl font-semibold">New Task</p>
					<p class="text-sm text-subtitle pt-2">Create new Task here and assign to Employee.</p>
				</div>

				<label class="w-full grid gap-1">
					<span class="text-primary font-medium"> Task Title </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="taskTitle"
						required
						bind:value={$addInternalTaskForm.taskTitle}
						{...$constraints.taskTitle}
					/>
				</label>

				<label class="w-full grid gap-1">
					<span class="text-primary font-medium"> Task Description </span>
					<textarea
						name="taskDescription"
						required
						bind:value={$addInternalTaskForm.taskDescription}
						{...$constraints.taskDescription}
						class=" border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid gap-1">
					<span class="text-primary w-full font-medium"> Task Due Date </span>
					<input
						type="date"
						name="taskDueDate"
						class=" border-[1px] border-black/60 rounded-md p-2 mt-1"
						bind:this={dateInput}
						required
						on:click={() => {
							dateInput && dateInput.showPicker();
						}}
						bind:value={$addInternalTaskForm.taskDueDate}
						{...$constraints.taskDueDate}
					/>
				</label>
				<label class="w-full grid gap-1">
					<span class="text-primary font-medium"> Task Severity </span>
					<select
						name="taskSeverity"
						bind:value={$addInternalTaskForm.taskSeverity}
						{...$constraints.taskSeverity}
						required
						class="mt-1 border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled> Select Severity </option>
						<option value="LOW"> Low</option>
						<option value="MEDIUM"> Medium </option>
						<option value="HIGH"> High</option>
						<option value="URGENT"> Urgent</option>
					</select>
				</label>
				<label class="grid w-full gap-1 h-fit">
					<span class="text-primary font-medium"> Assign To </span>
					<select
						name="assignedTo"
						bind:value={$addInternalTaskForm.assignedTo}
						{...$constraints.assignedTo}
						class="mt-1 border-[1px] border-black/60 rounded-md p-2"
						required
					>
						<option selected disabled> Pick an Employee </option>
						{#each data.employees as employee}
							<option
								disabled={employee.isAbsent || employee.onLeave || employee.isSuspended}
								value={employee.id}
							>
								{employee.User.userName} <span> {`( ${employee.Role.name} )`}</span>

								{employee.isAbsent ? ' - Absent' : ''}
								{employee.onLeave ? ' - On Leave' : ''}
								{employee.isSuspended ? ' - Suspended' : ''}
							</option>
						{/each}
					</select>
				</label>
				<button class="bg-primary text-white rounded-md py-2"> Save Employee</button>
			</div>
		</div>
	</form>
{/if}
