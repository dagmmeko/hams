<script lang="ts">
	import type { PageData } from './$types'

	interface Props {
		// export let data: PageData
		row: Exclude<PageData['fullDataTenant'], undefined>[number]
	}

	let { row }: Props = $props()
</script>

<div
	class={`grid h-full w-full grid-flow-col items-center gap-6 px-3 ${
		row.paymentExpired
			? 'bg-red-300 text-red-900'
			: row.paymentDueSoon
				? 'bg-yellow-300 text-yellow-900'
				: row.contractExpired
					? 'bg-red-100 text-red-900'
					: row.contractSoonExpires
						? 'bg-yellow-100 text-yellow-900'
						: 'bg-green-300 text-green-900'
	}`}
>
	<!-- <img src={QR} alt="img" class="w-10 h-10 rounded-full" /> -->
	<div class="grid">
		{row.paymentExpired
			? 'Payment Expired'
			: row.paymentDueSoon
				? 'Payment Due'
				: row.contractExpired
					? 'Contract Expired'
					: row.contractSoonExpires
						? 'Contract Due'
						: 'Good'}
	</div>
</div>
