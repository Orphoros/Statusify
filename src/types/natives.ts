String.prototype.isEmpty = function (): boolean {
	return this.length === 0;
};

String.prototype.isDefined = function (): boolean {
	return this.trim().length > 0;
};

String.prototype.isInteger = function (): boolean {
	const text: string = this.trim();
	return /^\d+$/.test(text);
};

String.prototype.isAtLength = function (length: number, maxLength?: number): boolean {
	const text: string = this.trim();
	if (maxLength) {
		return text.length >= length && text.length <= maxLength;
	}

	return text.length === length;
};

String.prototype.isWebsite = function (): boolean {
	const text: string = this.trim();
	return /^(http|https):\/\/[^ "]+$/.test(text);
};

String.prototype.isOnlineImage = function (): boolean {
	const text: string = this.trim();
	return /^(http|https):\/\/[^ "]+(\.png|\.jpg|\.jpeg)$/.test(text);
};
