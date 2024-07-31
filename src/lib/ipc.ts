import {type IpcProps} from '@/types';
import {invoke} from '@tauri-apps/api';
import {ask, message} from '@tauri-apps/api/dialog';
import {debug} from 'tauri-plugin-log-api';
import {
	showButton, showButton2, showCurrentTime, showDetails, showGivenTime, showLargeImage, showLargeImageText, showParty, showSmallImage, showSmallImageText, showState,
} from './props';
import {type TFunction} from 'i18next';

enum IpcError {
	ClientCreationErr = 101,
	DiscordConnectionErr = 102,
	ActivitySetErr = 103,
	IpcRecvErr = 104,
	DiscordNotRunning = 105,
	DiscordError = 106,
}

export async function startIpc(t: TFunction<'lib-rpc-handle'>, ipcProps: IpcProps, disableConfirmMsg = false): Promise<boolean> {
	void debug('attempting to start RPC');

	const buttons = [];

	if (showButton(ipcProps)) {
		buttons.push([ipcProps.buttonText, ipcProps.buttonProtocol! + ipcProps.buttonUrl]);
	}

	if (showButton2(ipcProps)) {
		buttons.push([ipcProps.button2Text, ipcProps.button2Protocol! + ipcProps.button2Url]);
	}

	const party = showParty(ipcProps) ? [ipcProps.partySize, ipcProps.partyMax] : undefined;
	const state = showState(ipcProps) ? ipcProps.state : undefined;
	const details = showDetails(ipcProps) ? ipcProps.details : undefined;
	const largeImage = showLargeImage(ipcProps) ? ipcProps.largeImage : undefined;
	const largeImageText = showLargeImageText(ipcProps) ? ipcProps.largeImageTooltip : undefined;
	const smallImage = showSmallImage(ipcProps) ? ipcProps.smallImage : undefined;
	const smallImageText = showSmallImageText(ipcProps) ? ipcProps.smallImageTooltip : undefined;

	let startTime: number | undefined;

	if (showGivenTime(ipcProps)) {
		startTime = ipcProps.timeAsStart;
	} else if (showCurrentTime(ipcProps)) {
		startTime = Date.now();
	} else {
		startTime = undefined;
	}

	try {
		await invoke('start_rpc', {
			id: ipcProps.id,
			state,
			startTime,
			party,
			buttons,
			details,
			largeImage,
			largeImageText,
			smallImage,
			smallImageText,
		});

		void debug('showing system notification for RPC creation success');
		if (!disableConfirmMsg) {
			void message(t('popup-rpc-start'), {title: 'Statusify', type: 'info'});
		}

		return true;
	} catch (err) {
		handleIpcError(t, err as IpcError);

		return false;
	}
}

export async function stopIpc(t: TFunction<'lib-rpc-handle'>, askConfirmation = true): Promise<boolean> {
	void debug('attempting to stop RPC...');

	try {
		let isStopConfirmed = true;
		if (askConfirmation) {
			isStopConfirmed = await ask(t('popup-rpc-stop-confirm'), {title: 'Statusify', type: 'warning'});
		}

		if (isStopConfirmed) {
			await invoke('stop_rpc');
			void debug('showing system notification for RPC cancelation success');
		}

		void debug(`rpc cancelation confirmed: ${isStopConfirmed ? 'yes' : 'no'}`);

		return isStopConfirmed;
	} catch (err) {
		handleIpcError(t, err as IpcError);

		return true;
	}
}

function handleIpcError(t: TFunction<'lib-rpc-handle'>, err: IpcError): void {
	void debug(`showing system notification for RPC failure: ${err}`);

	switch (err) {
		case IpcError.ClientCreationErr:
			void message(t('popup-err-101'), {title: 'Statusify', type: 'error'});
			break;
		case IpcError.DiscordConnectionErr:
			void message(t('popup-err-102'), {title: 'Statusify', type: 'error'});
			break;
		case IpcError.ActivitySetErr:
			void message(t('popup-err-103'), {title: 'Statusify', type: 'error'});
			break;
		case IpcError.IpcRecvErr:
			void message(t('popup-err-104'), {title: 'Statusify', type: 'error'});
			break;
		case IpcError.DiscordNotRunning:
			void message(t('popup-err-105'), {title: 'Statusify', type: 'error'});
			break;
		case IpcError.DiscordError:
			void message(t('popup-err-106'), {title: 'Statusify', type: 'error'});
			break;
	}
}
