import React, {useEffect} from 'react';
import {
	Button, Chip,
} from '@nextui-org/react';
import {useTauriContext} from '@/context';
import {isFormCorrect, startIpc, stopIpc} from '@/lib';
import {type ColorBrand} from '@/types';
import {useTranslation} from 'react-i18next';
import {appWindow} from '@tauri-apps/api/window';
import {default as AppTitleBar} from 'frameless-titlebar-fork';
import {SettingsButton} from '.';
import {debug} from 'tauri-plugin-log-api';

export default function TitleBar() {
	const {isSessionRunning, setIsSessionRunning, ipcProps, osType} = useTauriContext();

	const {t: rpcHandlerTranslator} = useTranslation('lib-rpc-handle');
	const {t} = useTranslation('cpt-menubar');

	type Platform = 'win32' | 'linux' | 'darwin';

	const [maximized, setMaximized] = React.useState<boolean>(false);
	const [platform, setPlatform] = React.useState<Platform | undefined>('darwin');

	const buttonDisabled = isSessionRunning || !ipcProps.id || !isFormCorrect(ipcProps);

	const indicatorColor = isSessionRunning ? 'success' : 'warning' as ColorBrand;
	const indicatorText = isSessionRunning ? t('lbl-status-playing') : t('lbl-status-idle');
	const [showLoading, setShowLoading] = React.useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const unlisten = await appWindow.onResized(async () => {
				const isMaximized = await appWindow.isMaximized();
				setMaximized(isMaximized);
			});
			return () => {
				unlisten();
			};
		})();
	}, []);

	useEffect(() => {
		switch (osType) {
			case 'Darwin':
				setPlatform('darwin');
				break;
			case 'Windows_NT':
				setPlatform('win32');
				break;
			case 'Linux':
				setPlatform('linux');
				break;
			default:
				setPlatform('darwin');
				break;
		}
	}, [osType]);

	useEffect(() => {
		const titlebar = document.querySelector('.statusify-titlebar');
		if (titlebar) {
			const elements = titlebar.querySelectorAll('*');
			elements.forEach(element => {
				if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
					return;
				}

				element.setAttribute('data-tauri-drag-region', 'true');
			});
		}
	}, []);

	return (
		<div className={'statusify-titlebar *:cursor-default *:select-none'}>
			<AppTitleBar
				platform={platform}
				title='Statusify'
				theme={{
					bar: {
						background: '#006FEE',
						height: '50px',
						borderBottom: 'none',
						title: {
							align: platform === 'darwin' ? 'center' : 'left',
						},
					},
					controls: {
						border: 'none',
						layout: 'right',
						normal: {
							default: {
								color: 'inherit',
								background: 'transparent',
							},
							hover: {
								color: '#fff',
								background: 'rgba(255,255,255,0.3)',
							},
						},
						close: {
							default: {
								color: 'inherit',
								background: 'transparent',
							},
							hover: {
								color: '#fff',
								background: '#e81123',
							},
						},
					},
				}}
				onMinimize={() => {
					void appWindow.minimize();
				}}
				maximized={maximized}
				onMaximize={() => {
					if (maximized) {
						void appWindow.unmaximize();
					} else {
						void appWindow.maximize();
					}
				}}
				onClose={() => {
					void appWindow.hide();
				}}
			>
				<Chip className='border-0 text-white' color={indicatorColor} variant='dot'>{indicatorText}</Chip>
				<div className='flex gap-4 items-center'>
					<SettingsButton />
					{!isSessionRunning && <Button disableRipple radius='sm' className='w-20 bg-white text-[#006FEE]' variant='solid' size='sm' isDisabled={buttonDisabled} isLoading={showLoading} onClick={
						async () => {
							setShowLoading(true);
							const isSuccess = await startIpc(rpcHandlerTranslator, ipcProps);
							if (isSuccess) {
								setIsSessionRunning(true);
							}

							setShowLoading(false);
						}
					} >
						{t('btn-start')}
					</Button>}
					{isSessionRunning && <Button disableRipple radius='sm' className='w-20' variant='solid' color='danger' size='sm' isLoading={showLoading} onClick={
						async () => {
							setShowLoading(true);
							const stopApproved = await stopIpc(rpcHandlerTranslator);
							if (stopApproved) {
								setIsSessionRunning(false);
							}

							setShowLoading(false);
						}
					} >
						{t('btn-stop')}
					</Button>}
				</div>
			</AppTitleBar>
		</div>
	);
}
