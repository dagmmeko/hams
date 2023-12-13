<script lang="ts">
	
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';

	import SvelteTable from 'svelte-table';
	import { superForm } from 'sveltekit-superforms/client';
	import { clickOutside } from '$lib/utils/click-outside';

	let modal = false;
	export let data;

	$: rows = data.payments ?? [];
	$: columns = [
		{
			key: 'Lable',
			title: 'Label',
			value: (v: typeof rows[number]) => v.VendorTask?.taskDescription || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'Amount',
			title: 'Amount',
			value: (v: typeof rows[number]) => v.amount || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'via Bank',
			title: 'Via Bank',
			value: (v: typeof rows[number]) => v.despositedToBank || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'Ref ID',
			title: 'Ref ID',
			value: (v: typeof rows[number])=>v.vendorTaskId ||'',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'Pay Date',
			title: 'Pay Date',
			value: (v: typeof rows[number]) => dayjs(v.paidOn).format('MMM DD, YYYY'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
	
	];
	

	const {
		form: addPaymentForm,
		enhance: addPaymentFormEnhance,
		constraints
	} = superForm(data.addPaymentForm, {
		onUpdate: () => {
			modal = false;
		}
	});


</script>

<div class=" bg-white rounded-sm shadow-md border-[1px] border-black/20">
	<div class="flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Payments</p>
			<p class="bg-[#F9F5FF] text-xs rounded-xl p-2">10 transactions</p>
		</div>
		<button class="bg-primary text-white rounded-md py-2 px-6" on:click={() => (modal = true)}>
			New Payment</button
		>
	</div>

	<SvelteTable
		classNameTable="rolesTable"
		{columns}
		{rows}
		on:clickCell={(event) => {
			const vendorId = event.detail.row.id;
			const PaymentId = event.detail.row.id;
			goto(`/vendor-task/${vendorId}/${PaymentId}`);
		}}
	/>
</div>

{#if modal}
	<form
		use:addPaymentFormEnhance
		class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		method="post"
		action="?/addPayment"
	>
		<div
			use:clickOutside={() => (modal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
		>
			<div>
				<p class="text-xl font-semibold">New Payment</p>
				<p class="text-sm text-subtitle pt-2">
					Record New payment here. Click save when your done
				</p>
			</div>
			<label class="grid">
				<span class="text-primary font-medium"> Label </span>
				<input
					bind:value={$addPaymentForm.label}
					name="Label"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Amount</span>
				<input
					bind:value={$addPaymentForm.amount}
					name="phoneNumber"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<!--
			<label class="grid">
				<span class="text-primary font-medium"> Ref ID</span>
				<input
					bind:value={$addPaymentForm.vendorTaskId}
					{...$constraints.email}
					name="email"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
	
			<label class="grid">
				<span class="text-primary font-medium"> Deposit account</span>
				<input
					bind:value={$addPaymentForm.AAAA}
					name="address"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>

				-->
				
			<label class="grid">
				<span class="text-primary font-medium"> Via Bank</span>
				<input
					bind:value={$addPaymentForm.despositedToBank}
					name="serviceDescription"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			
			
			<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2">
				Save Payment
			</button>
		</div>
	</form>
{/if}

