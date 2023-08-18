import React from 'react';
import {Button, Chip} from '@nextui-org/react';
import {useTauriContext} from '@/context';
import {startIpc, stopIpc} from '@/lib';
import {type ColorBrand} from '@/types';

export default function TitleBar() {
	const {isDiscordRunning, isSessionRunning, setIsSessionRunning, ipcProps} = useTauriContext();

	const buttonDisabled = !isDiscordRunning || isSessionRunning || !ipcProps.id || ipcProps.idError;

	const indicatorColor = isDiscordRunning ? (isSessionRunning ? 'success' : 'warning') : 'danger' as ColorBrand;
	const indicatorText = isDiscordRunning ? (isSessionRunning ? 'Displaying activity' : 'Connected to Discord') : 'Disconnected from Discord';
	const [showLoading, setShowLoading] = React.useState<boolean>(false);

	return (
		<div className='p-2 m-0 bg-primary flex justify-between items-center'>
			<Chip className='border-0 text-white' color={indicatorColor} variant='dot'>{indicatorText}</Chip>
			{!isSessionRunning && <Button className='bg-white w-20 text-primary-400 disabled:bg-gray-300 disabled:text-gray-500' variant='solid' color='default' size='sm' disabled={buttonDisabled} isLoading={showLoading} onClick={
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
	);
}
