export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~2],
		"/auth": [~3],
		"/auth/signup-error": [~4],
		"/employees": [~5],
		"/employees/[employeeId]": [~6],
		"/rental-units": [~7],
		"/rental-units/add-unit": [~9],
		"/rental-units/[unitId]": [~8],
		"/roles": [~10],
		"/roles/add-role": [~12],
		"/roles/[roleId]": [~11],
		"/tenants": [~13]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';