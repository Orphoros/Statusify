import React, {useLayoutEffect} from 'react';
import {appWindow} from '@tauri-apps/api/window';
import {attachConsole, debug, error, info} from 'tauri-plugin-log-api';
import {MainView} from '@/views';
import {invoke} from '@tauri-apps/api';
import {useTauriContext} from '@/context';

function App() {
	const {setIsDiscordRunning, setIsSessionRunning, ipcProps, setIpcProps} = useTauriContext();
	const ipcCheckInterval = 500;

	const disableMenu = () => {
		window.addEventListener('contextmenu', e => {
			e.preventDefault();
		}, false);
	};

	const checkDiscordRunning = () => {
		invoke('is_discord_running')
			.then(result => {
				const isRunning = result as boolean;
				setIsDiscordRunning(isRunning);
				if (!isRunning) {
					setIsSessionRunning(false);
				}
			})
			.catch(async err => {
				setIsDiscordRunning(false);
				void error(`error while checking Discord's status: ${err as string}`);
			});
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

	useLayoutEffect(() => {
		void debug('initializing GUI...');

		const init = async () => {
			await attachConsole();

			checkDiscordRunning();

			setInterval(async () => {
				checkDiscordRunning();
			}, ipcCheckInterval);

			disableMenu();

			correctIpcTime();

			await appWindow.show().catch(async () => {
				await error('failed to show window');
			});

			void info('app initialized');
		};

		init().catch(console.error);
	}, []);

	return (
		<MainView />
	);
}

export default App;
