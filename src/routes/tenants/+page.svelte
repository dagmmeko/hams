<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { toast } from '@zerodevx/svelte-toast'
	import SvelteTable from 'svelte-table'
	import Name from './name.svelte'
	import PendingTenants from './pending-tenants.svelte'
	import Status from './status.svelte'

	let { data = $bindable() } = $props()

	let displayTenant: 'Tenant' | 'Pending' = $state('Tenant')

	let rows = $derived(data.fullDataTenant || [])
	let columns = $derived([
		{
			key: 'tenant',
			title: 'Tenant',
			renderComponent: {
				component: Name,
			},
			headerClass:
				'text-left pl-3 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-3 h-12 relative border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'phoneNumber',
			title: 'Phone Number',
			value: (v: (typeof rows)[number]) => v.tenant.phoneNumber ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'email',
			title: 'Email',
			value: (v: (typeof rows)[number]) => v.tenant.email ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'tenant',
			title: 'Tenant',
			renderComponent: {
				component: Status,
			},
			headerClass:
				'text-left pl-3 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left h-12 relative border-b-[1px] border-[#B3B4B8]',
		},
	])
</script>

<div class="mx-5 my-12 md:mx-10">
	<div class="mb-6 flex w-fit rounded-md bg-ghost p-2 shadow-sm">
		<button
			onclick={() => {
				displayTenant = 'Tenant'
			}}
		>
			<p class="rounded-md px-3 py-2 {displayTenant === 'Tenant' ? 'bg-white' : ''} ">Tenant</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_PENDING_TENANTS')}
			<button onclick={() => (displayTenant = 'Pending')}>
				<p class="rounded-md p-2 px-3 {displayTenant === 'Pending' ? 'bg-white' : ''}">Pending</p>
			</button>
		{/if}
	</div>
	{#if displayTenant === 'Tenant'}
		<div class=" mt-3 rounded-md border-[1px] border-black/20 bg-white shadow-md">
			<div class="justify-between p-6 md:flex">
				<div class="flex space-x-4">
					<p class="text-lg">Tenants</p>
					<p class="h-fit rounded-xl bg-[#F9F5FF] p-2 text-xs">{data.tenants?.length} Tenants</p>
				</div>
				<div class="grid sm:block">
					{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_NEW_RENT')}
						<a
							href="/tenants/rent-room"
							class="my-3 mr-2 w-40 rounded-md border-[1px] border-primary px-6 py-2 text-primary shadow-sm md:my-0"
						>
							Rent Room
						</a>
					{/if}
					{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_NEW_TENANT')}
						<a
							href="/tenants/add-tenant"
							class="w-40 rounded-md bg-primary px-6 py-2 text-white shadow-sm"
						>
							New Tenant</a
						>
					{/if}
				</div>
			</div>
			<div class="bg-ghost/60 p-6">
				<label class="grid">
					<input
						placeholder="Search"
						class="mt-3 h-fit w-full max-w-[420px] rounded-md border-[1px] border-black/60 p-2 md:mt-0"
						type="search"
						id="search"
						name="search"
						onchange={async (e) => {
							const newSearchParams = new URLSearchParams(page.url.search)
							newSearchParams.set('searchTenant', e.currentTarget.value)
							await goto(`?${newSearchParams.toString()}`)
						}}
					/>
				</label>
			</div>
			<div class="overflow-x-auto">
				<SvelteTable
					on:clickCell={(event) => {
						const tenantId = event.detail.row.tenant.id
						if (
							page.data.session?.authUser.Employee.Role.Scopes.find(
								(s) => s.name === 'VIEW_TENANT_DETAIL_PAGE',
							)
						) {
							goto(`/tenants/${tenantId}`)
						} else {
							toast.push('You do not have permission to view tenant')
						}
					}}
					{columns}
					{rows}
				/>
			</div>
		</div>
	{:else if displayTenant === 'Pending' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_PENDING_TENANTS')}
		<PendingTenants bind:data />
	{/if}
</div>
