<script lang="ts">
	import { goto } from '$app/navigation';
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import { page } from '$app/stores';
</script>

<div class="mx-10 my-12 bg-white rounded-sm shadow-md border-[1px] border-black/20">
	<div class="flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Tenants</p>
			<p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Tenants</p>
		</div>
		<a href="/tenants/add-tenant" class="bg-primary text-white rounded-md py-2 px-6"> New Tenant</a>
	</div>
	<div class="bg-ghost/60 p-6 flex justify-between">
		<button
			class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white"
		>
			<FiltersLines class="h-4 w-4" /> Add filters
		</button>
		<label class="grid">
			<input
				placeholder="Search"
				class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				type="search"
				id="search"
				name="search"
				on:change={async (e) => {
					const newSearchParams = new URLSearchParams($page.url.search);
					newSearchParams.set('search', e.currentTarget.value);
					await goto(`?${newSearchParams.toString()}`);
				}}
			/>
		</label>
	</div>
</div>
