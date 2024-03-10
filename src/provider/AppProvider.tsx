import React, {useLayoutEffect, useState} from 'react';
import {NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import TauriProvider from './TauriProvider';
import {type OsType, type} from '@tauri-apps/api/os';
import {
	attachConsole, debug, error, warn,
} from 'tauri-plugin-log-api';
import {appWindow} from '@tauri-apps/api/window';

export default function AppProvider({children}: {children: React.ReactNode}) {
	const [platformName, setPlatformName] = useState<OsType | undefined>(undefined);
	useLayoutEffect(() => {
		const init = async () => {
			const detachConsole = await attachConsole();

			void debug('initializing app...');

			const platformName = await type();

			setPlatformName(platformName);
			void debug(`running on ${platformName}`);
			if (platformName === 'Darwin') {
				void debug('window vibrancy supported, keeping transparency');
			} else {
				void warn('running on unsupported OS for window vibrancy, disabling transparency');
				const html = document.querySelector('html');
				if (html) {
					html.style.removeProperty('background');
				}
			}

			void appWindow.show();

			detachConsole();
		};

		init().catch(error);
	}, []);

	return (
		<NextUIProvider>
			<NextThemesProvider attribute='class' defaultTheme='system'>
				<TauriProvider osType={platformName}>
					{children}
				</TauriProvider>
			</NextThemesProvider>
		</NextUIProvider>
	);
}
