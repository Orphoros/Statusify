import {type IpcProps} from '@/types';
import {invoke} from '@tauri-apps/api';
import {ask, message} from '@tauri-apps/api/dialog';
import {debug, error} from 'tauri-plugin-log-api';
import {showButton, showCurrentTime, showDetails, showGivenTime, showLargeImage, showLargeImageText, showParty, showSmallImage, showSmallImageText, showState} from './props';

export async function startIpc(ipcProps: IpcProps): Promise<boolean> {
	void debug('Attempting to start RPC');

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

		void debug('Showing system notification for RPC creation success');
		message('RPC Started!', {title: 'Statusify', type: 'info'}).catch(error);

		return true;
	} catch (err) {
		void debug('Showing system notification for RPC creation failure');
		message(err as string, {title: 'Statusify', type: 'error'}).catch(error);

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
		void debug('showing system notification for RPC cancelation failure');
		message(err as string, {title: 'Statusify', type: 'error'}).catch(error);

		return true;
	}
}
