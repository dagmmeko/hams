<script lang="ts">
	import Delete from '$lib/assets/delete.svg.svelte';
	import type { PageData } from './$types';
	interface Props {
		row: any;
		data: PageData;
	}

	let { row, data }: Props = $props();
</script>

<div><Delete class="text-[#667085]" /></div>
