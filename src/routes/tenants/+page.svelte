<script lang="ts">
	import { goto } from '$app/navigation';
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import { page } from '$app/stores';
	import SvelteTable from 'svelte-table';
	import Name from './name.svelte';
	import PendingTenants from './pending-tenants.svelte';
	import dayjs from 'dayjs';

	export let data;

	let displayTenant: 'Tenant' | 'Pending' = 'Tenant';

	$: rows = data.tenants || [];
	$: columns = [
		{
			key: 'tenant',
			title: 'Tenant',
			renderComponent: {
				component: Name
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'phoneNumber',
			title: 'Phone Number',
			value: (v: typeof rows[number]) => v.phoneNumber ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'email',
			title: 'Email',
			value: (v: typeof rows[number]) => v.email ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'activeRoom',
			title: 'Active room',
			value: (v: typeof rows[number]) =>
				v.active
					? 'Room: ' + v.TenantRental[0].RentalUnits.roomNumber
					: 'Not Booked' ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'contractEndDate',
			title: 'Contract End',
			value: (v: typeof rows[number]) =>
				v.TenantRental[0]?.contractEndDate
					? dayjs(v.TenantRental[0]?.contractEndDate).format('MMM DD, YYYY')
					: '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	];
</script>

<div class="mx-10 my-12">
	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button
			on:click={() => {
				displayTenant = 'Tenant';
				console.log({ displayTenant });
			}}
		>
			<p class="py-2 px-3 rounded-md {displayTenant === 'Tenant' ? 'bg-white' : ''} ">Tenant</p>
		</button>
		<button on:click={() => (displayTenant = 'Pending')}>
			<p class="p-2 px-3 rounded-md {displayTenant === 'Pending' ? 'bg-white' : ''}">Pending</p>
		</button>
	</div>
	{#if displayTenant === 'Tenant'}
		<div class=" bg-white rounded-md shadow-md border-[1px] border-black/20 mt-3">
			<div class="flex justify-between p-6">
				<div class="flex space-x-4">
					<p class="text-lg">Tenants</p>
					<p class="bg-[#F9F5FF] h-fit text-xs rounded-xl p-2">{data.tenants?.length} Tenants</p>
				</div>
				<div>
					<a
						href="/tenants/rent-room"
						class="border-[1px] border-primary text-primary shadow-sm mr-2 rounded-md py-2 px-6"
					>
						Rent Room
					</a>
					<a
						href="/tenants/add-tenant"
						class="bg-primary text-white shadow-sm rounded-md py-2 px-6"
					>
						New Tenant</a
					>
				</div>
			</div>
			<div class="bg-ghost/60 p-6 flex justify-between">
				<button
					class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white"
				>
					<FiltersLines class="h-4 w-4" /> Add filters
				</button>
				<label class="grid">
					<input
						placeholder="Search"
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
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
			<SvelteTable {columns} {rows} />
		</div>
	{:else if displayTenant === 'Pending'}
		<PendingTenants bind:data />
	{/if}
</div>
