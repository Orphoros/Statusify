import {type FormValidation} from '@/types';
import {isDefined} from './control';
import {type TFunction} from 'i18next';

/**
 * Check if a number text is a number between min and max
 * @param text string to check
 * @param min minimum value (inclusive)
 * @param max maximum value (inclusive)
 * @returns true if text is a digit between min and max
 */
export function isDigitBetween(text: string, min: number, max: number): boolean {
	return text.isInteger() && Number(text) >= min && Number(text) <= max;
}

/**
 * Type for the parameters of validateNumberInput
 */
type NumberValidation = {
	t: TFunction<'lib-digit-validator'>;
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
 * @param t translation function
 * @param text number text to validate
 * @param max maximum value (inclusive)
 * @param min minimum value (inclusive)
 * @param length length of the digits (inclusive)
 * @param required if true, text must not be empty
 * @returns FormValidation object
 * @see FormValidation
 */
export const validateNumberInput = (({t, text, min, max, length, required}: NumberValidation) => {
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
			text: t('lbl-error-required'),
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	if (!text!.isInteger()) {
		return {
			text: t('lbl-error-positive'),
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	if (isDefined(length) && !text!.isAtLength(length!)) {
		return {
			text: t('lbl-error-length', {length}),
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	if (isDefined(min) && isDefined(max) && !isDigitBetween(text!, min!, max!)) {
		return {
			text: t('lbl-error-range', {min, max}),
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	return def;
});
