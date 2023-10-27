<script lang="ts">
	import QR from '$lib/assets/qr.png';
	import type { PageData } from './$types';
	export let row: any;
	export let data: PageData;
</script>

<div class="grid grid-flow-col w-fit gap-6 items-center">
	<img src={QR} alt="img" class="w-10 h-10 rounded-full" />
	<div class="grid">
		<span class="text-sm font-medium"> {data.employees[row.id - 1]?.User.userName}</span>
		<span class="text-xs"> {data.employees[row.id - 1]?.staffIdNumber}</span>
	</div>
</div>
