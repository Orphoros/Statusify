import React, {useEffect} from 'react';
import {debug, error, info} from 'tauri-plugin-log-api';
import {MainView} from '@/views';
import {useTauriContext} from '@/context';
import {startIpc} from './lib';
import {listen} from '@tauri-apps/api/event';

function App() {
	const {ipcProps, setIpcProps, launchConfProps, setIsSessionRunning} = useTauriContext();

	const disableMenu = () => {
		window.addEventListener('contextmenu', e => {
			e.preventDefault();
		}, false);

		return () => {
			window.removeEventListener('contextmenu', e => {
				e.preventDefault();
			}, false);
		};
	};

	const correctIpcTime = () => {
		if (ipcProps.timeAsStart !== undefined) {
			const startTime = new Date(ipcProps.timeAsStart);
			const today = new Date();
			const oneDayDurationMil = 86400000;

			if (startTime.getTime() < today.getTime() - oneDayDurationMil) {
				startTime.setUTCFullYear(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
				void debug(`corrected cached ipc date to ${startTime.toUTCString()}`);
			}

			if (startTime.getTime() >= today.getTime()) {
				startTime.setDate(startTime.getDate() - 1);
				void debug(`corrected cached ipc time to ${startTime.toUTCString()} to prevent future date`);
			}

			void debug(`setting ipc time to ${startTime.toUTCString()}`);

			setIpcProps(prev => ({...prev, timeAsStart: startTime.getTime()}));
		}
	};

	const initIpcOnLaunch = async () => {
		try {
			void debug('checking if ipc should start on launch');
			if (launchConfProps.startIpcOnLaunch) {
				const isSuccess = await startIpc(ipcProps, true);
				if (isSuccess) {
					setIsSessionRunning(true);
					void info('ipc started on launch');
				} else {
					void error('failed to start ipc on launch');
				}
			}
		} catch (e) {
			void error('failed to call startIpc on launch');
		} finally {
			void debug('ipc on launch finalized');
		}
	};

	useEffect(() => {
		(async () => {
			disableMenu();

			correctIpcTime();

			await initIpcOnLaunch();

			const unlisten = await listen('rpc-running-change', event => {
				const {running} = event.payload as {running: boolean};
				setIsSessionRunning(running);
			});

			void info('app initialized');

			return () => {
				unlisten();
			};
		})();
	}, []);

	return (
		<MainView/>
	);
}

export default App;
