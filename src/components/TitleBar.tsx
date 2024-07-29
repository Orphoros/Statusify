import React from 'react';
import {Button, Checkbox, Chip} from '@nextui-org/react';
import {enable, isEnabled, disable} from 'tauri-plugin-autostart-api';
import {useTauriContext} from '@/context';
import {isFormCorrect, startIpc, stopIpc} from '@/lib';
import {type ColorBrand} from '@/types';
import {error, debug} from 'tauri-plugin-log-api';

export default function TitleBar() {
	const {isSessionRunning, setIsSessionRunning, ipcProps, showVibrancy, launchConfProps, setLaunchConfProps} = useTauriContext();

	const buttonDisabled = isSessionRunning || !ipcProps.id || !isFormCorrect(ipcProps);

	const indicatorColor = isSessionRunning ? 'success' : 'warning' as ColorBrand;
	const indicatorText = isSessionRunning ? 'Displaying activity' : 'Idle';
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
				Autostart status on app launch
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
				Start app with system
				</Checkbox>
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
					Start
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
					Stop
				</Button>}
			</div>
		</div>
	);
}
