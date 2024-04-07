import React, {useEffect} from 'react';
import {debug, error, info} from 'tauri-plugin-log-api';
import {MainView} from '@/views';
import {useTauriContext} from '@/context';
import {startIpc} from './lib';

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
			const time = new Date(ipcProps.timeAsStart);
			const today = new Date();

			if (time.getTime() < Date.now() - 86400000) {
				time.setFullYear(today.getFullYear());
				time.setMonth(today.getMonth());
				time.setDate(today.getDate());
				void debug(`corrected cached ipc date to ${time.toISOString()}`);
			}

			if (time.getTime() > Date.now()) {
				time.setDate(time.getDate() - 1);
				void debug(`corrected cached ipc time to ${time.toISOString()} to prevent future date`);
			}

			setIpcProps(prev => ({...prev, timeAsStart: time.getTime()}));
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

			void info('app initialized');
		})();
	}, []);

	return (
		<MainView/>
	);
}

export default App;
