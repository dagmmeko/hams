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
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~2],
		"/accounting": [3],
		"/auth": [~4],
		"/auth/signup-error": [~5],
		"/employees": [~6],
		"/employees/[employeeId]": [~7],
		"/rental-units": [~8],
		"/rental-units/add-unit": [~9],
		"/rental-units/[unitId]": [~10],
		"/roles": [~11],
		"/roles/add-role": [~12],
		"/roles/[roleId]": [~13],
		"/tenants": [~14],
		"/tenants/add-tenant": [~15],
		"/vendor-task": [~16]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';