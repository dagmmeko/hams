<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';

	import SvelteTable from 'svelte-table';
	import { superForm } from 'sveltekit-superforms/client';
	import { clickOutside } from '$lib/utils/click-outside';
	import type { PageData } from './$types';
	import PdfPrint from '$lib/components/pdf-print.svelte';
	let dateInput: any;

	let modal = false;
	export let data: PageData;

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
			value: (v: typeof rows[number]) => v.vendorTaskId || '',
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
		}
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
	<PdfPrint class="ml-6">
		<div class="print:block hidden">Name: {data.vendor.name}</div>
		<div class="print:block hidden">Phone: {data.vendor.phoneNumber}</div>
		<div class="print:block hidden">Service: {data.vendor.serviceType}</div>
		<div class="print:block hidden">TIN: {data.vendor.tinNumber}</div>

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
	</PdfPrint>
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
				<p class="text-sm text-subtitle pt-2">Record New payment here. Click save when your done</p>
			</div>

			<select
				bind:value={$addPaymentForm.taskId}
				name="taskId"
				required
				class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
			>
				<option selected disabled>Select Task</option>
				{#each data.vendor.VendorTask as task}
					{#if task.taskStatus !== 'COMPLETED' && task.paymentStatus === false}
						<option value={task.id}>{task.taskDescription}</option>
					{/if}
				{/each}
			</select>
			{#if data.vendor.VendorTask.find((task) => task.id === $addPaymentForm.taskId)}
				{data.vendor.VendorTask.find((task) => task.id === $addPaymentForm.taskId)?.paymentTerms}
			{/if}

			<label class="grid">
				<span class="text-primary font-medium"> Amount</span>
				<input
					bind:value={$addPaymentForm.amount}
					name="amount"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>

			<label class="grid">
				<span class="text-primary font-medium"> Via Bank</span>
				<input
					bind:value={$addPaymentForm.depositedToBank}
					name="depositedToBank"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Paid on </span>
				<input
					type="date"
					name="paidOn"
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
					bind:this={dateInput}
					on:click={() => {
						dateInput && dateInput.showPicker();
					}}
					bind:value={$addPaymentForm.paidOn}
					{...$constraints.paidOn}
				/>
			</label>

			<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2">
				Save Payment
			</button>
		</div>
	</form>
{/if}
