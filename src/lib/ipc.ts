import {type IpcProps} from '@/types';
import {invoke} from '@tauri-apps/api';
import {ask, message} from '@tauri-apps/api/dialog';
import {debug, error} from 'tauri-plugin-log-api';
import {
	showButton, showButton2, showCurrentTime, showDetails, showGivenTime, showLargeImage, showLargeImageText, showParty, showSmallImage, showSmallImageText, showState,
} from './props';

enum IpcError {
	ClientCreationErr = 101,
	DiscordConnectionErr = 102,
	ActivitySetErr = 103,
	IpcRecvErr = 104,
	DiscordNotRunning = 105,
	DiscordError = 106,
}

export async function startIpc(ipcProps: IpcProps, disableConfirmMsg = false): Promise<boolean> {
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
			void message('RPC Started!', {title: 'Statusify', type: 'info'});
		}

		return true;
	} catch (err) {
		handleIpcError(err as IpcError);

		return false;
	}
}

export async function stopIpc(askConfirmation = true): Promise<boolean> {
	void debug('attempting to stop RPC...');

	try {
		let isStopConfirmed = true;
		if (askConfirmation) {
			isStopConfirmed = await ask('Are you sure you want to stop the current activity?', {title: 'Statusify', type: 'warning'});
		}

		if (isStopConfirmed) {
			await invoke('stop_rpc');
			void debug('showing system notification for RPC cancelation success');
		}

		void debug(`rpc cancelation confirmed: ${isStopConfirmed ? 'yes' : 'no'}`);

		return isStopConfirmed;
	} catch (err) {
		handleIpcError(err as IpcError);

		return true;
	}
}

function handleIpcError(err: IpcError): void {
	void debug(`showing system notification for RPC failure: ${err}`);

	switch (err) {
		case IpcError.ClientCreationErr:
			void message('Could not create client for Discord. Check your settings', {title: 'Statusify', type: 'error'});
			break;
		case IpcError.DiscordConnectionErr:
			void message('Could not connect to Discord. Discord might be closed', {title: 'Statusify', type: 'error'});
			break;
		case IpcError.ActivitySetErr:
			void message('App ID is invalid', {title: 'Statusify', type: 'error'});
			break;
		case IpcError.IpcRecvErr:
			void message('App ID or your settings are invalid', {title: 'Statusify', type: 'error'});
			break;
		case IpcError.DiscordNotRunning:
			void message('Discord is not running', {title: 'Statusify', type: 'error'});
			break;
		case IpcError.DiscordError:
			void message('Could not perform action due to an error on Discord\'s side. Discord might be closed', {title: 'Statusify', type: 'error'});
			break;
	}
}
