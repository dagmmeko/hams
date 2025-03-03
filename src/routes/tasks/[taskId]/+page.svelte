<script lang="ts">
	import { page } from '$app/state'
	import { superForm, dateProxy } from 'sveltekit-superforms/client'

	let { data } = $props()
	const {
		form: editInternalTaskForm,
		enhance: editFormEnhance,
		constraints,
	} = superForm(data.editInternalTaskForm)
	const taskDueDate = dateProxy(editInternalTaskForm, 'taskDueDate', {
		format: 'date',
		empty: 'undefined',
	})

	let dateInput: any = $state()
</script>

<div class="mx-10 my-12">
	<p class="mb-5 text-sm">Task / {data.internalTask?.title}</p>

	<div class="rounded-sm border-[1px] border-black/20 bg-white p-6 shadow-sm">
		<form use:editFormEnhance method="post" action="?/editInternalTask">
			<div class="flex justify-between">
				<div class="grid">
					<p class="text-2xl">Employee Info</p>
					<p class=" rounded-xl py-1 text-sm">Employee personal and performance details here.</p>
				</div>
				<button
					onclick={(e) => {
						e.stopPropagation()
					}}
					class="rounded-md bg-primary px-6 py-2 text-white"
				>
					Update Info</button
				>
			</div>
			<hr class="my-6" />
			<div class="grid grid-cols-4 gap-6">
				<label class="grid flex-1">
					<span class="py-1 font-semibold text-primary"> Task Title</span>
					<input
						name="taskTitle"
						bind:value={$editInternalTaskForm.taskTitle}
						{...$constraints.taskTitle}
					/>
				</label>
				<label class="grid flex-1">
					<span class="py-1 font-semibold text-primary"> Task Description</span>
					<input
						name="taskDescription"
						bind:value={$editInternalTaskForm.taskDescription}
						{...$constraints.taskDescription}
					/>
				</label>
				<label class="grid flex-1">
					<span class="py-1 font-semibold text-primary"> Task Due Date </span>
					<input
						type="date"
						name="taskDueDate"
						bind:value={$taskDueDate}
						bind:this={dateInput}
						onclick={() => {
							dateInput && dateInput.showPicker()
						}}
					/>
				</label>

				<label class="grid flex-1">
					<span class="py-1 font-semibold text-primary"> Task Status </span>
					<select
						name="taskStatus"
						bind:value={$editInternalTaskForm.taskStatus}
						{...$constraints.taskStatus}
					>
						<option selected disabled value={null}>Select Task Status</option>
						<option value="PENDING">Pending</option>
						<option value="IN_PROGRESS">In progress</option>
						<option value="CHECKING">Checking</option>
						<option
							value="COMPLETED"
							disabled={page.data.session?.authUser.Employee.id !==
								data.internalTask?.creatorEmployeeId}>Completed</option
						>
					</select>
				</label>

				<label class="grid w-full gap-2">
					<span class="py-1 font-semibold text-primary"> Task Severity </span>
					<select
						name="taskSeverity"
						bind:value={$editInternalTaskForm.taskSeverity}
						{...$constraints.taskSeverity}
					>
						<option selected disabled> Select Severity </option>
						<option value="LOW"> Low</option>
						<option value="MEDIUM"> Medium </option>
						<option value="HIGH"> High</option>
						<option value="URGENT"> Urgent</option>
					</select>
				</label>

				<label class="grid flex-1">
					<span class="py-1 font-semibold text-primary"> Created By </span>
					<input
						type="text"
						name="createdBy"
						value={data.employees.find((emp) => emp.id === data.internalTask?.creatorEmployeeId)
							?.User.userName +
							`  (${
								data.employees.find((emp) => emp.id === data.internalTask?.creatorEmployeeId)?.Role
									.name
							})`}
						disabled
					/>
				</label>
				<label class="grid h-fit w-full gap-2">
					<span class="py-1 font-semibold text-primary"> Assign To </span>
					<select
						name="assignedTo"
						bind:value={$editInternalTaskForm.assignedTo}
						{...$constraints.assignedTo}
					>
						<option selected disabled> Pick an Employee </option>
						{#each data.employees as employee}
							<option
								disabled={employee.isAbsent || employee.onLeave || employee.isSuspended}
								value={employee.id}
								>{employee.User.userName}
								{` (${employee.Role.name})`}
								{employee.isAbsent ? ' - Absent' : ''}
								{employee.onLeave ? ' - On Leave' : ''}
								{employee.isSuspended ? ' - Suspended' : ''}
							</option>
						{/each}
					</select>
				</label>
			</div>
		</form>
	</div>
</div>
