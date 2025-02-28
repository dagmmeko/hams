import { error } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.url.searchParams.get('error')) {
		error(500, 'Token not found.');
	}

	const tokenURL = event.url.searchParams.get('error');

	return {
		tokenURL
	};
};
