<script lang="ts">
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import dayjs from 'dayjs'
	import type { PageData } from './$types'
	import Name from './name.svelte'
	import SvelteTable from 'svelte-table'
	import { superForm } from 'sveltekit-superforms/client'
	import { clickOutside } from '$lib/utils/click-outside'

	let modal = $state(false)
	let dateInput: any = $state()

	interface Props {
		data: PageData
	}

	let { data = $bindable() }: Props = $props()

	let rows = $derived(data.tasks ?? [])
	let columns = $derived([
		{
			key: 'task',
			title: 'Task Description',
			value: (v: (typeof rows)[number]) => v.taskDescription || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'vendor',
			title: 'Vendor',
			value: (v: (typeof rows)[number]) => v.Vendor?.name || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'status',
			title: 'Status',
			value: (v: (typeof rows)[number]) => v.taskStatus || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'service',
			title: 'Service',
			value: (v: (typeof rows)[number]) => v.Vendor?.serviceType || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'dueDate',
			title: 'Due Date',
			value: (v: (typeof rows)[number]) => dayjs(v.dueDate).format('MMM DD, YYYY'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'createdBy',
			title: 'Created By',
			value: (v: (typeof rows)[number]) => 'John Doe',
			// v.CreatedBy?.User.userName + ` (${v.CreatedBy?.Role.name})` ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
	])
	const {
		form: addVendorTaskForm,
		enhance: addVendorTaskFormEnhance,
		constraints,
	} = superForm(data.addTaskForm, {
		onUpdate: () => {
			modal = false
		},
	})
</script>

<div class=" rounded-sm border-[1px] border-black/20 bg-white shadow-md">
	<div class="justify-between p-6 sm:flex">
		<div class="flex space-x-4">
			<p class="text-lg">Tasks</p>
			<p class="h-fit rounded-xl bg-[#F9F5FF] p-2 text-xs">{data.tasks.length} Task</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_TASK')}
			<button class="rounded-md bg-primary px-6 py-2 text-white" onclick={() => (modal = true)}>
				New Task</button
			>
		{/if}
	</div>

	<div class="justify-between bg-ghost/60 p-6 sm:flex">
		<button
			class="mx-3 grid grid-flow-col items-center gap-2 rounded-md bg-white px-4 py-2 text-sm shadow-md"
		>
			<FiltersLines class="h-4 w-4" /> Add filters
		</button>
		<label class="grid">
			<input
				class=" mt-3 rounded-md border-[1px] border-black/60 p-2 sm:mt-0"
				type="search"
				id="search"
				name="search"
				placeholder="Search"
				onchange={async (e) => {
					const newSearchParams = new URLSearchParams(page.url.search)
					newSearchParams.set('searchTask', e.currentTarget.value)
					await goto(`?${newSearchParams.toString()}`)
				}}
			/>
		</label>
	</div>

	<SvelteTable classNameTable="rolesTable" {columns} {rows} />
</div>
{#if modal}
	<form
		use:addVendorTaskFormEnhance
		class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		method="post"
		action="?/addVendorTask"
	>
		<div
			use:clickOutside={() => (modal = false)}
			class="mx-12 grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
		>
			<div>
				<p class="text-xl font-semibold">New Vendor Task</p>
				<p class="pt-2 text-sm text-subtitle">
					Create and Assign tasks to Vendors here. Click save when you're done.
				</p>
			</div>
			<label class="grid w-full gap-2">
				<span class="font-medium text-primary">
					Task Description <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorTaskForm.taskDescription}
					{...$constraints.taskDescription}
					name="taskDescription"
					required
					class=" rounded-md border-[1px] border-black/60 p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="font-medium text-primary">
					Payment Term <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorTaskForm.paymentTerm}
					{...$constraints.paymentTerm}
					name="paymentTerm"
					required
					class=" rounded-md border-[1px] border-black/60 p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="font-medium text-primary">
					Estimated Time <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorTaskForm.estimatedTime}
					{...$constraints.estimatedTime}
					name="estimatedTime"
					required
					class=" rounded-md border-[1px] border-black/60 p-2"
				/>
			</label>
			<label class="flex items-center gap-3">
				<input
					type="checkbox"
					name="regularJob"
					bind:checked={$addVendorTaskForm.regularJob}
					{...$constraints.regularJob}
					class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
				/>
				<span class="font-medium text-primary"> Continuous Job </span>
			</label>
			<label class="grid w-full gap-2">
				<span class="font-medium text-primary">
					Due Date <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					type="date"
					class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
					bind:this={dateInput}
					onclick={() => {
						dateInput && dateInput.showPicker()
					}}
					required
					bind:value={$addVendorTaskForm.dueDate}
					{...$constraints.dueDate}
					name="dueDate"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="font-medium text-primary">
					Vendor <span class="text-xs font-light text-danger"> * Required </span></span
				>
				<select
					bind:value={$addVendorTaskForm.vendorId}
					{...$constraints.vendorId}
					name="vendorId"
					required
					class=" rounded-md border-[1px] border-black/60 p-2"
				>
					{#each data.vendor as vendor}
						<option value={vendor.id}>{vendor.name}</option>
					{/each}
				</select>
			</label>

			<button
				onclick={(e) => {
					e.stopPropagation()
				}}
				class="rounded-md bg-primary py-2 text-white"
			>
				Save Task
			</button>
		</div>
	</form>
{/if}
