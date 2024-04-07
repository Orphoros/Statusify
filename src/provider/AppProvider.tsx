import React, {useLayoutEffect, useState} from 'react';
import {NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import TauriProvider from './TauriProvider';
import {type OsType, type} from '@tauri-apps/api/os';
import {
	attachConsole, debug, error,
} from 'tauri-plugin-log-api';
import {invoke} from '@tauri-apps/api';

export default function AppProvider({children}: {children: React.ReactNode}) {
	const [platformName, setPlatformName] = useState<OsType | undefined>(undefined);
	useLayoutEffect(() => {
		(async () => {
			const detachConsole = await attachConsole();

			void debug('initializing app...');

			const platformName = await type();

			setPlatformName(platformName);

			void debug(`running on ${platformName}`);

			void invoke('show_main_window');

			detachConsole();
		})();
	}, []);

	return (
		<div className={platformName === 'Windows_NT' || platformName === 'Linux' ? 'bg-background' : ''}>
			<NextUIProvider>
				<NextThemesProvider attribute='class' defaultTheme='system'>
					<TauriProvider osType={platformName}>
						{children}
					</TauriProvider>
				</NextThemesProvider>
			</NextUIProvider>
		</div>
	);
}
