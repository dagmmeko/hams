<script lang="ts">

	import SvelteTable, { type TableColumn } from 'svelte-table';
	import { clickOutside } from '$lib/utils/click-outside';
    import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
    import Name from './name.svelte';
	import Remove from '$lib/assets/remove.svg.svelte';
	import FileUpload from '$lib/assets/file-upload.svg.svelte';
	import Preview from '$lib/assets/preview.svg.svelte';
	import Search from  '$lib/assets/search.svg.svelte';
    let modal = false;
	let dateInput: any;
    
	$: rows = [{ val: 1 }];
	$: columns = [
      
		{
			key: 'Name',
			title: 'Name',
			renderComponent: {
				component: Name
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'service',
			title: 'Service',
			value: (v: typeof rows[number]) => 'security',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
		{
			key: 'phone',
			title: 'Phone number',
			value: (v: typeof rows[number]) => '0911480875',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
		{
			key: 'email',
			title: 'Email address',
			value: (v: typeof rows[number]) => 'dagi@gmail.com',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
		{
			key: 'Score',
			title: 'Score',
			value: (v: typeof rows[number]) => '5',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
		{
			key: 'Start_date',
			title: 'Contact start Date',
			value: (v: typeof rows[number]) => 'jan 5,2020',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
      
	];



</script>
<div class='mx-10 my-5' >
    <div class=" text-[#64748B]">
        vendor 
    </div>
        <div class="bg-ghost/60 p-2 my-4 rounded-md shadow-md inline-flex">
            <div class="bg-white p-2 rounded-md">vendors </div>
			<div class=" p-2 rounded-md text-[#64748B]"> tasks </div>
			<div class=" p-2 rounded-md text-[#64748B]">pending tasks</div>
        </div>

    <div class=" bg-white rounded-sm shadow-md border-[1px] border-black/20">
        <div class="flex justify-between p-6">
            <div class="flex space-x-4">
                <p class="text-lg">Vendors</p>
                <p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Vendors</p>
            </div>
            <button class="bg-primary text-white rounded-md py-2 px-6"  on:click={() => (modal = true)}>
                New Vendor</button
            >
        </div>

        	<div class="bg-ghost/60 p-6 flex ">
            <div class=" flex mr-auto">
            <button
                class=" text-primary grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 mx-3 font-bold text-sm shadow-md bg-[#E2E8F0]"
            >
                All time 
				<div><Remove/></div>
            </button>
            <button
            class=" text-primary grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 mx-3 font-bold text-sm shadow-md bg-[#E2E8F0]"
        >
            US,AU,+4 
			<div><Remove/></div>
       		 </button>
		
        <button
        class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 mx-3 text-sm shadow-md bg-white"
    >
    <FiltersLines class="h-4 w-4" /> Add filters
    </button>
</div>
<div class="ml-auto">
            <label class="grid">
				<div class="  text-[#64748B] flex items-center border-[1px] w-[320px] h-[44px] border-[#E2E8F0] rounded-md px-2 py-3 bg-white">

				<div ><Search/></div>
                <input placeholder="Search" class=" border-none focus:outline-none  w-full  pl-2 " />
			</div>
            </label>
		</div>
            
           
        </div>
       
       
               
              
                
       
        <SvelteTable
		classNameTable="rolesTable"
		
		{columns}
		{rows}
	/>

   
    </div>
</div>



{#if modal}
	<div class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
		<div
			use:clickOutside={() => (modal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
		>
			<div>
				<p class="text-xl font-semibold">New Vendor</p>
				<p class="text-sm text-subtitle pt-2">
					Register new tenants here. Click save when you're done.
				</p>
			</div>
			<label class="grid">
				<span class="text-primary font-medium"> Vendor Name </span>
				<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Phone Number </span>
				<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Email </span>
				<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
			</label>
			<label>
				<span class="text-primary font-medium"> Score </span>
				<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" type="number" min="1" max="10" step="0.1">
			</label>
			
			<label class="grid">
				<span class="text-primary font-medium"> Start Date </span>
				<input
					type="date"
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
					bind:this={dateInput}
					on:click={() => {
						dateInput && dateInput.showPicker();
					}}
				/>
			</label>

			<label>
				<span class="text-primary font-medium"> Upload Contract File</span>
				<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2 hidden"  type="file" accept=".pdf,.png,.jpg">
				<div class="flex">
				
					<button class="border-dotted border-2 border-[#64748B] rounded-md py-14 px-10 mx-2" ><Preview/></button>
					<button class="border-dotted border-2 border-[#64748B] rounded-md py-14 px-10 mx-2" ><FileUpload/></button>

				</div>
				<span class="text-[#64748B] font-medium"> Formats:pdf,png,jpg</span>
			</label>
			<button class="bg-primary text-white rounded-md py-2"> Save tenant</button>
		</div>
	</div>
{/if}