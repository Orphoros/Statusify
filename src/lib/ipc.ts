import {type IpcProps} from '@/types';
import {invoke} from '@tauri-apps/api';
import {ask, message} from '@tauri-apps/api/dialog';
import {debug, error} from 'tauri-plugin-log-api';
import {showButton, showCurrentTime, showDetails, showGivenTime, showLargeImage, showLargeImageText, showParty, showSmallImage, showSmallImageText, showState} from './props';

enum IpcError {
	ClientCreationErr = 101,
	DiscordConnectionErr = 102,
	ActivitySetErr = 103,
	IpcRecvErr = 104,
	DiscordNotRunning = 105,
	DiscordError = 106,
}

export async function startIpc(ipcProps: IpcProps): Promise<boolean> {
	void debug('attempting to start RPC');

	const party = showParty(ipcProps) ? [ipcProps.partySize, ipcProps.partyMax] : undefined;
	const buttons = showButton(ipcProps) ? [[ipcProps.buttonText, ipcProps.buttonProtocol! + ipcProps.buttonUrl!]] : undefined;
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
		message('RPC Started!', {title: 'Statusify', type: 'info'}).catch(error);

		return true;
	} catch (err) {
		handleIpcError(err as IpcError);

		return false;
	}
}

export async function stopIpc(): Promise<boolean> {
	void debug('attempting to stop RPC...');

	try {
		const isStopConfirmed = await ask('Are you sure you want to stop the current activity?', {title: 'Statusify', type: 'warning'});
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
	void debug('showing system notification for RPC cancelation failure');

	switch (err) {
		case IpcError.ClientCreationErr:
			message('Could not create client for Discord. Check your settings', {title: 'Statusify', type: 'error'}).catch(error);
			break;
		case IpcError.DiscordConnectionErr:
			message('Could not connect to Discord. Discord might be closed', {title: 'Statusify', type: 'error'}).catch(error);
			break;
		case IpcError.ActivitySetErr:
			message('App ID is invalid', {title: 'Statusify', type: 'error'}).catch(error);
			break;
		case IpcError.IpcRecvErr:
			message('App ID or your settings are invalid', {title: 'Statusify', type: 'error'}).catch(error);
			break;
		case IpcError.DiscordNotRunning:
			message('Discord is not running', {title: 'Statusify', type: 'error'}).catch(error);
			break;
		case IpcError.DiscordError:
			message('Could not perform action due to an error on Discord\'s side. Discord might be closed', {title: 'Statusify', type: 'error'}).catch(error);
			break;
		default:
			message('Unknown error', {title: 'Statusify', type: 'error'}).catch(error);
	}
}
