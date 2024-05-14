import React from 'react';
import {type FormValidation} from '@/types';
import {isDefined} from './control';

/**
 * Check if a text contains any characters
 * @param text string to check
 * @returns true if text contains any non-whitespace characters
 */
export function containsText(text: string | undefined): boolean {
	if (!isDefined(text)) {
		return false;
	}

	return text!.isDefined();
}

/**
 * Check if a text contains any unicode characters
 * @param text string to check
 * @returns true if text contains any unicode characters
 */
export function containsUnicode(text: string): boolean {
	return /[^\u0000-\u00ff]/.test(text);
}

/**
 * Check if a text is longer than a specified length
 * @param text string to check
 * @param maxLength maximum length of the string (inclusive)
 * @returns true if text is longer than maxLength
 */
export function isTooLong(text: string, maxLength: number): boolean {
	return text.trim().length > maxLength;
}

/**
 * Validate text from a from input field
 * @param prop text to validate
 * @param maxStrLength maximum length of the string (inclusive)
 * @returns FormValidation object
 * @see FormValidation
 */
export const validateTextInput = ((prop: string | undefined, maxStrLength: number) => {
	const def: FormValidation = {
		text: '',
		color: 'primary',
		error: false,
		validation: 'valid',
	};
	if (!prop) {
		return def;
	}

	if (containsUnicode(prop)) {
		return {
			text: 'Use only alphanumeric characters',
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	if (isTooLong(prop, maxStrLength)) {
		return {
			text: `Max ${maxStrLength} characters`,
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	return def;
});

/**
 * Check if a given text is a valid URL
 * @param prop text to validate
 * @returns FormValidation object
 * @see FormValidation
 */
export const validateUrlInput = ((prop: string | undefined) => {
	const def: FormValidation = {
		text: '',
		color: 'primary',
		error: false,
		validation: 'valid',
	};
	if (!prop) {
		return def;
	}

	// Check string if it contains a domain name and a tld, where protocol is not allowed
	const urlRegex = /^[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

	if (!urlRegex.test(prop)) {
		return {
			text: 'Invalid URL',
			color: 'danger',
			error: true,
			validation: 'invalid',
		} satisfies FormValidation;
	}

	return def;
});
