import {type IpcProps} from '@/types';

export const showParty = (ipcProps: IpcProps) => showState(ipcProps) && (ipcProps.partyMax ?? -1) > 0 && (ipcProps.partySize ?? -1) >= 0 && ipcProps.partyMax! >= ipcProps.partySize! && ipcProps.partyEnabled && !ipcProps.partyError;
export const showCurrentTime = (ipcProps: IpcProps) => !ipcProps.idError && (ipcProps.timeAsStart ?? 0) > 0 && ipcProps.timeIsCurrent && ipcProps.timeEnabled;
export const showGivenTime = (ipcProps: IpcProps) => !ipcProps.idError && (ipcProps.timeAsStart ?? 0) > 0 && !ipcProps.timeIsCurrent && ipcProps.timeEnabled;
export const showState = (ipcProps: IpcProps) => showDetails(ipcProps) && ipcProps.stateEnabled && !ipcProps.stateError && ipcProps.state;
export const showDetails = (ipcProps: IpcProps) => !ipcProps.idError && ipcProps.detailsEnabled && !ipcProps.detailsError && ipcProps.details;
export const showLargeImage = (ipcProps: IpcProps) => !ipcProps.idError && ipcProps.largeImageEnabled && ipcProps.largeImage;
export const showSmallImage = (ipcProps: IpcProps) => showLargeImage(ipcProps) && ipcProps.smallImageEnabled && ipcProps.smallImage;
export const showButton = (ipcProps: IpcProps) => !ipcProps.idError && ipcProps.buttonEnabled && !ipcProps.buttonError && ipcProps.buttonUrl && ipcProps.buttonText;
export const showSmallImageText = (ipcProps: IpcProps) => showSmallImage(ipcProps) && ipcProps.smallImageTooltipEnabled && ipcProps.smallImageTooltip && !ipcProps.smallImageTooltipError;
export const showLargeImageText = (ipcProps: IpcProps) => showLargeImage(ipcProps) && ipcProps.largeImageTooltipEnabled && ipcProps.largeImageTooltip && !ipcProps.largeImageTooltipError;
