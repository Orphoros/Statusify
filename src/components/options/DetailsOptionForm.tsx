import React, {useMemo, useEffect} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput} from '@/lib';
import {useTauriContext} from '@/context';

export default function DetailsOptionForm() {
	const {ipcProps, setIpcProps} = useTauriContext();

	const detailsHelper = useMemo(() => validateTextInput(ipcProps.details, 35), [ipcProps.details]);
	const stateHelper = useMemo(() => validateTextInput(ipcProps.state, 20), [ipcProps.state]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, detailsError: detailsHelper.error, stateError: stateHelper.error}));
	}, [detailsHelper.error, stateHelper.error]);

	return (
		<div>
			<p className='mb-5'>Main Settings</p>
			<div className='flex gap-6 mb-2'>
				<Input
					variant='bordered'
					className='h-11'
					size='sm'
					isClearable
					placeholder='main cation'
					value={ipcProps.details}
					width='100%'
					labelPlacement='outside'
					errorMessage={detailsHelper.text}
					color={detailsHelper.color}
					isDisabled={ipcProps.idError}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`${detailsHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>details</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, details: '', detailsEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, details: e.target.value, detailsEnabled: containsText(e.target.value), stateEnabled: containsText(ipcProps.state)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.detailsEnabled} isDisabled={ipcProps.idError} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, detailsEnabled: enabled}));
					}
				}/>
			</div>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					className='h-11'
					size='sm'
					isClearable
					value={ipcProps.state}
					placeholder='the current state'
					errorMessage={stateHelper.text}
					color={stateHelper.color}
					width='100%'
					labelPlacement='outside'
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`${stateHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>state</span>
						</div>
					}
					isDisabled={ipcProps.idError! || !ipcProps.detailsEnabled || !containsText(ipcProps.details)}
					onClear={() => {
						setIpcProps(prev => ({...prev, state: '', stateEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, state: e.target.value, stateEnabled: containsText(e.target.value)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.stateEnabled} isDisabled={ipcProps.idError! || !ipcProps.detailsEnabled || !containsText(ipcProps.details)} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, stateEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
