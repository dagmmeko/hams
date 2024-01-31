<script lang="ts">
	import Printer from '$lib/assets/printer.svg.svelte';

	import PrintPdf from 'svelte-printpdf';
	import CPHeader from '$lib/assets/cp_header.png';
	import CPFooter from '$lib/assets/cp_footer.png';

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
		<img src={CPHeader} class="hidden print:block mb-6" alt="cp header" />
		<slot />
		<img src={CPFooter} class="hidden print:block fixed bottom-0 w-full" alt="cp header" />
	</PrintPdf>
</div>
