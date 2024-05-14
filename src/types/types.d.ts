/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
	interface String {
		/**
		 * Check if the string is empty
		 */
		isEmpty: () => boolean;
		/**
		 * Check if the string contains any value
		 */
		isDefined: () => boolean;
		/**
		 * Check if the string is a whole number
		 */
		isInteger: () => boolean;
		/**
		 * Check if the string is at a specified length
		 */
		isAtLength: (length: number) => boolean;
		/**
		 * Check if the string is a website URL
		 */
		isWebsite: () => boolean;
		/**
		 * Check if the string is an image URL
		 */
		isOnlineImage: () => boolean;
	}
}

export {};
