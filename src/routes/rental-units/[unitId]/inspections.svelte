<script lang="ts">
	import type { PageData } from './$types'
	import dayjs from 'dayjs'

	interface Props {
		data: PageData
	}

	let { data = $bindable() }: Props = $props()
</script>

<div class="mb-6 text-xl font-semibold">Inspections list</div>
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each data.allInspections as inspection}
		<div class="border-[1px] border-black/20 p-4">
			<div>
				<p class="text-lg font-medium">Inspection Date</p>
				<p>{dayjs(inspection.inspectionDate).format('MMM DD/YY')}</p>
			</div>
			<div>
				<p class="text-lg font-medium">Inspection Description</p>

				<p>{inspection.description}</p>
			</div>
			<div>
				<p class="text-lg font-medium">Inspection Status</p>
				<p
					class="min-w-max max-w-[120px] rounded-full p-1 text-center text-[10px] {inspection.InspectionStatus ===
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
