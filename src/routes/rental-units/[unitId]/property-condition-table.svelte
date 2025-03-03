<script lang="ts">
	interface Props {
		row: any
	}

	let { row }: Props = $props()
</script>

<span
	class="w-full rounded-full p-1 text-center text-[6px] md:text-[8px] {row.propertyStatus ===
	'GOOD_CONDITION'
		? 'bg-success text-white'
		: row.propertyStatus === 'NEEDS_REPAIR'
			? 'bg-warning text-black/70'
			: row.propertyStatus === 'OUT_OF_SERVICE'
				? 'bg-danger text-white'
				: row.propertyStatus === 'MISSING_ITEMS'
					? 'bg-info text-white'
					: ''}"
>
	{row.propertyStatus.replace(/_/g, ' ')}
</span>
