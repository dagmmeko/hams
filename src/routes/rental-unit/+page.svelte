<script lang="ts">

	import SvelteTable, { type TableColumn } from 'svelte-table';
	import { clickOutside } from '$lib/utils/click-outside';
    import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
  
	import Remove from '$lib/assets/remove.svg.svelte';
	import FileUpload from '$lib/assets/file-upload.svg.svelte';
	import Preview from '$lib/assets/preview.svg.svelte';
	import Search from  '$lib/assets/search.svg.svelte';
    let modal = false;
	let dateInput: any;
    
	$: rows = [{ val: 1 }];
	$: columns = [
      
		{
			key: 'room-no',
			title: 'Room No.',
			value: (v: typeof rows[number]) => 'security',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'floor',
			title: 'Floor',
			value: (v: typeof rows[number]) => 'floor',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
		{
			key: 'status',
			title: 'Status',
			value: (v: typeof rows[number]) => '0911480875',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
		{
			key: 'condition',
			title: 'Condition',
			value: (v: typeof rows[number]) => 'dagi@gmail.com',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
		{
			key: 'Unit type',
			title: 'Unit Type',
			value: (v: typeof rows[number]) => '5',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
        {
			key: 'price',
			title: 'price',
			value: (v: typeof rows[number]) => 'jan 5,2020',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
		{
			key: 'size',
			title: 'Size m2',
			value: (v: typeof rows[number]) => 'jan 5,2020',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#64748B] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
        {
			key: 'Delete',
			title: '',
			value: (v: typeof rows[number]) => 'security',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#1] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-[#64748B]'
		},
        {
			key: 'Edit',
			title: '',
			value: (v: typeof rows[number]) => 'security',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	];



</script>
<div class='mx-10 my-5' >
    <div class=" text-[#64748B]">
        Rental Units
    </div>
      

    <div class=" bg-white rounded-sm shadow-md border-[1px] border-black/20">
        <div class="flex justify-between p-6">
            <div class="flex space-x-4">
                <p class="text-lg">Rental units</p>
                <p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Units</p>
            </div>
            <button class="bg-primary text-white rounded-md py-2 px-6"  on:click={() => (modal = true)}>
                New Rental Unit</button
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



