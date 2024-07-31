import React from 'react';
import {Button, Checkbox, Chip} from '@nextui-org/react';
import {enable, isEnabled, disable} from 'tauri-plugin-autostart-api';
import {useTauriContext} from '@/context';
import {isFormCorrect, startIpc, stopIpc} from '@/lib';
import {type ColorBrand} from '@/types';
import {error, debug} from 'tauri-plugin-log-api';
import {useTranslation} from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function TitleBar() {
	const {isSessionRunning, setIsSessionRunning, ipcProps, showVibrancy, launchConfProps, setLaunchConfProps} = useTauriContext();
	const {t} = useTranslation('cpt-menubar');

	const buttonDisabled = isSessionRunning || !ipcProps.id || !isFormCorrect(ipcProps);

	const indicatorColor = isSessionRunning ? 'success' : 'warning' as ColorBrand;
	const indicatorText = isSessionRunning ? t('lbl-status-playing') : t('lbl-status-idle');
	const [showLoading, setShowLoading] = React.useState<boolean>(false);

	return (
		<div className={`p-2 m-0 ${showVibrancy ? 'bg-content1 bg-opacity-50' : 'bg-content2'} flex justify-between items-center`}>
			<Chip className='border-0' color={indicatorColor} variant='dot'>{indicatorText}</Chip>
			<div className='flex gap-4'>
				<Checkbox
					isSelected={launchConfProps.startIpcOnLaunch}
					onValueChange={
						enabled => {
							setLaunchConfProps(prev => ({...prev, startIpcOnLaunch: enabled}));
						}
					}
				>
					{t('chk-rpc-autostart')}
				</Checkbox>
				<Checkbox
					isSelected={launchConfProps.startAppOnLaunch}
					onValueChange={
						async enabled => {
							setLaunchConfProps(prev => ({...prev, startAppOnLaunch: enabled}));
							isEnabled()
								.then(async sysStartEnabled => {
									try {
										if (enabled && !sysStartEnabled) {
											await enable();
											void debug('enabled autostart with the system');
										} else if (!enabled && sysStartEnabled) {
											await disable();
											void debug('disabled autostart with the system');
										}
									} catch (e) {
										void error('could set autostart with the system');
									}
								})
								.catch(async () => {
									void error('could not get autostart status');
								});
						}
					}
				>
					{t('chk-system-start')}
				</Checkbox>
				<LanguageSwitcher/>
				{!isSessionRunning && <Button className='w-20' variant='solid' color='primary' size='sm' isDisabled={buttonDisabled} isLoading={showLoading} onClick={
					async () => {
						setShowLoading(true);
						const isSuccess = await startIpc(ipcProps);
						if (isSuccess) {
							setIsSessionRunning(true);
						}

						setShowLoading(false);
					}
				} >
					{t('btn-start')}
				</Button>}
				{isSessionRunning && <Button className='w-20' variant='solid' color='danger' size='sm' isLoading={showLoading} onClick={
					async () => {
						setShowLoading(true);
						const stopApproved = await stopIpc();
						if (stopApproved) {
							setIsSessionRunning(false);
						}

						setShowLoading(false);
					}
				} >
					{t('btn-stop')}
				</Button>}
			</div>
		</div>
	);
}
