<script lang="ts">
	import Attendance from './attendance.svelte'
	import Info from './info.svelte'
	import Leaves from './leaves.svelte'
	import { page } from '$app/state'

	let { data = $bindable(), form = $bindable() } = $props()

	let displayedComponent: 'info' | 'attendance' | 'leaves' = $state('info')
</script>

<div class="mx-5 my-12 md:mx-10">
	<p class="mb-5 text-sm">Employee / {data.employee?.User.userName}</p>

	<!-- Navigation -->
	<div class="mb-6 flex w-fit rounded-md bg-ghost p-2 shadow-sm">
		<button onclick={() => (displayedComponent = 'info')}>
			<p class="rounded-md px-3 py-2 {displayedComponent === 'info' ? 'bg-white' : ''} ">Info</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_ABSENT')}
			<button onclick={() => (displayedComponent = 'attendance')}
				><p class="rounded-md p-2 px-3 {displayedComponent === 'attendance' ? 'bg-white' : ''}">
					Attendance
				</p></button
			>
		{/if}
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_LEAVES')}
			<button onclick={() => (displayedComponent = 'leaves')}>
				<p class="rounded-md p-2 px-3 {displayedComponent === 'leaves' ? 'bg-white' : ''}">
					Leaves
				</p>
			</button>
		{/if}
	</div>

	<!-- main component -->
	<div class=" rounded-sm border-[1px] border-black/20 bg-white shadow-sm">
		{#if displayedComponent === 'info'}
			<Info bind:data bind:form />
		{:else if displayedComponent === 'attendance' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_ABSENT')}
			<Attendance bind:data />
		{:else if displayedComponent === 'leaves' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_LEAVES')}
			<Leaves bind:data />
		{:else}
			<p>Something went wrong</p>
		{/if}
	</div>
</div>
