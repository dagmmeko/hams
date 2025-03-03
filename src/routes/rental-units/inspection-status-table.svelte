<script lang="ts">
	interface Props {
		row: any;
	}

	let { row }: Props = $props();
</script>

<div
	class="text-[10px] text-center min-w-max max-w-[120px] p-1 rounded-full {row.Inspections[0]
		.InspectionStatus === 'GOOD_CONDITION'
		? 'bg-success text-white'
		: row.Inspections[0].InspectionStatus === 'NEEDS_REPAIR'
			? 'bg-warning text-black/70'
			: row.Inspections[0].InspectionStatus === 'OUT_OF_SERVICE'
				? 'bg-danger text-white'
				: ''}"
>
	{row.Inspections[0].InspectionStatus.replace(/_/g, ' ')}
</div>
