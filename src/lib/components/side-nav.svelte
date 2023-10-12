<script>
	import Logo from '$lib/assets/Logo.svg.svelte';
	import ChartPie from '$lib/assets/chart-pie.svg.svelte';
	import Employees from '$lib/assets/employees.svelte';
	import Tenant from '$lib/assets/tenant.svg.svelte';
	import Cash from '$lib/assets/cash.svg.svelte';
	import Store from '$lib/assets/store.svg.svelte';
	import Webhook from '$lib/assets/webhook.svg.svelte';

	import { page } from '$app/stores';
</script>

<div class="h-screen bg-black w-60 px-4">
	<Logo class="h-16 w-16" />
	<div class="grid gap-3">
		<div class="text-white flex gap-2 m-2 bg-primary rounded-md p-1">
			<ChartPie /> OverView
		</div>
		<div class="text-white flex gap-2 m-2"><Tenant /> Tenant</div>
		<div class="text-white flex gap-2 m-2"><Employees /> Employees</div>
		<div class="text-white flex gap-2 m-2"><Cash /> Accounting</div>
		<div class="text-white flex gap-2 m-2"><Store /> Vendor & Task</div>
		<div class="text-white flex gap-2 m-2"><Webhook /> Role</div>
	</div>
</div>
