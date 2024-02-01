import React, {useEffect, useMemo} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {isDigit, validateNumberInput} from '@/lib';
import {useTauriContext} from '@/context';

export default function PartyOptionForm() {
	const {ipcProps, setIpcProps} = useTauriContext();

	const minHelper = useMemo(() => validateNumberInput({text: ipcProps.partySize?.toString(), min: 0, max: 100}), [ipcProps.partySize]);
	const maxHelper = useMemo(() => validateNumberInput({text: ipcProps.partyMax?.toString(), min: 0, max: 100}), [ipcProps.partyMax]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, partyError: minHelper.error || maxHelper.error}));
	}, [minHelper.error, maxHelper.error]);

	return (
		<div>
			<p>Party Settings</p>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					label='Current'
					placeholder='0'
					defaultValue={ipcProps.partySize?.toString()}
					errorMessage={minHelper.text}
					color={minHelper.color}
					isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled}
					className='h-20'
					width='100%'
					onChange={e => {
						setIpcProps(prev => ({...prev, partySize: parseInt(e.target.value, 10), partyEnabled: isDigit(e.target.value)}));
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
					className='h-20'
					width='100%'
					onChange={e => {
						setIpcProps(prev => ({...prev, partyMax: parseInt(e.target.value, 10), partyEnabled: isDigit(e.target.value)}));
					}}
				/>

				<Switch className='self-start mt-4' isSelected={ipcProps.partyEnabled} isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, partyEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
