export * from './ipc';
export * from './launchconf';

/**
 * FormValidation is a type alias for a form validation object that stores the result of a form validation.
 */
export type FormValidation = {
	text: string;
	color: ColorBrand;
	error: boolean;
	validation: 'valid' | 'invalid';
};

/**
 * ColorBrand is a type alias for a string literal type that HeroUI uses for color branding.
 */
export type ColorBrand = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
