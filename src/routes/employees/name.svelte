<script lang="ts">
	import QR from '$lib/assets/qr.png';
	import type { PageData } from './$types';
	interface Props {
		row: any;
	}

	let { row }: Props = $props();
</script>

<div class="grid grid-flow-col w-fit gap-6 items-center">
	<img src={QR} alt="img" class="w-10 h-10 rounded-full" />
	<div class="grid">
		<span class="text-sm font-medium"> {row.User.userName}</span>
		<span class="text-xs"> {row.staffIdNumber}</span>
	</div>
</div>
