<script lang="ts">
	import QR from '$lib/assets/qr.png';
	import type { PageData } from './$types';
	export let row: any;
	$: console.log(row);
</script>

<div class="grid grid-flow-col w-fit gap-6 items-center">
	<img src={QR} alt="img" class="w-10 h-10 rounded-full" />
	<div class="grid">
		<span class="text-sm font-medium"> {row.fullName}</span>
		<span class="text-xs"> <span class="text-primary">Score</span> {row.tenantScore}</span>
	</div>
</div>
