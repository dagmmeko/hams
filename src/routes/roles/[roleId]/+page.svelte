<script lang="ts">
	import { run, preventDefault, createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import { allScopes } from '$lib/utils/scopes.js';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import PdfPrint from '$lib/components/pdf-print.svelte';

	let { data, form } = $props();

	let noChange = $state(true);

	const {
		form: editRoleForm,
		enhance: editFormEnhance,
		constraints
	} = superForm(data.editRoleForm);

	const { form: deleteRoleForm, enhance: deleteFormEnhance } = superForm(data.deleteRoleForm, {
		onSubmit: ({ formData, cancel }) => {
			if (!window.confirm('Are you sure you want to delete this role?')) {
				cancel();
			}
			formData.set('deleteRoleId', data.role.id.toString());
		}
	});

	run(() => {
		form?.deleteRoleForm ? toast.push('Role deleted successfully') : null;
	});
	run(() => {
		form?.deleteRoleForm ? goto('/roles') : null;
	});
	run(() => {
		form?.editRoleForm ? toast.push('Role edited successfully') : null;
	});
</script>

<form method="post" action="?/editRole" use:editFormEnhance>
	<PdfPrint class="md:mx-10 mx-5 mt-12">
		<div
			class="grid lg:grid-flow-col md:mx-10 mx-5 items-start lg:space-x-12 bg-white rounded-xl p-8"
		>
			<div class="flex-1 grid col-span-1 gap-4 justify-items-stretch it">
				<div>
					<p class="text-xl font-semibold">
						<span class="font-bold text-primary"> {data.role.name} </span> Role
					</p>
					<p class="text-sm text-subtitle pt-2 print:hidden">
						Edit role here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="text-primary font-medium"> Role </span>
					<input
						required
						class="w-full border-[1px] border-black/60 rounded-md p-2"
						name="name"
						bind:value={$editRoleForm.name}
						{...$constraints.name}
						oninput={() => (noChange = false)}
					/>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="sendEmailTo"
						bind:checked={$editRoleForm.sendEmailTo}
						{...$constraints.sendEmailTo}
						class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
						oninput={() => (noChange = false)}
					/>
					<span class="text-primary font-medium"> Send Email </span>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Description </span>
					<textarea
						class="w-full border-[1px] border-black/60 rounded-md p-2"
						name="description"
						bind:value={$editRoleForm.description}
						{...$constraints.description}
						oninput={() => (noChange = false)}
					></textarea>
				</label>

				<div class="sm:flex gap-3">
					{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_ROLE')}
						<button
							type="submit"
							disabled={noChange}
							class="disabled:bg-primary/60 bg-primary text-white rounded-md py-2 w-full"
						>
							Edit Role</button
						>
					{/if}
					{#if data.role.Employees.length && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_ROLE')}
						<button
							onclick={preventDefault(() =>
								toast.push('Can not delete a role with Employees in it.'))}
							type="submit"
							class="bg-subtitle sm:mt-0 mt-3 text-white rounded-md py-2 w-full"
						>
							Archive Role</button
						>
					{:else if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_ROLE')}
						<form
							use:deleteFormEnhance
							method="post"
							action="?/archiveRole"
							class="w-full bg-danger text-white flex justify-center rounded-md py-2"
						>
							<button onclick={stopPropagation(bubble('click'))} type="submit" class="w-full h-full">
								Archive Role</button
							>
						</form>
					{/if}
				</div>
			</div>
			<div class="flex-1 col-span-2 lg:mt-0 mt-6">
				<div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
					{#each allScopes as scope}
						<label class="flex space-x-2">
							<input
								type="checkbox"
								value={scope}
								oninput={() => (noChange = false)}
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
	</PdfPrint>
</form>
