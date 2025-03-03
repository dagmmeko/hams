<script lang="ts">
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import type { PageData } from './$types';
	import Name from './name.svelte';
	import SvelteTable from 'svelte-table';
	import { superForm } from 'sveltekit-superforms/client';
	import { clickOutside } from '$lib/utils/click-outside';

	let modal = $state(false);
	let dateInput: any = $state();

	interface Props {
		data: PageData;
	}

	let { data = $bindable() }: Props = $props();

	let rows = $derived(data.tasks ?? []);
	let columns = $derived([
		{
			key: 'task',
			title: 'Task Description',
			value: (v: (typeof rows)[number]) => v.taskDescription || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'vendor',
			title: 'Vendor',
			value: (v: (typeof rows)[number]) => v.Vendor?.name || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'status',
			title: 'Status',
			value: (v: (typeof rows)[number]) => v.taskStatus || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'service',
			title: 'Service',
			value: (v: (typeof rows)[number]) => v.Vendor?.serviceType || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'dueDate',
			title: 'Due Date',
			value: (v: (typeof rows)[number]) => dayjs(v.dueDate).format('MMM DD, YYYY'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'createdBy',
			title: 'Created By',
			value: (v: (typeof rows)[number]) => 'John Doe',
			// v.CreatedBy?.User.userName + ` (${v.CreatedBy?.Role.name})` ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	]);
	const {
		form: addVendorTaskForm,
		enhance: addVendorTaskFormEnhance,
		constraints
	} = superForm(data.addTaskForm, {
		onUpdate: () => {
			modal = false;
		}
	});
</script>

<div class=" bg-white rounded-sm shadow-md border-[1px] border-black/20">
	<div class="sm:flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Tasks</p>
			<p class="bg-[#F9F5FF] text-xs rounded-xl p-2 h-fit">{data.tasks.length} Task</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_TASK')}
			<button class="bg-primary text-white rounded-md py-2 px-6" onclick={() => (modal = true)}>
				New Task</button
			>
		{/if}
	</div>

	<div class="bg-ghost/60 p-6 sm:flex justify-between">
		<button
			class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 mx-3 text-sm shadow-md bg-white"
		>
			<FiltersLines class="h-4 w-4" /> Add filters
		</button>
		<label class="grid">
			<input
				class=" sm:mt-0 mt-3 border-[1px] border-black/60 rounded-md p-2"
				type="search"
				id="search"
				name="search"
				placeholder="Search"
				onchange={async (e) => {
					const newSearchParams = new URLSearchParams(page.url.search);
					newSearchParams.set('searchTask', e.currentTarget.value);
					await goto(`?${newSearchParams.toString()}`);
				}}
			/>
		</label>
	</div>

	<SvelteTable classNameTable="rolesTable" {columns} {rows} />
</div>
{#if modal}
	<form
		use:addVendorTaskFormEnhance
		class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		method="post"
		action="?/addVendorTask"
	>
		<div
			use:clickOutside={() => (modal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid mx-12 gap-4 justify-items-stretch"
		>
			<div>
				<p class="text-xl font-semibold">New Vendor Task</p>
				<p class="text-sm text-subtitle pt-2">
					Create and Assign tasks to Vendors here. Click save when you're done.
				</p>
			</div>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Task Description <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorTaskForm.taskDescription}
					{...$constraints.taskDescription}
					name="taskDescription"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Payment Term <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorTaskForm.paymentTerm}
					{...$constraints.paymentTerm}
					name="paymentTerm"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Estimated Time <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorTaskForm.estimatedTime}
					{...$constraints.estimatedTime}
					name="estimatedTime"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="flex items-center gap-3">
				<input
					type="checkbox"
					name="regularJob"
					bind:checked={$addVendorTaskForm.regularJob}
					{...$constraints.regularJob}
					class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
				/>
				<span class="text-primary font-medium"> Continuous Job </span>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Due Date <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					type="date"
					class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
					bind:this={dateInput}
					onclick={() => {
						dateInput && dateInput.showPicker();
					}}
					required
					bind:value={$addVendorTaskForm.dueDate}
					{...$constraints.dueDate}
					name="dueDate"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Vendor <span class="text-xs font-light text-danger"> * Required </span></span
				>
				<select
					bind:value={$addVendorTaskForm.vendorId}
					{...$constraints.vendorId}
					name="vendorId"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				>
					{#each data.vendor as vendor}
						<option value={vendor.id}>{vendor.name}</option>
					{/each}
				</select>
			</label>

			<button
				onclick={(e) => {
					e.stopPropagation();
				}}
				class="bg-primary text-white rounded-md py-2"
			>
				Save Task
			</button>
		</div>
	</form>
{/if}
