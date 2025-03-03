/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#0B666A',
				ghost: '#E2E8F0',
				subtitle: '#64748B',
				danger: '#DC2626',
				success: '#22BA62',
				warning: '#FFCB3D',
				info: '#4E4FEB',
			},
		},
	},
	plugins: [],
}
