import React, {useLayoutEffect, useState} from 'react';
import {NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import TauriProvider from './TauriProvider';
import {type OsType, type} from '@tauri-apps/api/os';
import {
	attachConsole, debug,
	error,
} from 'tauri-plugin-log-api';
import {invoke, os} from '@tauri-apps/api';
import {join, resolveResource} from '@tauri-apps/api/path';
import {readTextFile} from '@tauri-apps/api/fs';
import localeCode from 'locale-code';

export default function AppProvider({children}: {children: React.ReactNode}) {
	const [platformName, setPlatformName] = useState<OsType | undefined>(undefined);
	const [locales, setLocales] = useState<string[]>(['en-US']);

	const getLocales = async () => {
		try {
			const newLine = await os.type() === 'Windows_NT' ? '\r\n' : '\n';
			const manifestPath = await join('locales', 'Manifest.txt');
			const localeFileList = await resolveResource(manifestPath);
			const localeFileListContent = await readTextFile(localeFileList);

			const resolvedLocaleFiles = await Promise.all(localeFileListContent.split(newLine).filter(file => file !== '')
				.map(file => file.replace('.json', '').trim())
				.filter(file => localeCode.validate(file)));

			setLocales(['en-US', ...resolvedLocaleFiles]);
		} catch (e) {
			void error(`failed to load locales for language selection list: ${e}`);
		}
	};

	useLayoutEffect(() => {
		(async () => {
			const detachConsole = await attachConsole();

			void debug('initializing app...');

			const platformName = await type();

			await getLocales();

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
					<TauriProvider osType={platformName} locales={locales}>
						{children}
					</TauriProvider>
				</NextThemesProvider>
			</NextUIProvider>
		</div>
	);
}
