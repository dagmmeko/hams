<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { clickOutside } from '$lib/utils/click-outside'
	import dayjs from 'dayjs'
	import SvelteTable from 'svelte-table'
	import { superForm } from 'sveltekit-superforms/client'
	import Name from './name.svelte'
	import StatusComponent from './status-component.svelte'
	import { toast } from '@zerodevx/svelte-toast'

	let { data } = $props()

	let modal = $state(false)

	const {
		form: addEmployeeForm,
		enhance: addEmployeeFormEnhance,
		constraints,
	} = superForm(data.addEmployeeForm, {
		onUpdate: () => {
			modal = false
		},
	})

	let dateInput: any = $state()
	let rows = $derived(data.employees)
	let columns = $derived([
		{
			key: 'name',
			title: 'Name',
			renderComponent: {
				component: Name,
				props: {
					data: data,
				},
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'status',
			title: 'Employment Type',
			renderComponent: {
				component: StatusComponent,
				props: {
					data: data,
				},
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'role',
			title: 'Role',
			value: (v: (typeof rows)[number]) => v.Role.name,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'email',
			title: 'Email',
			value: (v: (typeof rows)[number]) => v.User.email,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'jobTitle',
			title: 'Job Title',
			value: (v: (typeof rows)[number]) => v.jobTitle,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'hiredOn',
			title: 'Hired Date',
			value: (v: (typeof rows)[number]) => dayjs(v.hiredDate).format('MMM DD, YYYY'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
	])
</script>

<div class="mx-10 my-12 rounded-sm border-[1px] border-black/20 bg-white shadow-md">
	<div class="justify-between p-6 sm:flex">
		<div class="flex h-fit items-center space-x-4">
			<p class="text-lg">Employees</p>
			<p class="rounded-xl bg-[#F9F5FF] px-2 py-1 text-xs">{data.employees.length} Employees</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_EMPLOYEE')}
			<button
				class="mt-3 rounded-md bg-primary px-6 py-2 text-white md:mt-0"
				onclick={() => (modal = true)}
			>
				Add Employee
			</button>
		{/if}
	</div>
	<div class="flex justify-between bg-ghost/60 p-6">
		<!-- <button
			class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white"
		>
			<FiltersLines class="h-4 w-4" /> Add filters
		</button> -->
		<label class="grid">
			<input
				class=" rounded-md border-[1px] border-black/60 p-2"
				type="search"
				id="search"
				name="search"
				placeholder="Search"
				onchange={async (e) => {
					const newSearchParams = new URLSearchParams(page.url.search)
					newSearchParams.set('search', e.currentTarget.value)
					await goto(`?${newSearchParams.toString()}`)
				}}
			/>
		</label>
	</div>
	<div class="overflow-x-auto lg:overflow-x-hidden">
		<SvelteTable
			classNameTable="rolesTable"
			on:clickCell={(event) => {
				if (
					page.data.session?.authUser.Employee.Role.Scopes.find(
						(s) => s.name === 'VIEW_EMPLOYEE_DETAIL_PAGE',
					)
				) {
					goto(`/employees/${event.detail.row.id}`)
				} else {
					toast.push('You do not have permission to view employee details')
				}
			}}
			{columns}
			{rows}
		/>
	</div>
</div>
{#if modal}
	<form use:addEmployeeFormEnhance method="post" action="?/addEmployee">
		<div
			class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		>
			<div
				use:clickOutside={() => (modal = false)}
				class="mx-12 grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
			>
				<div>
					<p class="text-xl font-semibold">New Employee</p>
					<p class="pt-2 text-sm text-subtitle">
						Register new employee here. Click save when you're done.
					</p>
				</div>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary">
						Full Name <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						required
						bind:value={$addEmployeeForm.userName}
						{...$constraints.userName}
						name="userName"
						class="mt-2 rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary">
						Phone Number <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						required
						bind:value={$addEmployeeForm.phoneNumber}
						{...$constraints.phoneNumber}
						name="phoneNumber"
						class="mt-2 rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary">
						Email <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						required
						bind:value={$addEmployeeForm.email}
						{...$constraints.email}
						name="email"
						class="mt-2 rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Address </span>
					<input
						required
						bind:value={$addEmployeeForm.address}
						{...$constraints.address}
						name="address"
						class="mt-2 rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary">
						Role <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<select
						required
						bind:value={$addEmployeeForm.roleId}
						{...$constraints.roleId}
						name="roleId"
						class="mt-2 rounded-md border-[1px] border-black/60 p-2"
					>
						<option selected disabled value=""> Select Role </option>
						{#each data.roles as role}
							<option value={role.id}> {role.name} </option>
						{/each}
					</select>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Supervisor </span>
					<select
						required
						bind:value={$addEmployeeForm.managerId}
						{...$constraints.managerId}
						name="managerId"
						class="mt-2 rounded-md border-[1px] border-black/60 p-2"
					>
						<option selected disabled> Select Manager </option>
						{#each data.employees as employee}
							<option value={employee.User.id}> {employee.User.userName} </option>
						{/each}
					</select>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Start Date </span>
					<input
						type="date"
						name="hiredDate"
						class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput}
						onclick={() => {
							dateInput && dateInput.showPicker()
						}}
						bind:value={$addEmployeeForm.hiredDate}
						{...$constraints.hiredDate}
					/>
				</label>
				<button class="rounded-md bg-primary py-2 text-white"> Save Employee</button>
			</div>
		</div>
	</form>
{/if}
