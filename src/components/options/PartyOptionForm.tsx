import React, {useEffect, useMemo} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {validateNumberInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {showMenu} from 'tauri-plugin-context-menu';

export default function PartyOptionForm() {
	const {osType, setIsSessionRunning, isSessionRunning, ipcProps, setIpcProps} = useTauriContext();

	const minHelper = useMemo(() => validateNumberInput({text: ipcProps.partySize?.toString(), min: 1, max: 100}), [ipcProps.partySize]);
	const maxHelper = useMemo(() => validateNumberInput({text: ipcProps.partyMax?.toString(), min: 1, max: 100}), [ipcProps.partyMax]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, partyError: minHelper.error || maxHelper.error}));
	}, [minHelper.error, maxHelper.error]);

	return (
		<div>
			<p className='mb-5'>Party Settings</p>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					label='Current'
					placeholder='0'
					defaultValue={ipcProps.partySize?.toString()}
					errorMessage={minHelper.text}
					color={minHelper.color}
					isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled}
					className='h-11'
					labelPlacement='outside'
					size='sm'
					width='100%'
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, partyEnabled: !ipcProps.partyEnabled}));
							})
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, partySize: parseInt(e.target.value, 10), partyEnabled: e.target.value.isInteger()}));
					}}
				/>
				<Input
					variant='bordered'
					label='Max'
					placeholder='0'
					defaultValue={ipcProps.partyMax?.toString()}
					errorMessage={maxHelper.text}
					color={maxHelper.color}
					isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled}
					className='h-11'
					labelPlacement='outside'
					size='sm'
					width='100%'
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, partyEnabled: !ipcProps.partyEnabled}));
							})
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, partyMax: parseInt(e.target.value, 10), partyEnabled: e.target.value.isInteger()}));
					}}
				/>

				<Switch className='self-start mt-6' isSelected={ipcProps.partyEnabled} isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, partyEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
