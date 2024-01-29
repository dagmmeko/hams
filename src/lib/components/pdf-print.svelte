<script lang="ts">
	import Printer from '$lib/assets/printer.svg.svelte';

	import PrintPdf from 'svelte-printpdf';

	let print = false;
	let className = '';

	export { className as class };
	// export let info: any;
	// export let tenant: Tenants | null;
</script>

<div class="">
	<button
		class="border-primary border-[1px] text-primary rounded-md h-fit px-8 py-2 flex items-center text-sm gap-2 {className} mb-2"
		on:click={() => {
			print = true;
		}}
	>
		<Printer class="h-4 w-4" /> Print
	</button>
	<PrintPdf bind:print>
		<slot />
	</PrintPdf>
</div>
