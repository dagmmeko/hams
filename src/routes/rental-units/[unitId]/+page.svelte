<script lang="ts">
	import Amenities from './amenities.svelte';
	import Info from './info.svelte';
	import Properties from './properties.svelte';
	import Inspections from './inspections.svelte';
	import { page } from '$app/state';

	let { data = $bindable(), form = $bindable() } = $props();

	let displayedComponent: 'room' | 'properties' | 'amenities' | 'inspections' = $state('room');
</script>

<div class="mt-6 md:mx-10 mx-5">
	<p class="text-xs text-black/50 mb-5">Rental Units / {data.unitDetails?.roomNumber}</p>
	<!-- Navigation -->
	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button onclick={() => (displayedComponent = 'room')}>
			<p
				class="py-2 md:px-3 px-2 text-xs md:text-base rounded-md {displayedComponent === 'room'
					? 'bg-white'
					: ''} "
			>
				Room
			</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_UNIT_PROPERTY')}
			<button onclick={() => (displayedComponent = 'properties')}>
				<p
					class="p-2 md:px-3 px-2 text-xs md:text-base rounded-md {displayedComponent ===
					'properties'
						? 'bg-white'
						: ''}"
				>
					Properties
				</p>
			</button>
		{/if}
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_UNIT_AMENITIES')}
			<button onclick={() => (displayedComponent = 'amenities')}>
				<p
					class="p-2 md:px-3 px-2 text-xs md:text-base rounded-md {displayedComponent ===
					'amenities'
						? 'bg-white'
						: ''}"
				>
					Amenities
				</p>
			</button>
		{/if}
		<button onclick={() => (displayedComponent = 'inspections')}>
			<p
				class="p-2 md:px-3 px-2 text-xs md:text-base rounded-md {displayedComponent ===
				'inspections'
					? 'bg-white'
					: ''}"
			>
				Inspections
			</p>
		</button>
	</div>

	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		{#if displayedComponent === 'room'}
			<Info bind:form bind:data />
		{:else if displayedComponent === 'properties' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_UNIT_PROPERTY')}
			<Properties bind:data bind:form />
		{:else if displayedComponent === 'amenities' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_UNIT_AMENITIES')}
			<Amenities bind:data bind:form />
		{:else}
			<Inspections bind:data />
		{/if}
	</div>
</div>
