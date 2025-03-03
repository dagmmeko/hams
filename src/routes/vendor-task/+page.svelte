<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast'
	import Vendors from './vendors.svelte'
	import Task from './task.svelte'
	import { page } from '$app/state'

	let { data = $bindable(), form } = $props()

	$effect.pre(() => {
		form?.addVendorForm ? toast.push('Vendor added successfully') : null
	})

	let displayedComponent: 'vendor' | 'task' | 'pending' = $state('vendor')
</script>

<div class="mx-10 my-5">
	<p class="mb-5 text-xs text-black/50">Vendor</p>

	<div class="mb-6 flex w-fit rounded-md bg-ghost p-2 shadow-sm">
		<button onclick={() => (displayedComponent = 'vendor')}>
			<p class="rounded-md px-3 py-2 {displayedComponent === 'vendor' ? 'bg-white' : ''} ">
				Vendor
			</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_TASK_PAGE')}
			<button onclick={() => (displayedComponent = 'task')}
				><p class="rounded-md p-2 px-3 {displayedComponent === 'task' ? 'bg-white' : ''}">
					Task
				</p></button
			>
		{/if}
	</div>
	{#if displayedComponent === 'vendor'}
		<Vendors bind:data />
	{:else if displayedComponent === 'task' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_TASK_PAGE')}
		<Task bind:data />
	{:else if displayedComponent === 'pending'}
		<!-- <Amenities bind:data /> --> Pending
	{:else}
		<p>Something went wrong</p>
	{/if}
</div>
