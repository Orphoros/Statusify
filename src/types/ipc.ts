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

	smallImage?: string;
	smallImageEnabled?: boolean;
	smallImageTooltip?: string;
	smallImageTooltipEnabled?: boolean;
	smallImageTooltipError?: boolean;

	timeAsStart?: number;
	timeIsCurrent?: boolean;
	timeEnabled?: boolean;

	buttonText?: string;
	buttonUrl?: string;
	buttonProtocol?: string;
	buttonEnabled?: boolean;
	buttonError?: boolean;
};
