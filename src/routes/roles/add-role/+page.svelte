<script lang="ts">
	import { run } from 'svelte/legacy';

	import { goto } from '$app/navigation';
	import { allScopes } from '$lib/utils/scopes';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from '@zerodevx/svelte-toast';

	let { data, form } = $props();

	run(() => {
		form?.addRole ? goto('/roles') : null;
	});
	run(() => {
		form?.addRole ? toast.push('Role created successfully') : null;
	});

	const { form: addRoleForm, enhance: addFormEnhance, constraints } = superForm(data.addRoleForm);
</script>

<form method="post" action="?/addRole" use:addFormEnhance>
	<div
		class="grid lg:grid-flow-col md:mx-10 mx-5 my-12 items-start lg:space-x-12 bg-white rounded-xl p-8"
	>
		<div class="flex-1 grid col-span-1 gap-4 justify-items-stretch it">
			<div>
				<p class="text-xl font-semibold">New Role</p>
				<p class="text-sm text-subtitle pt-2">
					Register new role here. Click save when you're done.
				</p>
			</div>
			<label class="grid">
				<span class="text-primary font-medium"> Role </span>
				<input
					required
					class="w-full border-[1px] border-black/60 rounded-md p-2"
					name="name"
					bind:value={$addRoleForm.name}
					{...$constraints.name}
				/>
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Description </span>
				<textarea
					class="w-full border-[1px] border-black/60 rounded-md p-2"
					name="description"
					bind:value={$addRoleForm.description}
					{...$constraints.description}
				></textarea>
			</label>

			<button type="submit" class="bg-primary text-white rounded-md py-2"> Create Role</button>
		</div>
		<div class="flex-1 col-span-2 lg:mt-0 mt-6">
			<div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
				{#each allScopes as scope}
					<label class="flex space-x-2">
						<input type="checkbox" value={scope} name="scopes" bind:group={$addRoleForm.scopes} />
						<div class="text-xs flex-1">
							{scope
								.replace(/_/g, ' ')
								.replace(
									/^(.)(.*)$/,
									(_, firstLetter, restOfString) =>
										firstLetter.toUpperCase() + restOfString.toLowerCase()
								)}
						</div>
					</label>
				{/each}
			</div>
		</div>
	</div>
</form>
