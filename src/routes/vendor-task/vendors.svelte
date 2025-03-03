<script lang="ts">
	import { createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import type { PageData } from './$types';
	import Name from './name.svelte';
	import SvelteTable from 'svelte-table';
	import { superForm } from 'sveltekit-superforms/client';
	import { clickOutside } from '$lib/utils/click-outside';
	import { toast } from '@zerodevx/svelte-toast';

	let modal = $state(false);
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let rows = $derived(data.vendor ?? []);
	let columns = $derived([
		// {
		// 	key: 'Name',
		// 	title: '',
		// 	renderComponent: {
		// 		component: Name
		// 	},
		// 	headerClass:
		// 		'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
		// 	class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		// },
		{
			key: 'name',
			title: 'Name',
			value: (v: typeof rows[number]) => v.name || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'service',
			title: 'Service',
			value: (v: typeof rows[number]) => v.serviceType || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'phone',
			title: 'Phone number',
			value: (v: typeof rows[number]) => v.phoneNumber || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'email',
			title: 'Email address',
			value: (v: typeof rows[number]) => v.email || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'Score',
			title: 'Score',
			value: (v: typeof rows[number]) => v.score || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'Start_date',
			title: 'Contact start Date',
			value: (v: typeof rows[number]) => dayjs(v.createdAt).format('MMM DD, YYYY'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	]);
	const {
		form: addVendorForm,
		enhance: addVendorFormEnhance,
		constraints
	} = superForm(data.addVendorForm, {
		onUpdate: () => {
			modal = false;
		}
	});
</script>

<div class=" bg-white rounded-sm shadow-md border-[1px] border-black/20">
	<div class="sm:flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Vendors</p>
			<p class="bg-[#F9F5FF] text-xs rounded-xl p-2 h-fit">{data.vendor.length} Vendors</p>
		</div>
		{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_VENDOR')}
			<button class="bg-primary text-white rounded-md py-2 px-6" onclick={() => (modal = true)}>
				New Vendor</button
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
				class=" border-[1px] md:mt-0 mt-3 border-black/60 rounded-md p-2"
				type="search"
				id="search"
				name="search"
				placeholder="Search"
				onchange={async (e) => {
					const newSearchParams = new URLSearchParams($page.url.search);
					newSearchParams.set('searchVendor', e.currentTarget.value);
					await goto(`?${newSearchParams.toString()}`);
				}}
			/>
		</label>
	</div>
	<div class="overflow-x-auto">
		<SvelteTable
			classNameTable="rolesTable"
			{columns}
			{rows}
			on:clickCell={(event) => {
				const vendorId = event.detail.row.id;

				if (
					$page.data.session?.authUser.Employee.Role.Scopes.find(
						(s) => s.name === 'VIEW_VENDOR_DETAIL_PAGE'
					)
				) {
					goto(`/vendor-task/${vendorId}`);
				} else {
					toast.push('You do not have permission to view this page');
				}
			}}
		/>
	</div>
</div>
{#if modal}
	<form
		use:addVendorFormEnhance
		class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		method="post"
		action="?/addVendor"
	>
		<div
			use:clickOutside={() => (modal = false)}
			class="bg-white rounded-xl p-8 w-[480px] mx-12 grid gap-4 justify-items-stretch"
		>
			<div>
				<p class="text-xl font-semibold">New Vendor</p>
				<p class="text-sm text-subtitle pt-2">
					Register new tenants here. Click save when you're done.
				</p>
			</div>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Vendor Name <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorForm.name}
					{...$constraints.name}
					name="name"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Phone Number <span class="text-xs font-light text-danger"> * Required </span></span
				>
				<input
					bind:value={$addVendorForm.phoneNumber}
					{...$constraints.phoneNumber}
					name="phoneNumber"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium"> Email </span>
				<input
					bind:value={$addVendorForm.email}
					{...$constraints.email}
					name="email"
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					TIN Number <span class="text-xs font-light text-danger"> * Required </span></span
				>
				<input
					bind:value={$addVendorForm.tinNumber}
					{...$constraints.tinNumber}
					name="tinNumber"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Address <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorForm.address}
					{...$constraints.address}
					name="address"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Service Description <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addVendorForm.serviceDescription}
					{...$constraints.serviceDescription}
					name="serviceDescription"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Service Type <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<select
					bind:value={$addVendorForm.serviceType}
					{...$constraints.serviceType}
					name="serviceType"
					required
					class=" border-[1px] border-black/60 rounded-md p-2"
				>
					<option selected disabled> Select Type </option>
					<option value="CLEANING">Cleaning</option>
					<option value="ELECTRICITY">Electricity</option>
					<option value="PLUMBING">Pluming</option>
					<option value="PAINTING">Painting</option>
					<option value="SECURITY">Security</option>
				</select>
			</label>
			<label class="grid w-full gap-2">
				<span class="text-primary font-medium">
					Score <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					class=" border-[1px] border-black/60 rounded-md p-2"
					type="number"
					min="1"
					max="10"
					step="0.1"
					bind:value={$addVendorForm.score}
					{...$constraints.score}
					name="score"
					required
				/>
			</label>

			<button onclick={stopPropagation(bubble('click'))} class="bg-primary text-white rounded-md py-2">
				Save Vendor
			</button>
		</div>
	</form>
{/if}
