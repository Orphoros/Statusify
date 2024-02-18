const {nextui} = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,jsx,ts,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],

	darkMode: 'class',
	plugins: [nextui({
		themes: {
			light: {
				extend: 'light',
				layout: {},
				colors: {},
			},
			dark: {
				extend: 'dark',
				layout: {},
				colors: {},
			},
		},
	})],
};

