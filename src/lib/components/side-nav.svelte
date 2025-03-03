<script>
	import Logo from '$lib/assets/Logo.svg.svelte'
	import ChartPie from '$lib/assets/chart-pie.svg.svelte'
	import Employees from '$lib/assets/employees.svelte'
	import Tenant from '$lib/assets/tenant.svg.svelte'
	import Cash from '$lib/assets/cash.svg.svelte'
	import Store from '$lib/assets/store.svg.svelte'
	import Webhook from '$lib/assets/webhook.svg.svelte'

	import { page } from '$app/state'
	import Home from '$lib/assets/home.svg.svelte'
	import Task from '$lib/assets/task.svg.svelte'
</script>

<div class="h-screen w-fit overflow-y-auto bg-black px-4 md:w-60">
	<Logo class="h-16 w-16" />
	<div class="grid gap-3">
		<a href="/">
			<div
				class="m-2 flex gap-0 text-white md:gap-2 {page.url.pathname === '/'
					? 'rounded-md bg-primary p-1'
					: ''}"
			>
				<ChartPie /> <span class="hidden md:block"> OverView </span>
			</div>
		</a>
		<a href="/rental-units">
			<div
				class="m-2 flex gap-0 text-white md:gap-2 {page.url.pathname === '/rental-units'
					? 'rounded-md bg-primary p-1'
					: ''}"
			>
				<Home /> <span class="hidden md:block"> Rental Units </span>
			</div>
		</a>
		<a href="/tenants">
			<div
				class="m-2 flex gap-0 text-white md:gap-2 {page.url.pathname === '/tenants'
					? 'rounded-md bg-primary p-1'
					: ''}"
			>
				<Tenant /> <span class="hidden md:block"> Tenant</span>
			</div>
		</a>
		<a href="/employees">
			<div
				class="m-2 flex gap-0 text-white md:gap-2 {page.url.pathname === '/employees'
					? 'rounded-md bg-primary p-1'
					: ''}"
			>
				<Employees /> <span class="hidden md:block"> Employees</span>
			</div>
		</a>
		<a href="/accounting">
			<div
				class="m-2 flex gap-0 text-white md:gap-2 {page.url.pathname === '/accounting'
					? 'rounded-md bg-primary p-1'
					: ''}"
			>
				<Cash /> <span class="hidden md:block"> Accounting</span>
			</div>
		</a>
		<a href="/vendor-task">
			<div
				class="m-2 flex gap-0 text-white md:gap-2 {page.url.pathname === '/vendor-task'
					? 'rounded-md bg-primary p-1'
					: ''}"
			>
				<Store /> <span class="hidden md:block"> Vendor & Task</span>
			</div>
		</a>
		<a href="/roles">
			<div
				class="m-2 flex gap-0 text-white md:gap-2 {page.url.pathname === '/roles'
					? 'rounded-md bg-primary p-1'
					: ''}"
			>
				<Webhook /> <span class="hidden md:block"> Role</span>
			</div>
		</a>
		<a href="/tasks">
			<div
				class="m-2 flex gap-0 text-white md:gap-2 {page.url.pathname === '/tasks'
					? 'rounded-md bg-primary p-1'
					: ''}"
			>
				<Task /> <span class="hidden md:block"> Tasks</span>
			</div>
		</a>
		<!-- <a href="/cms">
			<div
				class="text-white flex md:gap-2 gap-0 m-2 {page.url.pathname === '/cms'
					? 'bg-primary rounded-md p-1'
					: ''}"
			>
				<Task /> <span class="md:block hidden"> CMS</span>
			</div>
		</a> -->
	</div>
</div>
