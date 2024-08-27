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
import {MudaTitlebar} from './muda';

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
		const titlebar = document.querySelector('.style_Bar__nNJjZ');
		if (titlebar) {
			titlebar.setAttribute('data-tauri-drag-region', 'true');
		}
	}, []);

	return (
		<MudaTitlebar osType={osType!}>
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
		</MudaTitlebar>
	);
}
