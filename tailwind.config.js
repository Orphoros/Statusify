const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,jsx,ts,tsx}',
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],

	darkMode: 'class',
	plugins: [heroui({
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

