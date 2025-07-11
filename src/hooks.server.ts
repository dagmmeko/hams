// import { locale } from 'svelte-i18n';
import { authHook } from '$lib/hooks/auth-hook.server'
import type { Handle } from '@sveltejs/kit'

import { sequence } from '@sveltejs/kit/hooks'

const localeHook: Handle = async ({ event, resolve }) => {
	// const lang = event.request.headers.get('accept-language')?.split(',')[0];
	// if (lang) {
	// 	locale.set(lang);
	// }
	return resolve(event)
}

export const handle = sequence(authHook, localeHook)
