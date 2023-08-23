import {type FormValidation} from '@/types';
import {containsText, isAtLength} from './strings';
import {isDefined} from './control';

/**
 * Check if a text is a number
 * @param text string to check
 * @returns true if text is a digit
 */
export function isDigit(text: string): boolean {
	if (!containsText(text)) {
		return false;
	}

	return /^\d+$/.test(text);
}

/**
 * Check if a number text is a number between min and max
 * @param text string to check
 * @param min minimum value (inclusive)
 * @param max maximum value (inclusive)
 * @returns true if text is a digit between min and max
 */
export function isDigitBetween(text: string, min: number, max: number): boolean {
	return isDigit(text) && Number(text) >= min && Number(text) <= max;
}

/**
 * Type for the parameters of validateNumberInput
 */
type NumberValidation = {
	text: string | undefined;
	min?: number;
	max?: number;
	length?: number;
	required?: boolean;
};

/**
 * Validate number from a from input field
 *
 * Only min/max or length will be validated at a time
 * @param text number text to validate
 * @param max maximum value (inclusive)
 * @param min minimum value (inclusive)
 * @param length length of the digits (inclusive)
 * @param required if true, text must not be empty
 * @returns FormValidation object
 * @see FormValidation
 */
export const validateNumberInput = (({text, min, max, length, required}: NumberValidation) => {
	const def: FormValidation = {
		text: '',
		color: 'primary',
		error: false,
		validation: 'valid',
	};
	if (!text && !required) {
		return def;
	}

	if (!text && required) {
		return {
			text: 'Required',
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	if (!isDigit(text!)) {
		return {
			text: 'Only positive whole numbers',
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	if (isDefined(length) && !isAtLength(text!, length!)) {
		return {
			text: `Number must be ${length!} digits long`,
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	if (isDefined(min) && isDefined(max) && !isDigitBetween(text!, min!, max!)) {
		return {
			text: `Must be between ${min!} and ${max!}`,
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	return def;
});
