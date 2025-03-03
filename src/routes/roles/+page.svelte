<script lang="ts">
	import { goto } from '$app/navigation'
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte'
	import SvelteTable, { type TableColumn } from 'svelte-table'
	import dayjs from 'dayjs'
	import { page } from '$app/state'
	import DeleteRoleTableComponent from './delete-role-table-component.svelte'
	import { toast } from '@zerodevx/svelte-toast'

	let dateInput: any
	let hasDeleteRoleScope = true

	let { form, data } = $props()
	let rows = $derived(data.roles)
	let columns = $derived([
		{
			key: 'title',
			title: 'Role',
			value: (v: (typeof rows)[number]) => v?.name ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60 w-1/3 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'noOfEmployees',
			title: 'No. of Employees',
			value: (v: (typeof rows)[number]) => v?.Employees.length ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'createdAt',
			title: 'Created At',
			value: (v: (typeof rows)[number]) => dayjs(v?.createdAt).format('MMM DD, YYYY') ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		hasDeleteRoleScope
			? {
					key: 'delete',
					title: '',
					renderComponent: {
						component: DeleteRoleTableComponent,
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
	$effect.pre(() => {
		form?.deleteRoleForm ? toast.push('Role deleted successfully') : null
	})
</script>

<div>
	<div class="mx-5 my-12 rounded-sm border-[1px] border-black/20 bg-white shadow-lg md:mx-10">
		<div class="justify-between p-6 sm:flex">
			<div class="flex items-center space-x-4">
				<p class="text-xl font-medium">Roles</p>
				<p class="rounded-xl bg-[#F9F5FF] px-3 py-2 text-xs font-medium">
					{data.roles.length} Roles
				</p>
			</div>
			{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_ROLE')}
				<a href="/roles/add-role" class="rounded-md bg-primary px-6 py-2 text-sm text-white">
					New Role</a
				>
			{/if}
		</div>
		<div class="flex justify-between border-b-2 border-ghost bg-ghost/60 p-6">
			<!-- <button
				on:click|stopPropagation
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
		<SvelteTable
			classNameTable="rolesTable"
			on:clickCell={(event) => {
				const roleId = event.detail.row.id
				if (
					page.data.session?.authUser.Employee.Role.Scopes.find(
						(s) => s.name === 'VIEW_ROLE_DETAIL_PAGE',
					)
				) {
					goto(`/roles/${roleId}`)
				} else {
					toast.push('You do not have permission to delete a role')
				}
			}}
			{columns}
			{rows}
		/>
	</div>
</div>
