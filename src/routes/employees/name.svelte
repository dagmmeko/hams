<script lang="ts">
	import QR from '$lib/assets/qr.png'
	import type { PageData } from './$types'
	interface Props {
		row: any
	}

	let { row }: Props = $props()
</script>

<div class="grid w-fit grid-flow-col items-center gap-6">
	<img src={QR} alt="img" class="h-10 w-10 rounded-full" />
	<div class="grid">
		<span class="text-sm font-medium"> {row.User.userName}</span>
		<span class="text-xs"> {row.staffIdNumber}</span>
	</div>
</div>
