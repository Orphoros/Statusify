import React, {useLayoutEffect, useState} from 'react';
import {NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import TauriProvider from './TauriProvider';
import {type OsType, type} from '@tauri-apps/api/os';
import {
	attachConsole, debug, error, warn,
} from 'tauri-plugin-log-api';

export default function AppProvider({children}: {children: React.ReactNode}) {
	const [platformName, setPlatformName] = useState<OsType | undefined>(undefined);
	useLayoutEffect(() => {
		const init = async () => {
			await attachConsole();

			void debug('initializing app...');

			const platformName = await type();
			setPlatformName(platformName);
			void debug(`running on ${platformName}`);
			if (platformName === 'Windows_NT' || platformName === 'Darwin') {
				void debug('disabling window background to enable window vibrancy');
				const html = document.querySelector('html');
				if (html) {
					html.style.setProperty('background', 'transparent', 'important');
				}
			} else {
				void warn('running on unsupported OS for window vibrancy');
			}
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
