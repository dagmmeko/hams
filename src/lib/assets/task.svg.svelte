<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<svg
	class={className}
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M8.9998 6.0001H19.9998M3.7998 5.8001L4.5998 6.6001L6.5998 4.6001M3.7998 11.8001L4.5998 12.6001L6.5998 10.6001M3.7998 17.8001L4.5998 18.6001L6.5998 16.6001M8.9998 12.0001H19.9998M8.9998 18.0001H19.9998"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
