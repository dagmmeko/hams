<script lang="ts">
	import { allScopes } from '$lib/utils/scopes.js';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	let noChange = true;

	const {
		form: editRoleForm,
		enhance: editFormEnhance,
		constraints
	} = superForm(data.editRoleForm);
</script>

<form method="post" action="?/editRole" use:editFormEnhance>
	<div class="grid grid-flow-col mx-10 my-12 items-start space-x-12 bg-white rounded-xl p-8">
		<div class="flex-1 grid col-span-1 gap-4 justify-items-stretch it">
			<div>
				<p class="text-xl font-semibold">
					<span class="font-bold text-primary"> {data.role.name} </span> Role
				</p>
				<p class="text-sm text-subtitle pt-2">Edit role here. Click save when you're done.</p>
			</div>
			<label class="grid">
				<span class="text-primary font-medium"> Role </span>
				<input
					required
					class="w-full border-[1px] border-black/60 rounded-md p-2"
					name="name"
					bind:value={$editRoleForm.name}
					{...$constraints.name}
					on:input={() => (noChange = false)}
				/>
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Description </span>
				<textarea
					class="w-full border-[1px] border-black/60 rounded-md p-2"
					name="description"
					bind:value={$editRoleForm.description}
					{...$constraints.description}
					on:input={() => (noChange = false)}
				/>
			</label>

			<div class="flex gap-3">
				<button
					type="submit"
					disabled={noChange}
					class="disabled:bg-primary/60 bg-primary text-white rounded-md py-2 w-full"
				>
					Edit Role</button
				>
				<button
					on:click|stopPropagation
					type="submit"
					class="bg-danger text-white rounded-md py-2 w-full"
				>
					Archive Role</button
				>
			</div>
		</div>
		<div class="flex-1 col-span-2">
			<div class="grid grid-cols-3 gap-3">
				{#each allScopes as scope}
					<label class="flex space-x-2">
						<input
							type="checkbox"
							value={scope}
							on:input={() => (noChange = false)}
							name="scopes"
							bind:group={$editRoleForm.scopes}
						/>
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
