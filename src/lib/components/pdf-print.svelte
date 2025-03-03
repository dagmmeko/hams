<script lang="ts">
	import Printer from '$lib/assets/printer.svg.svelte'

	import PrintPdf, { Page } from 'svelte-printpdf'
	import CPHeader from '$lib/assets/cp_header.png'
	import CPFooter from '$lib/assets/cp_footer.png'

	let print = $state(false)
	interface Props {
		class?: string
		children?: import('svelte').Snippet
	}

	let { class: className = '', children }: Props = $props()

	// export let info: any;
	// export let tenant: Tenants | null;
</script>

<div>
	<button
		class="flex h-fit items-center gap-2 rounded-md border-[1px] border-primary px-8 py-2 text-sm text-primary {className} mb-2"
		onclick={(e) => {
			e.stopPropagation()
			e.preventDefault()
			print = true
		}}
	>
		<Printer class="h-4 w-4" /> Print
	</button>
	<PrintPdf bind:print>
		<img src={CPHeader} class="mb-6 hidden print:block" alt="cp header" />
		{@render children?.()}
		<img src={CPFooter} class="hidden w-full print:block" alt="cp header" />
	</PrintPdf>
</div>
