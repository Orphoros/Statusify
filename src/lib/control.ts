/**
 * Check if a variable is defined
 * @param v variable to check
 * @returns true if variable is defined
 */
export function isDefined(v: any): boolean {
	return v !== null && typeof v !== 'undefined';
}
