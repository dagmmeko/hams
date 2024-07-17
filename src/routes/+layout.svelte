<script>
	import Header from '$lib/components/header.svelte';
	import SideNav from '$lib/components/side-nav.svelte';
	import Nprogress from '$lib/components/nprogress.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import '../app.css';

	export let data;
</script>

<div>
	{#if data.session === null}
		<slot />
	{:else}
		<div class="flex relative print:h-auto h-screen bg-ghost/60 shadow-md">
			<!-- <div class="md:block hidden"> -->
			<SideNav />
			<!-- </div> -->

			<div class="w-full print:h-auto h-full overflow-auto">
				<Header />
				<slot />
			</div>
		</div>
	{/if}
</div>

<SvelteToast />
<Nprogress />
