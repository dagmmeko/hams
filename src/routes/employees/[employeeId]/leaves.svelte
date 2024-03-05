<script lang="ts">
	import { clickOutside } from '$lib/utils/click-outside';
	import dayjs from 'dayjs';
	import SvelteTable, { type TableColumn } from 'svelte-table';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import DeleteLeavesTableComponent from './delete-leaves-table-component.svelte';

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

	$: rows = data.employee.EmployeesLeaves;
	$: columns = [
		{
			key: 'title',
			title: 'Reason',
			value: (v: typeof rows[number]) => v?.description ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60  border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'from',
			title: 'Start Date',
			value: (v: typeof rows[number]) =>
				dayjs(v?.startingDate).format('MMM DD, YYYY').toString() ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60  border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'to',
			title: 'End Date',
			value: (v: typeof rows[number]) => dayjs(v?.endDate).format('MMM DD, YYYY').toString() ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60  border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'by',
			title: 'Approved By',
			value: (v: typeof rows[number]) => v.ApprovedBy.User.userName ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60  border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},

		hasDeleteLeavesScope
			? {
					key: 'delete',
					title: '',
					renderComponent: {
						component: DeleteLeavesTableComponent,
						props: {
							data: data
						}
					},
					headerClass:
						'bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
					class: 'border-b-[1px] border-[#B3B4B8]'
			  }
			: (null as unknown as TableColumn<typeof rows[number]>)
	];
</script>

<div class="">
	<div class="md:flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Employee Leave</p>
		</div>
		{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_LEAVES')}
			<button
				on:click={() => (modal = true)}
				class="bg-primary text-white rounded-md py-2 px-6"
				on:click={() => (modal = true)}
			>
				New Leave Permission</button
			>
		{/if}
	</div>
	<div class="overflow-x-auto">
		<SvelteTable classNameTable="rolesTable" on:clickCell={(event) => {}} {columns} {rows} />
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
