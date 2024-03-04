<script>
	import Logo from '$lib/assets/Logo.svg.svelte';
	import ChartPie from '$lib/assets/chart-pie.svg.svelte';
	import Employees from '$lib/assets/employees.svelte';
	import Tenant from '$lib/assets/tenant.svg.svelte';
	import Cash from '$lib/assets/cash.svg.svelte';
	import Store from '$lib/assets/store.svg.svelte';
	import Webhook from '$lib/assets/webhook.svg.svelte';

	import { page } from '$app/stores';
	import Home from '$lib/assets/home.svg.svelte';
</script>

<div class="h-screen bg-black md:w-60 w-fit px-4">
	<Logo class="h-16 w-16" />
	<div class="grid gap-3">
		<a href="/">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {$page.url.pathname === '/'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<ChartPie /> <span class="md:block hidden"> OverView </span>
			</div>
		</a>
		<a href="/rental-units">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {$page.url.pathname === '/rental-units'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<Home /> <span class="md:block hidden"> Rental Units </span>
			</div>
		</a>
		<a href="/tenants">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {$page.url.pathname === '/tenants'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<Tenant /> <span class="md:block hidden"> Tenant</span>
			</div>
		</a>
		<a href="/employees">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {$page.url.pathname === '/employees'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<Employees /> <span class="md:block hidden"> Employees</span>
			</div>
		</a>
		<a href="/accounting">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {$page.url.pathname === '/accounting'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<Cash /> <span class="md:block hidden"> Accounting</span>
			</div>
		</a>
		<a href="/vendor-task">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {$page.url.pathname === '/vendor-task'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<Store /> <span class="md:block hidden"> Vendor & Task</span>
			</div>
		</a>
		<a href="/roles">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {$page.url.pathname === '/roles'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<Webhook /> <span class="md:block hidden"> Role</span>
			</div>
		</a>
		<a href="/tasks">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {$page.url.pathname === '/tasks'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<Webhook /> <span class="md:block hidden"> Tasks</span>
			</div>
		</a>
	</div>
</div>
