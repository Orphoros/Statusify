import React, {useEffect} from 'react';
import {
	debug, error, info,
	warn,
} from 'tauri-plugin-log-api';
import {useTauriContext} from '@/context';
import {startIpc} from '@/lib';
import {listen} from '@tauri-apps/api/event';
import {basename, join, resolveResource} from '@tauri-apps/api/path';
import i18n, {type Resource} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {ErrorView, LoadingView, MainView} from '@/views';
import {readTextFile} from '@tauri-apps/api/fs';
import localeCode from 'locale-code';
import {systemLocale} from '@/systemLocale';
import {locale as sysLocale} from '@tauri-apps/api/os';

function App() {
	const {ipcProps, setIpcProps, launchConfProps, setIsSessionRunning} = useTauriContext();
	const [appReady, setAppReady] = React.useState<boolean>(false);
	const [appError, setAppError] = React.useState<string | undefined>(undefined);

	const registerHandlers = () => {
		window.addEventListener('error', event => {
			void error(`fatal unhandled error: ${event.message}`);
			setAppError('unhandled_error');
		});

		window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
			void error(`fatal unhandled promise rejection: ${event.reason}`);
			setAppError('unhandled_promise_rejection');
		});
	};

	const disableDefaultContextMenu = () => {
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

			if (startTime.getTime() > today.getTime()) {
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
				if (!i18n.isInitialized) {
					void error('i18n not initialized when trying to start ipc on launch');
					setAppError('locale_not_initialized');
				}

				const rpcHandlerTranslator = i18n.getFixedT('lib-rpc-handle');
				const isSuccess = await startIpc(rpcHandlerTranslator, ipcProps, true);
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

	const initializeLocales = async () => {
		try {
			const manifestPath = await join('locales', 'Manifest.txt');
			const localeFileList = await resolveResource(manifestPath);
			const localeFileListContent = await readTextFile(localeFileList);
			const resolvedLocaleFiles = await Promise.all(localeFileListContent.split('\n').filter(file => file !== '')
				.map(file => file.replace('.json', ''))
				.map(async locale => resolveResource(await join('locales', `${locale}.json`))));

			const localeFileContents = await Promise.all(resolvedLocaleFiles.map(async file => readTextFile(file).catch(e => {
				void error(`failed to read locale file: ${e}`);
				return '';
			})));

			const resources: Resource = (await Promise.all(localeFileContents.map(async (content: string, index: number) => {
				const localeFileName = await basename(resolvedLocaleFiles[index]);
				const locale = localeFileName.replace('.json', '');
				if (locale === undefined) {
					void warn(`could not parse locale from file path: ${resolvedLocaleFiles[index]}`);
					return {} satisfies Resource;
				}

				if (!localeCode.validate(locale)) {
					void warn(`invalid locale id found: ${locale}`);
					return {} satisfies Resource;
				}

				if (localeCode.getLanguageCode(locale) === 'en') {
					void warn('system default locale, english, cannot be overridden');
					return {} satisfies Resource;
				}

				try {
					return {
						[localeCode.getLanguageCode(locale)]: JSON.parse(content) as Resource,
					};
				} catch (e) {
					void error(`could not parse locale file '${resolvedLocaleFiles[index]}': ${e}`);
					return {} satisfies Resource;
				}
			}))).reduce<Resource>((acc: Resource, val: Resource) => ({...acc, ...val}), {});

			resources.en = systemLocale;

			void debug(`loaded {${Object.keys(resources).join(', ')}} locales`);

			const osLocale = await sysLocale();
			if (osLocale) {
				void debug(`system locale: ${osLocale} - ${localeCode.getLanguageCode(osLocale)}`);
			} else {
				void warn('could not determine system locale');
			}

			const preferredLocale = launchConfProps.locale ?? 'en-US';

			i18n
				.use(initReactI18next)
				.init({
					resources,
					lng: localeCode.getLanguageCode(preferredLocale),
					fallbackLng: 'en',
					interpolation: {
						escapeValue: false,
					},
				})
				.then(() => {
					void info('i18n initialized');
					setAppReady(true);
					setAppError(undefined);
				})
				.catch(e => {
					void error(`failed to initialize i18n: ${e}`);
				});
		} catch (e) {
			void error(`could not initialize locales: ${e}`);
			setAppError('locale_init_failed');
		}
	};

	useEffect(() => {
		(async () => {
			void initializeLocales();

			registerHandlers();

			disableDefaultContextMenu();

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

	return (<>
		{appReady && appError === undefined
			? <MainView/>
			: appError === undefined ? <LoadingView/> : <ErrorView error={appError}/>
		}
	</>);
}

export default App;
