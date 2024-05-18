export type IpcProps = {
	id?: string;
	idError?: boolean;

	details?: string;
	detailsError?: boolean;
	detailsEnabled?: boolean;

	state?: string;
	stateError?: boolean;
	stateEnabled?: boolean;

	partySize?: number;
	partyMax?: number;
	partyError?: boolean;
	partyEnabled?: boolean;

	largeImage?: string;
	largeImageEnabled?: boolean;
	largeImageTooltip?: string;
	largeImageTooltipEnabled?: boolean;
	largeImageTooltipError?: boolean;
	largeImageUrlError?: boolean;

	smallImage?: string;
	smallImageEnabled?: boolean;
	smallImageTooltip?: string;
	smallImageTooltipEnabled?: boolean;
	smallImageTooltipError?: boolean;
	smallImageUrlError?: boolean;

	timeAsStart?: number;
	timeIsCurrent?: boolean;
	timeEnabled?: boolean;

	buttonText?: string;
	buttonUrl?: string;
	buttonProtocol?: string;
	buttonEnabled?: boolean;
	buttonError?: boolean;

	button2Text?: string;
	button2Url?: string;
	button2Protocol?: string;
	button2Enabled?: boolean;
	button2Error?: boolean;
};
