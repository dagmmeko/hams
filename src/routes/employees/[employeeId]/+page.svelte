<script lang="ts">
	import Attendance from './attendance.svelte';
	import Info from './info.svelte';
	import Leaves from './leaves.svelte';
	import { page } from '$app/state';

	let { data = $bindable(), form = $bindable() } = $props();

	let displayedComponent: 'info' | 'attendance' | 'leaves' = $state('info');
</script>

<div class="md:mx-10 mx-5 my-12">
	<p class="text-sm mb-5">Employee / {data.employee?.User.userName}</p>

	<!-- Navigation -->
	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button onclick={() => (displayedComponent = 'info')}>
			<p class="py-2 px-3 rounded-md {displayedComponent === 'info' ? 'bg-white' : ''} ">Info</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_ABSENT')}
			<button onclick={() => (displayedComponent = 'attendance')}
				><p class="p-2 px-3 rounded-md {displayedComponent === 'attendance' ? 'bg-white' : ''}">
					Attendance
				</p></button
			>
		{/if}
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_LEAVES')}
			<button onclick={() => (displayedComponent = 'leaves')}>
				<p class="p-2 px-3 rounded-md {displayedComponent === 'leaves' ? 'bg-white' : ''}">
					Leaves
				</p>
			</button>
		{/if}
	</div>

	<!-- main component -->
	<div class=" bg-white rounded-sm shadow-sm border-[1px] border-black/20">
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
