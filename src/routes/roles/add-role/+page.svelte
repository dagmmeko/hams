<script lang="ts">
	import { goto } from '$app/navigation'
	import { allScopes } from '$lib/utils/scopes'
	import { superForm } from 'sveltekit-superforms/client'
	import { toast } from '@zerodevx/svelte-toast'

	let { data, form } = $props()

	$effect.pre(() => {
		form?.addRole ? goto('/roles') : null
	})
	$effect.pre(() => {
		form?.addRole ? toast.push('Role created successfully') : null
	})

	const { form: addRoleForm, enhance: addFormEnhance, constraints } = superForm(data.addRoleForm)
</script>

<form method="post" action="?/addRole" use:addFormEnhance>
	<div
		class="mx-5 my-12 grid items-start rounded-xl bg-white p-8 md:mx-10 lg:grid-flow-col lg:space-x-12"
	>
		<div class="it col-span-1 grid flex-1 justify-items-stretch gap-4">
			<div>
				<p class="text-xl font-semibold">New Role</p>
				<p class="pt-2 text-sm text-subtitle">
					Register new role here. Click save when you're done.
				</p>
			</div>
			<label class="grid">
				<span class="font-medium text-primary"> Role </span>
				<input
					required
					class="w-full rounded-md border-[1px] border-black/60 p-2"
					name="name"
					bind:value={$addRoleForm.name}
					{...$constraints.name}
				/>
			</label>
			<label class="grid">
				<span class="font-medium text-primary"> Description </span>
				<textarea
					class="w-full rounded-md border-[1px] border-black/60 p-2"
					name="description"
					bind:value={$addRoleForm.description}
					{...$constraints.description}
				></textarea>
			</label>

			<button type="submit" class="rounded-md bg-primary py-2 text-white"> Create Role</button>
		</div>
		<div class="col-span-2 mt-6 flex-1 lg:mt-0">
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
				{#each allScopes as scope}
					<label class="flex space-x-2">
						<input type="checkbox" value={scope} name="scopes" bind:group={$addRoleForm.scopes} />
						<div class="flex-1 text-xs">
							{scope
								.replace(/_/g, ' ')
								.replace(
									/^(.)(.*)$/,
									(_, firstLetter, restOfString) =>
										firstLetter.toUpperCase() + restOfString.toLowerCase(),
								)}
						</div>
					</label>
				{/each}
			</div>
		</div>
	</div>
</form>
