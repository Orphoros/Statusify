import React, {useLayoutEffect} from 'react';
import {attachConsole, debug, error, info} from 'tauri-plugin-log-api';
import {listen} from '@tauri-apps/api/event';
import {MainView} from '@/views';
import {useTauriContext} from '@/context';
import {invoke} from '@tauri-apps/api/tauri';

function App() {
	const {setIsDiscordRunning, setIsSessionRunning, ipcProps, setIpcProps} = useTauriContext();

	const disableMenu = () => {
		window.addEventListener('contextmenu', e => {
			e.preventDefault();
		}, false);
	};

	const checkDiscordRunning = async () => {
		invoke('is_discord_running')
			.then(result => {
				const isRunning = result as boolean;
				setIsDiscordRunning(isRunning);
				void debug(`found client on startup: ${isRunning}`);
				if (!isRunning) {
					setIsSessionRunning(false);
				}
			})
			.catch(async err => {
				setIsDiscordRunning(false);
				void error(`error while checking client's status: ${err as string}`);
			});

		await listen('discord-state-change', event => {
			const isRunning = event.payload as boolean;
			void debug(`client state changed to: ${isRunning}`);
			setIsDiscordRunning(isRunning);
			if (!isRunning) {
				setIsSessionRunning(false);
			}
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
		void debug('initializing app...');

		const init = async () => {
			await attachConsole();

			await checkDiscordRunning();

			disableMenu();

			correctIpcTime();

			void info('app initialized');
		};

		init().catch(console.error);
	}, []);

	return (
		<MainView />
	);
}

export default App;
