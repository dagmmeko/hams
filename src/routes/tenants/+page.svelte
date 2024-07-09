<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
	import SvelteTable from 'svelte-table';
	import Name from './name.svelte';
	import PendingTenants from './pending-tenants.svelte';
	import Status from './status.svelte';

	export let data;

	let displayTenant: 'Tenant' | 'Pending' = 'Tenant';

	$: rows = data.fullDataTenant || [];
	$: columns = [
		{
			key: 'tenant',
			title: 'Tenant',
			renderComponent: {
				component: Name
			},
			headerClass:
				'text-left pl-3 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-3 h-12 relative border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'phoneNumber',
			title: 'Phone Number',
			value: (v: typeof rows[number]) => v.tenant.phoneNumber ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'email',
			title: 'Email',
			value: (v: typeof rows[number]) => v.tenant.email ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'tenant',
			title: 'Tenant',
			renderComponent: {
				component: Status
			},
			headerClass:
				'text-left pl-3 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left h-12 relative border-b-[1px] border-[#B3B4B8]'
		}
	];
</script>

<div class="md:mx-10 mx-5 my-12">
	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button
			on:click={() => {
				displayTenant = 'Tenant';
			}}
		>
			<p class="py-2 px-3 rounded-md {displayTenant === 'Tenant' ? 'bg-white' : ''} ">Tenant</p>
		</button>
		{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_PENDING_TENANTS')}
			<button on:click={() => (displayTenant = 'Pending')}>
				<p class="p-2 px-3 rounded-md {displayTenant === 'Pending' ? 'bg-white' : ''}">Pending</p>
			</button>
		{/if}
	</div>
	{#if displayTenant === 'Tenant'}
		<div class=" bg-white rounded-md shadow-md border-[1px] border-black/20 mt-3">
			<div class="md:flex justify-between p-6">
				<div class="flex space-x-4">
					<p class="text-lg">Tenants</p>
					<p class="bg-[#F9F5FF] h-fit text-xs rounded-xl p-2">{data.tenants?.length} Tenants</p>
				</div>
				<div class="sm:block grid">
					{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_NEW_RENT')}
						<a
							href="/tenants/rent-room"
							class="border-[1px] border-primary md:my-0 my-3 w-40 text-primary shadow-sm mr-2 rounded-md py-2 px-6"
						>
							Rent Room
						</a>
					{/if}
					{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_NEW_TENANT')}
						<a
							href="/tenants/add-tenant"
							class="bg-primary text-white w-40 shadow-sm rounded-md py-2 px-6"
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
						class="border-[1px] w-full max-w-[420px] border-black/60 h-fit rounded-md p-2 md:mt-0 mt-3"
						type="search"
						id="search"
						name="search"
						on:change={async (e) => {
							const newSearchParams = new URLSearchParams($page.url.search);
							newSearchParams.set('searchTenant', e.currentTarget.value);
							await goto(`?${newSearchParams.toString()}`);
						}}
					/>
				</label>
			</div>
			<div class="overflow-x-auto">
				<SvelteTable
					on:clickCell={(event) => {
						const tenantId = event.detail.row.tenant.id;
						if (
							$page.data.session?.authUser.Employee.Role.Scopes.find(
								(s) => s.name === 'VIEW_TENANT_DETAIL_PAGE'
							)
						) {
							goto(`/tenants/${tenantId}`);
						} else {
							toast.push('You do not have permission to view tenant');
						}
					}}
					{columns}
					{rows}
				/>
			</div>
		</div>
	{:else if displayTenant === 'Pending' && $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_PENDING_TENANTS')}
		<PendingTenants bind:data />
	{/if}
</div>
