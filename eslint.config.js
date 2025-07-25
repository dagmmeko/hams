import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
		rules: {
			'no-unused-vars': 'off',
		},
	},
	{
		ignores: [
			'.husky/',
			'.svelte-kit/',
			'.vercel/',
			'build/',
			'dist/',
			'node_modules/',
			'static/',
			'pnpm-lock.yaml',
		],
	},
)
