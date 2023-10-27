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
	() => import('./nodes/11')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~2],
		"/auth": [~3],
		"/auth/signup-error": [~4],
		"/employees": [~5],
		"/employees/add-employee": [~7],
		"/employees/[employeeId]": [~6],
		"/roles": [~8],
		"/roles/add-role": [~10],
		"/roles/[roleId]": [~9],
		"/tenants": [~11]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';