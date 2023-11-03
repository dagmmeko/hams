<script>
	let alt = '';
	let image='';
</script>

<div class="grid grid-flow-col items-center ">
	<div class="bg-ghost/60 w-10 h-10 rounded-full  flex items-center justify-center">
	  {#if image}
		<img src={image} alt={alt} on:error="{() => image = ''}" />
	  {:else}
		<div class=" text-purple-500 text-lg  ">DM</div>
	  {/if}
	</div>
	<div class="">
	  Dagem Mekonnen
	</div>
  </div>

