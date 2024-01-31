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
	}, [detailsHelper.error, detailsHelper.error]);

	return (<div>
		<p>Main Settings</p>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				className='h-14'
				isClearable
				placeholder='main cation'
				defaultValue={ipcProps.details}
				width='100%'
				errorMessage={detailsHelper.text}
				color={detailsHelper.color}
				isDisabled={ipcProps.idError}
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
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
			<Switch className='self-start mt-4' isSelected={ipcProps.detailsEnabled} isDisabled={ipcProps.idError} onValueChange={
				enabled => {
					setIpcProps(prev => ({...prev, detailsEnabled: enabled}));
				}
			}/>
		</div>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				className='h-14'
				isClearable
				defaultValue={ipcProps.state}
				placeholder='the current state'
				errorMessage={stateHelper.text}
				color={stateHelper.color}
				width='100%'
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
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
			<Switch className='self-start mt-4' isSelected={ipcProps.stateEnabled} isDisabled={ipcProps.idError! || !ipcProps.detailsEnabled || !containsText(ipcProps.details)} onValueChange={
				enabled => {
					setIpcProps(prev => ({...prev, stateEnabled: enabled}));
				}
			}/>
		</div>
	</div>
	);
}
