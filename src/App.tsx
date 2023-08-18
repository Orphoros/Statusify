import React, {useLayoutEffect, useState} from 'react';
import {appWindow} from '@tauri-apps/api/window';
import {attachConsole, debug, error, info} from 'tauri-plugin-log-api';
import {MainView} from '@/views';
import {invoke} from '@tauri-apps/api';
import {AppContext} from '@/context';
import {type IpcProps} from '@/types';

function App() {
	const [isDiscordRunning, setIsDiscordRunning] = useState<boolean>(false);
	const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
	const [ipcProps, setIpcProps] = useState<IpcProps>({});

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

	useLayoutEffect(() => {
		void debug('initializing GUI...');

		const init = async () => {
			await attachConsole();

			checkDiscordRunning();

			setInterval(async () => {
				checkDiscordRunning();
			}, ipcCheckInterval);

			disableMenu();

			await appWindow.show().catch(async () => {
				await error('failed to show window');
			});

			void info('app initialized');
		};

		init().catch(console.error);
	}, []);

	return (
		<AppContext.Provider value={{
			isDiscordRunning,
			setIsDiscordRunning,
			isSessionRunning,
			setIsSessionRunning,
			ipcProps,
			setIpcProps,
		}}>
			<MainView />
		</AppContext.Provider>
	);
}

export default App;
