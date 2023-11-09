<script>
	import Header from '$lib/components/header.svelte';
	import SideNav from '$lib/components/side-nav.svelte';
	import '../app.css';

	export let data;
</script>

<div>
	{#if data.session === null}
		<slot />
	{:else}
		<div class="flex relative h-screen bg-ghost/60 shadow-md">
			<SideNav />

			<div class="w-full h-full overflow-auto">
				<Header />
				<slot />
			</div>
		</div>
	{/if}
</div>
