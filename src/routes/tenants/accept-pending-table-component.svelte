<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'

	interface Props {
		row: any
	}

	let { row }: Props = $props()
</script>

{#if !row.approved && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'APPROVE_PENDING')}
	<div class="flex">
		<form
			class="w-full"
			method="post"
			action="?/acceptPending"
			use:enhance={({ formData }) => {
				formData.set('priceChangeId', row.id.toString())
			}}
		>
			<button class="w-full rounded-md bg-primary p-[6px] text-center text-sm text-white/90">
				Accept
			</button>
		</form>
		<form
			method="post"
			action="?/denyPending"
			use:enhance={({ formData }) => {
				formData.set('priceChangeId', row.id.toString())
			}}
			class="flex w-full justify-center"
		>
			<button class="mx-2 w-full rounded-md border-[1px] border-danger p-1 text-center text-sm">
				Deny
			</button>
		</form>
	</div>
{:else if !row.active}
	<a href="/tenants/approve-tenant?priceChangeId={row.id}">
		<div class="rounded-md border-[1px] border-primary p-[6px] text-center text-sm text-primary">
			Open
		</div>
	</a>
{/if}
