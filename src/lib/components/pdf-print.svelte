<script lang="ts">
	import { preventDefault, stopPropagation } from 'svelte/legacy';

	import Printer from '$lib/assets/printer.svg.svelte';

	import PrintPdf, { Page } from 'svelte-printpdf';
	import CPHeader from '$lib/assets/cp_header.png';
	import CPFooter from '$lib/assets/cp_footer.png';

	let print = $state(false);
	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className = '', children }: Props = $props();

	
	// export let info: any;
	// export let tenant: Tenants | null;
</script>

<div>
	<button
		class="border-primary border-[1px] text-primary rounded-md h-fit px-8 py-2 flex items-center text-sm gap-2 {className} mb-2"
		onclick={stopPropagation(preventDefault(() => {
			print = true;
		}))}
	>
		<Printer class="h-4 w-4" /> Print
	</button>
	<PrintPdf bind:print>
		<img src={CPHeader} class="hidden print:block mb-6" alt="cp header" />
		{@render children?.()}
		<img src={CPFooter} class="hidden print:block w-full" alt="cp header" />
	</PrintPdf>
</div>
