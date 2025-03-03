<script lang="ts">
	import { allScopes } from '$lib/utils/scopes.js'
	import { superForm } from 'sveltekit-superforms/client'
	import { toast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import PdfPrint from '$lib/components/pdf-print.svelte'

	let { data, form } = $props()

	let noChange = $state(true)

	const { form: editRoleForm, enhance: editFormEnhance, constraints } = superForm(data.editRoleForm)

	const { form: deleteRoleForm, enhance: deleteFormEnhance } = superForm(data.deleteRoleForm, {
		onSubmit: ({ formData, cancel }) => {
			if (!window.confirm('Are you sure you want to delete this role?')) {
				cancel()
			}
			formData.set('deleteRoleId', data.role.id.toString())
		},
	})

	$effect.pre(() => {
		form?.deleteRoleForm ? toast.push('Role deleted successfully') : null
	})
	$effect.pre(() => {
		form?.deleteRoleForm ? goto('/roles') : null
	})
	$effect.pre(() => {
		form?.editRoleForm ? toast.push('Role edited successfully') : null
	})
</script>

<form method="post" action="?/editRole" use:editFormEnhance>
	<PdfPrint class="mx-5 mt-12 md:mx-10">
		<div
			class="mx-5 grid items-start rounded-xl bg-white p-8 md:mx-10 lg:grid-flow-col lg:space-x-12"
		>
			<div class="it col-span-1 grid flex-1 justify-items-stretch gap-4">
				<div>
					<p class="text-xl font-semibold">
						<span class="font-bold text-primary"> {data.role.name} </span> Role
					</p>
					<p class="pt-2 text-sm text-subtitle print:hidden">
						Edit role here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="font-medium text-primary"> Role </span>
					<input
						required
						class="w-full rounded-md border-[1px] border-black/60 p-2"
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
						class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
						oninput={() => (noChange = false)}
					/>
					<span class="font-medium text-primary"> Send Email </span>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Description </span>
					<textarea
						class="w-full rounded-md border-[1px] border-black/60 p-2"
						name="description"
						bind:value={$editRoleForm.description}
						{...$constraints.description}
						oninput={() => (noChange = false)}
					></textarea>
				</label>

				<div class="gap-3 sm:flex">
					{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_ROLE')}
						<button
							type="submit"
							disabled={noChange}
							class="w-full rounded-md bg-primary py-2 text-white disabled:bg-primary/60"
						>
							Edit Role</button
						>
					{/if}
					{#if data.role.Employees.length && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_ROLE')}
						<button
							onclick={(e) => {
								e.preventDefault()
								toast.push('Can not delete a role with Employees in it.')
							}}
							type="submit"
							class="mt-3 w-full rounded-md bg-subtitle py-2 text-white sm:mt-0"
						>
							Archive Role</button
						>
					{:else if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_ROLE')}
						<form
							use:deleteFormEnhance
							method="post"
							action="?/archiveRole"
							class="flex w-full justify-center rounded-md bg-danger py-2 text-white"
						>
							<button
								onclick={(e) => {
									e.stopPropagation()
								}}
								type="submit"
								class="h-full w-full"
							>
								Archive Role</button
							>
						</form>
					{/if}
				</div>
			</div>
			<div class="col-span-2 mt-6 flex-1 lg:mt-0">
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
					{#each allScopes as scope}
						<label class="flex space-x-2">
							<input
								type="checkbox"
								value={scope}
								oninput={() => (noChange = false)}
								name="scopes"
								bind:group={$editRoleForm.scopes}
							/>
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
	</PdfPrint>
</form>
