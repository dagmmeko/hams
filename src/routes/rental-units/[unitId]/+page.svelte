<script lang="ts">
	import Amenities from './amenities.svelte'
	import Info from './info.svelte'
	import Properties from './properties.svelte'
	import Inspections from './inspections.svelte'
	import { page } from '$app/state'

	let { data = $bindable(), form = $bindable() } = $props()

	let displayedComponent: 'room' | 'properties' | 'amenities' | 'inspections' = $state('room')
</script>

<div class="mx-5 mt-6 md:mx-10">
	<p class="mb-5 text-xs text-black/50">Rental Units / {data.unitDetails?.roomNumber}</p>
	<!-- Navigation -->
	<div class="mb-6 flex w-fit rounded-md bg-ghost p-2 shadow-sm">
		<button onclick={() => (displayedComponent = 'room')}>
			<p
				class="rounded-md px-2 py-2 text-xs md:px-3 md:text-base {displayedComponent === 'room'
					? 'bg-white'
					: ''} "
			>
				Room
			</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_UNIT_PROPERTY')}
			<button onclick={() => (displayedComponent = 'properties')}>
				<p
					class="rounded-md p-2 px-2 text-xs md:px-3 md:text-base {displayedComponent ===
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
					class="rounded-md p-2 px-2 text-xs md:px-3 md:text-base {displayedComponent ===
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
				class="rounded-md p-2 px-2 text-xs md:px-3 md:text-base {displayedComponent ===
				'inspections'
					? 'bg-white'
					: ''}"
			>
				Inspections
			</p>
		</button>
	</div>

	<div class=" mt-6 rounded-md border-[1px] border-black/20 bg-white p-6 shadow-sm">
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
