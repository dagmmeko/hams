export function numberToCurrency(input: number, options?: Intl.NumberFormatOptions) {
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
		...options
	})
		.format(input)
		.replace(/$/, '');
}

export function currencyToNumber(value: string, pattern: RegExp = /(\$|,)/gi) {
	return parseFloat(value.replace(pattern, '')) || 0;
}
