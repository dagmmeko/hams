<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import dayjs from 'dayjs'

	import SvelteTable from 'svelte-table'
	import { superForm } from 'sveltekit-superforms/client'
	import { clickOutside } from '$lib/utils/click-outside'
	import type { PageData } from './$types'
	import PdfPrint from '$lib/components/pdf-print.svelte'
	import { toast } from '@zerodevx/svelte-toast'
	let dateInput: any = $state()

	let modal = $state(false)
	interface Props {
		data: PageData
	}

	let { data = $bindable() }: Props = $props()

	let rows = $derived(data.payments ?? [])
	let columns = $derived([
		{
			key: 'Lable',
			title: 'Label',
			value: (v: (typeof rows)[number]) => v.VendorTask?.taskDescription || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'Amount',
			title: 'Amount',
			value: (v: (typeof rows)[number]) => v.amount || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'via Bank',
			title: 'Via Bank',
			value: (v: (typeof rows)[number]) => v.depositedToBank || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'Ref ID',
			title: 'Ref ID',
			value: (v: (typeof rows)[number]) => v.vendorTaskId || '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'Pay Date',
			title: 'Pay Date',
			value: (v: (typeof rows)[number]) => dayjs(v.paidOn).format('MMM DD, YYYY'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
	])

	const {
		form: addPaymentForm,
		enhance: addPaymentFormEnhance,
		constraints,
	} = superForm(data.addPaymentForm, {
		onSubmit: ({ formData }) => {
			const selectedTask = data.vendor.VendorTask.find((task) => task.id === $addPaymentForm.taskId)
		},
		onUpdate: () => {
			modal = false
		},
	})
</script>

<div class=" rounded-sm border-[1px] border-black/20 bg-white shadow-md">
	<div class="justify-between p-6 md:flex">
		<div class="flex space-x-4">
			<p class="text-lg">Payments</p>
			<p class="h-fit rounded-xl bg-[#F9F5FF] p-2 text-xs">{data.payments.length} transactions</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_PAYMENT')}
			<button class="rounded-md bg-primary px-6 py-2 text-white" onclick={() => (modal = true)}>
				New Payment</button
			>
		{/if}
	</div>
	<PdfPrint class="ml-6">
		<div class="hidden print:block">Name: {data.vendor.name}</div>
		<div class="hidden print:block">Phone: {data.vendor.phoneNumber}</div>
		<div class="hidden print:block">Service: {data.vendor.serviceType}</div>
		<div class="hidden print:block">TIN: {data.vendor.tinNumber}</div>
		<div class="overflow-x-auto">
			<SvelteTable
				classNameTable="rolesTable"
				{columns}
				{rows}
				on:clickCell={(event) => {
					const PaymentId = event.detail.row.id
					if (
						page.data.session?.authUser.Employee.Role.Scopes.find(
							(s) => s.name === 'VIEW_PAYMENT_DETAIL',
						)
					) {
						goto(`/vendor-task/${page.params.vendorId}/${PaymentId}`)
					} else {
						toast.push('You do not have permission to view payment details')
					}
				}}
			/>
		</div>
	</PdfPrint>
</div>

{#if modal}
	<form
		use:addPaymentFormEnhance
		class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		method="post"
		action="?/addPayment"
	>
		<div
			use:clickOutside={() => (modal = false)}
			class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
		>
			<div>
				<p class="text-xl font-semibold">New Payment</p>
				<p class="pt-2 text-sm text-subtitle">Record New payment here. Click save when your done</p>
			</div>

			<label>
				<span class="font-medium text-primary">
					Select Task To Pay For <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<select
					bind:value={$addPaymentForm.taskId}
					name="taskId"
					required
					class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
				>
					<option selected disabled>Select Task</option>
					{#each data.vendor.VendorTask as task}
						{#if task.taskStatus !== 'COMPLETED' && task.paymentStatus === false}
							<option value={task.id}>{task.taskDescription}</option>
						{/if}
					{/each}
				</select>
			</label>
			{#if data.vendor.VendorTask.find((task) => task.id === $addPaymentForm.taskId)}
				<div class="grid gap-1 rounded-md border-[1px] border-danger p-2">
					<span class="font-medium text-primary"> Payment Terms </span>
					<span>
						{data.vendor.VendorTask.find((task) => task.id === $addPaymentForm.taskId)
							?.paymentTerms}
					</span>
				</div>
			{/if}

			<label class="grid">
				<span class="font-medium text-primary">
					Paid amount <span class="text-xs font-light text-danger"> * Required </span>
				</span>
				<input
					bind:value={$addPaymentForm.amount}
					name="amount"
					required
					class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
				/>
			</label>

			<label class="grid">
				<span class="font-medium text-primary">
					Via Bank <span class="text-xs font-light text-danger"> * Required </span></span
				>
				<input
					bind:value={$addPaymentForm.depositedToBank}
					name="depositedToBank"
					required
					class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
				/>
			</label>
			<label class="grid">
				<span class="font-medium text-primary">
					Paid on <span class="text-xs font-light text-danger"> * Required </span></span
				>
				<input
					type="date"
					name="paidOn"
					class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					bind:this={dateInput}
					onclick={() => {
						dateInput && dateInput.showPicker()
					}}
					bind:value={$addPaymentForm.paidOn}
					{...$constraints.paidOn}
				/>
			</label>

			<button
				onclick={(e) => {
					e.stopPropagation()
				}}
				class="rounded-md bg-primary py-2 text-white"
			>
				Save Payment
			</button>
		</div>
	</form>
{/if}
