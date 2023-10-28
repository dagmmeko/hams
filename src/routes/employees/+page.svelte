<script lang="ts">
	import { clickOutside } from '$lib/utils/click-outside';
	import SvelteTable, { type TableColumn } from 'svelte-table';
	import Name from './name.svelte';
	import DeleteButton from './delete-button.svelte';
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	export let data;

	let modal = false;
	let dateInput: any;
	$: rows = data.employees;
	$: columns = [
		{
			key: 'name',
			title: 'Name',
			renderComponent: {
				component: Name,
				props: {
					data: data
				}
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'status',
			title: 'Status',
			value: (v: typeof rows[number]) => v.EmployeeStatus,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'role',
			title: 'Role',
			value: (v: typeof rows[number]) => v.Role.name,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'email',
			title: 'Email',
			value: (v: typeof rows[number]) => v.User.email,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'hiredOn',
			title: 'Hired Date',
			value: (v: typeof rows[number]) => dayjs(v.hiredDate).format('MMM DD, YYYY'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'second',
			title: '',
			renderComponent: {
				component: DeleteButton
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	];
</script>

<div class="mx-10 my-12 bg-white rounded-sm shadow-md border-[1px] border-black/20">
	<div class="flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Employees</p>
			<p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Employees</p>
		</div>
		<button class="bg-primary text-white rounded-md py-2 px-6" on:click={() => (modal = true)}>
			Add Employee</button
		>
	</div>
	<div class="bg-ghost/60 p-6 flex justify-between">
		<button
			class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white"
		>
			<FiltersLines class="h-4 w-4" /> Add filters
		</button>
		<label class="grid">
			<input placeholder="Search" class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
		</label>
	</div>
	<SvelteTable
		classNameTable="rolesTable"
		on:clickCell={(event) => {
			goto(`/employees/${event.detail.row.id}`);
		}}
		{columns}
		{rows}
	/>
</div>
{#if modal}
	<form method="post" action="?/addEmployee">
		<div
			class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		>
			<div
				use:clickOutside={() => (modal = false)}
				class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
			>
				<div>
					<p class="text-xl font-semibold">New Employee</p>
					<p class="text-sm text-subtitle pt-2">
						Register new employee here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="text-primary font-medium"> Full Name </span>
					<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Phone Number </span>
					<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Email </span>
					<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
				</label>
				<label>
					<span class="text-primary font-medium"> Role </span>
					<select class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2">
						<option selected disabled> Pick a role </option>
						<option> Manager </option>
						<option> Finance </option>
						<option> Reception </option>
					</select>
				</label>
				<label>
					<span class="text-primary font-medium"> Manager </span>
					<select class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2">
						<option selected disabled> Select Manager </option>
						<option> Thomas John </option>
						<option> Belay Kilo </option>
						<option> Bruh Sew </option>
					</select>
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
					/>
				</label>
				<button class="bg-primary text-white rounded-md py-2"> Save Employee</button>
			</div>
		</div>
	</form>
{/if}
