<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let row: any;
</script>

{#if !row.approved && $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'APPROVE_PENDING')}
	<div class="flex">
		<form
			class="w-full"
			method="post"
			action="?/acceptPending"
			use:enhance={({ formData }) => {
				formData.set('priceChangeId', row.id.toString());
			}}
		>
			<button class="bg-primary p-[6px] rounded-md text-sm text-center text-white/90 w-full">
				Accept
			</button>
		</form>
		<form
			method="post"
			action="?/denyPending"
			use:enhance={({ formData }) => {
				formData.set('priceChangeId', row.id.toString());
			}}
			class="flex justify-center w-full"
		>
			<button class="border-danger border-[1px] p-1 rounded-md mx-2 text-sm text-center w-full">
				Deny
			</button>
		</form>
	</div>
{:else if !row.active}
	<a href="/tenants/approve-tenant?priceChangeId={row.id}">
		<div class="border-primary border-[1px] p-[6px] rounded-md text-sm text-primary text-center">
			Open
		</div>
	</a>
{/if}
