<script lang="ts">
	import type { PageData } from './$types';
	import dayjs from 'dayjs';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="mb-6 font-semibold text-xl">Inspections list</div>
<div class="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
	{#each data.allInspections as inspection}
		<div class="border-[1px] border-black/20 p-4">
			<div>
				<p class="font-medium text-lg">Inspection Date</p>
				<p>{dayjs(inspection.inspectionDate).format('MMM DD/YY')}</p>
			</div>
			<div>
				<p class="font-medium text-lg">Inspection Description</p>

				<p>{inspection.description}</p>
			</div>
			<div>
				<p class="font-medium text-lg">Inspection Status</p>
				<p
					class="text-[10px] text-center min-w-max max-w-[120px] p-1 rounded-full {inspection.InspectionStatus ===
					'GOOD_CONDITION'
						? 'bg-success text-white'
						: inspection.InspectionStatus === 'NEEDS_REPAIR'
						? 'bg-warning text-black/70'
						: inspection.InspectionStatus === 'OUT_OF_SERVICE'
						? 'bg-danger text-white'
						: inspection.InspectionStatus === 'MISSING_ITEMS'
						? 'bg-info text-white'
						: ''}"
				>
					{inspection.InspectionStatus.replace(/_/g, ' ')}
				</p>
			</div>
		</div>
	{/each}
</div>
