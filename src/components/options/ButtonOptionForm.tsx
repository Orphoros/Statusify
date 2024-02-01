import React, {useEffect, useMemo} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput, validateUrlInput} from '@/lib';
import {useTauriContext} from '@/context';

export default function ButtonOptionForm() {
	const {ipcProps, setIpcProps} = useTauriContext();

	const buttonUrlHelper = useMemo(() => validateUrlInput(ipcProps.buttonUrl), [ipcProps.buttonUrl]);
	const buttonTextHelper = useMemo(() => validateTextInput(ipcProps.buttonText, 20), [ipcProps.buttonText]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, buttonError: buttonUrlHelper.error || buttonTextHelper.error}));
	}, [buttonUrlHelper.error, buttonTextHelper.error]);

	return (
		<div>
			<p>Button Settings</p>
			<p className='text-primary-500 text-sm'>Button</p>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					placeholder='button text'
					isClearable
					width='100%'
					className='h-14'
					errorMessage={buttonTextHelper.text}
					color={buttonTextHelper.color}
					isDisabled={ipcProps.idError}
					defaultValue={ipcProps.buttonText}
					onClear={() => {
						setIpcProps(prev => ({...prev, buttonText: '', buttonEnabled: false}));
					}}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-16'>
							<span className={`${buttonTextHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>label</span>
						</div>
					}
					onChange={e => {
						setIpcProps(prev => ({...prev, buttonText: e.target.value, buttonEnabled: containsText(e.target.value) && containsText(ipcProps.buttonUrl)}));
					}}
				/>
				<Input
					variant='bordered'
					isClearable
					width='100%'
					className='h-16'
					color={buttonUrlHelper.color}
					errorMessage={buttonUrlHelper.text}
					isDisabled={ipcProps.idError}
					value={ipcProps.buttonUrl}
					onClear={() => {
						setIpcProps(prev => ({...prev, buttonUrl: '', buttonEnabled: false}));
					}}
					startContent={
						<div className='pointer-events-none flex items-center w-16'>
							<span className={`${buttonUrlHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{ipcProps.buttonProtocol}</span>
						</div>
					}
					onChange={e => {
						const {value} = e.target;
						let protocol = ipcProps.buttonProtocol;

						if (value.includes('http://') || value.includes('https://')) {
							protocol = value.split('://')[0] + '://';
						}

						const url = value.replace('http://', '').replace('https://', '');

						setIpcProps(prev => ({...prev, buttonProtocol: protocol, buttonUrl: url, buttonEnabled: containsText(value) && containsText(ipcProps.buttonText)}));
					}}
				/>
				<Switch className='self-start mt-4' isSelected={ipcProps.buttonEnabled} isDisabled={ipcProps.idError} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, buttonEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
