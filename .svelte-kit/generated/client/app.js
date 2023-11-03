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
	() => import('./nodes/9')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~2],
		"/auth": [~3],
		"/auth/signup-error": [~4],
		"/employees": [~5],
		"/employees/add-employee": [~6],
		"/roles": [~7],
		"/roles/add-role": [~8],
		"/vendor-task": [9]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';