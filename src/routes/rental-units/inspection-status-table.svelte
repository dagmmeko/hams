<script lang="ts">
	export let row: any;
</script>

<div
	class="text-[10px] w-fit text-white p-1 rounded-full {row.Inspection[0].InspectionStatus ===
	'GOOD_CONDITION'
		? 'bg-success'
		: ''}"
>
	{row.Inspection[0].InspectionStatus.replace(/_/g, ' ')}
</div>
