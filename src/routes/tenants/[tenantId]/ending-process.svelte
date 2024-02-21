<script lang="ts">
	import dayjs from 'dayjs';
	import type { ActionData, PageData } from './$types';
	import PdfPrint from '$lib/components/pdf-print.svelte';
	import { enhance } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';

	export let data: PageData;
	export let form: ActionData;
	console.log({ data });
	$: form?.updateEnd ? toast.push('Rent ended successfully') : null;
</script>

<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
	{#each data.tenant?.TenantRental ?? [] as tenantUnit}
		{#if tenantUnit.exitingTenant}
			<PdfPrint>
				<div class="">
					<span class="font-medium">Company Name:</span>
					{tenantUnit.companyName}
				</div>
				<div class="font-light">
					<span class="font-medium">Room No: </span>{tenantUnit.RentalUnits.roomNumber}
				</div>

				<div><span class="font-medium">TIN:</span> {tenantUnit.tinNumber ?? 'N/A'}</div>
				<div>
					<span class="font-medium">Security Deposit:</span>
					{tenantUnit.securityDeposit}
				</div>
				<div>
					<span class="font-medium">Termination Reason:</span>
					{tenantUnit.terminationReason}
				</div>
				<div>
					<p class="font-medium">Latest Inspection:</p>
					<p>{dayjs(tenantUnit.RentalUnits.Inspections[0].inspectionDate).format('MMM DD / YY')}</p>
					<p
						class="text-[10px] text-center min-w-max max-w-[120px] p-1 rounded-full {tenantUnit
							.RentalUnits.Inspections[0].InspectionStatus === 'GOOD_CONDITION'
							? 'bg-success text-white'
							: tenantUnit.RentalUnits.Inspections[0].InspectionStatus === 'NEEDS_REPAIR'
							? 'bg-warning text-black/70'
							: tenantUnit.RentalUnits.Inspections[0].InspectionStatus === 'OUT_OF_SERVICE'
							? 'bg-danger text-white'
							: tenantUnit.RentalUnits.Inspections[0].InspectionStatus === 'MISSING_ITEMS'
							? 'bg-info text-white'
							: ''}"
					>
						{tenantUnit.RentalUnits.Inspections[0].InspectionStatus.replace(/_/g, ' ')}
					</p>
					<p>{tenantUnit.RentalUnits.Inspections[0].description}</p>
				</div>
			</PdfPrint>
			<hr class="my-4" />
			<form
				use:enhance={({ formData }) => {
					formData.set('unitId', tenantUnit.id.toString());
				}}
				method="post"
				action="?/endContract"
			>
				<button class="bg-danger rounded-md p-2 text-sm text-white"> End Contract </button>
			</form>
		{/if}
	{/each}
</div>
