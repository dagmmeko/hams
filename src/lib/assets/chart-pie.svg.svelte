<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	
</script>

<svg
	class={className}
	width="24"
	height="25"
	viewBox="0 0 24 25"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M6.39244 5.01483C7.71836 3.95892 9.31549 3.29885 11 3.1106V13.0556H20.945C20.7567 14.7401 20.0967 16.3372 19.0408 17.6632C17.9849 18.9891 16.576 19.9899 14.9764 20.5505C13.3768 21.111 11.6514 21.2085 9.99877 20.8317C8.34618 20.4549 6.83357 19.6191 5.63502 18.4206C4.43648 17.222 3.60071 15.7094 3.22391 14.0568C2.84711 12.4042 2.9446 10.6788 3.50514 9.07922C4.06569 7.47959 5.06652 6.07075 6.39244 5.01483Z"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M15 9.0555H20.488C20.0391 7.79012 19.3135 6.64085 18.3641 5.69144C17.4147 4.74204 16.2654 4.01643 15 3.5675V9.0555Z"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
