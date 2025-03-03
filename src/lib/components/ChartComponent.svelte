<script lang="ts">
	import { onMount } from 'svelte'
	import {
		ArcElement,
		BarElement,
		CategoryScale,
		Chart,
		Legend,
		LinearScale,
		Title,
		Tooltip,
		PieController,
		BarController,
		LineController,
		LineElement,
		PointElement,
	} from 'chart.js'
	import type { ChartType } from 'chart.js'

	Chart.register(
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		BarElement,
		LinearScale,
		PieController,
		BarController,
		LineController,
		LineElement,
		PointElement,
	)

	type ChartConfigType =
		| 'bookings'
		| 'unitStatus'
		| 'employeeType'
		| 'taskStatus'
		| 'attendance'
		| 'revenue'
		| 'utility'
		| 'maintenance'

	interface Props {
		type: ChartType
		rawData: {
			type: ChartConfigType
			label?: string
			values: number[]
		}
		height?: string
	}

	let { type, rawData, height = '300px' }: Props = $props()

	const chartConfigs = {
		bookings: {
			labels: [
				'Website',
				'Referral',
				'Walk-in',
				'Phone',
				'Email',
				'Social Media',
				'Broker',
				'Other',
			],
			colors: {
				bg: [
					'#F7464A',
					'#46BFBD',
					'#FDB45C',
					'#949FB1',
					'#4D5360',
					'#AC64AD',
					'#123456',
					'#654321',
				],
				hover: [
					'#FF5A5E',
					'#5AD3D1',
					'#FFC870',
					'#A8B3C5',
					'#616774',
					'#DA92DB',
					'#789ABC',
					'#CBA987',
				],
			},
		},
		unitStatus: {
			labels: ['Out of Service', 'Good Condition', 'Needs Repair'],
			colors: {
				bg: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
				hover: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
			},
		},
		employeeType: {
			labels: ['Temporary', 'Part Time', 'Full Time'],
			colors: {
				bg: ['#FF6384', '#36A2EB', '#FFCE56'],
			},
		},
		taskStatus: {
			labels: ['Pending', 'In Progress', 'Checking', 'Completed'],
			colors: {
				bg: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
				hover: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
			},
		},
		attendance: {
			labels: ['On Leave', 'Absent', 'Present', 'Is Fired'],
			colors: {
				bg: ['#FF6384', '#36A2EB', '#FFCE56'],
			},
		},
		revenue: {
			labels: Array.from({ length: rawData.values.length }, (_, i) => `Day ${i + 1}`),
			colors: {
				bg: 'rgba(255, 99, 132, 0.2)',
				border: 'rgba(255, 99, 132, 1)',
			},
		},
		utility: {
			labels: Array.from({ length: rawData.values.length }, (_, i) => `Day ${i + 1}`),
			colors: {
				bg: 'rgba(255, 99, 132, 0.2)',
				border: 'rgba(255, 99, 132, 1)',
			},
		},
		maintenance: {
			labels: ['Cleaning', 'Electricity', 'Plumbing', 'Painting', 'Security'],
			colors: {
				bg: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
			},
		},
	}

	let data = $derived({
		labels: chartConfigs[rawData.type].labels,
		datasets: [
			{
				label: rawData.label,
				data: rawData.values,
				...(type === 'line'
					? {
							backgroundColor: chartConfigs[rawData.type].colors.bg,
							borderColor: 'rgba(255, 99, 132, 1)',
							borderWidth: 1,
							pointBackgroundColor: 'rgb(255, 255, 255)',
							pointBorderWidth: 10,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: 'rgb(0, 0, 0)',
							pointHoverBorderColor: 'rgba(220, 220, 220,1)',
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10,
						}
					: {
							backgroundColor: chartConfigs[rawData.type].colors.bg,
						}),
			},
		],
	})

	let chart: Chart<ChartType>
	let chartCanvas: HTMLCanvasElement | undefined = $state()

	onMount(() => {
		if (chartCanvas) {
			chart = new Chart(chartCanvas, {
				type,
				data,
				options: { responsive: true },
			})
		}

		return () => {
			if (chart) {
				chart.destroy()
			}
		}
	})
</script>

<canvas bind:this={chartCanvas} style="height: {height}"></canvas>
