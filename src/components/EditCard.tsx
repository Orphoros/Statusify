import React from 'react';
import {Card, CardBody} from '@nextui-org/react';
import {AppOptionForm, ButtonOptionForm, DetailsOptionForm, ImageOptionForm, PartyOptionForm, TimeOptionForm} from './options';

type EditCardProps = {
	onDetailsChange?: (details: string, status: string, detailsEnabled: boolean, stateEnabled: boolean) => void;
	onDetailsError?: (detailsError: boolean, stateError: boolean) => void;
	onPartyChange?: (min: string, max: string, enabled: boolean) => void;
	onPartyError?: (minError: boolean, maxError: boolean) => void;
	onAppChange?: (id: string) => void;
	onAppError?: (error: boolean) => void;
	onImageChange?: (largeImageName: string, smallImageName: string, largeImageEnabled: boolean, smallImageEnabled: boolean) => void;
	onTooltipChange?: (largeImageTooltip: string, smallImageTooltip: string, largeImageTooltipEnabled: boolean, smallImageTooltipEnabled: boolean) => void;
	onTimeChange?: (time: Date, useCurrent: boolean, enabled: boolean) => void;
	onImageError?: (largeImageTooltipError: boolean, smallImageTooltipError: boolean) => void;
	onButtonChange?: (text: string, url: string, protocol: string, enabled: boolean) => void;
	onButtonError?: (buttonError: boolean) => void;
	imageEnabled: boolean;
	partyEnabled: boolean;
	detailsEnabled: boolean;
	timeEnabled: boolean;
	buttonEnabled: boolean;
};

export default function EditCard(props: EditCardProps) {
	const {
		onDetailsChange,
		onDetailsError,
		onPartyChange,
		onPartyError,
		onAppChange,
		onAppError,
		onImageChange,
		onTooltipChange,
		onImageError,
		onTimeChange,
		onButtonChange,
		onButtonError,
		partyEnabled,
		detailsEnabled,
		imageEnabled,
		timeEnabled,
		buttonEnabled,
	} = props;

	return (
		<Card className='min-w-[400px] overflow-y-auto bg-content2' shadow='none' fullWidth radius='none'>
			<CardBody className='overflow-y-auto flex justify-between'>
				<AppOptionForm onChange={onAppChange} onError={onAppError}/>
				<DetailsOptionForm onChange={onDetailsChange} onError={onDetailsError} enabled={detailsEnabled} />
				<PartyOptionForm onChange={onPartyChange} onError={onPartyError} enabled={partyEnabled}/>
				<ImageOptionForm onImageChange={onImageChange} onTooltipChange={onTooltipChange} onError={onImageError} enabled={imageEnabled}/>
				<TimeOptionForm onChange={onTimeChange} enabled={timeEnabled}/>
				<ButtonOptionForm onChange={onButtonChange} onError={onButtonError} enabled={buttonEnabled}/>
			</CardBody>
		</Card>
	);
}
