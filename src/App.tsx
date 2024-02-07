import React, {useLayoutEffect} from 'react';
import {attachConsole, debug, info} from 'tauri-plugin-log-api';
import {MainView} from '@/views';
import {useTauriContext} from '@/context';

function App() {
	const {ipcProps, setIpcProps} = useTauriContext();

	const disableMenu = () => {
		window.addEventListener('contextmenu', e => {
			e.preventDefault();
		}, false);
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
