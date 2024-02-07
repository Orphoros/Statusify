import React, {useEffect, useMemo} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput} from '@/lib';
import {useTauriContext} from '@/context';

export default function ImageOptionForm() {
	const {ipcProps, setIpcProps} = useTauriContext();

	const largeImageTooltipHelper = useMemo(() => validateTextInput(ipcProps.largeImageTooltip, 20), [ipcProps.largeImageTooltip]);
	const smallImageTooltipHelper = useMemo(() => validateTextInput(ipcProps.smallImageTooltip, 20), [ipcProps.smallImageTooltip]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, largeImageTooltipError: largeImageTooltipHelper.error, smallImageTooltipError: smallImageTooltipHelper.error}));
	}, [largeImageTooltipHelper.error, smallImageTooltipHelper.error]);

	return (
		<div>
			<p>Image Settings</p>
			<p className='text-primary-500 text-sm mb-5'>Large Image Settings</p>
			<div className='flex gap-6 mb-2'>
				<Input
					variant='bordered'
					isClearable
					placeholder='large image resource name'
					className='h-11'
					labelPlacement='outside'
					size='sm'
					color='primary'
					width='100%'
					value={ipcProps.largeImage}
					isDisabled={ipcProps.idError}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className='text-default-400 text-small'>name</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, largeImage: '', largeImageEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, largeImage: e.target.value, largeImageEnabled: containsText(e.target.value)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.largeImageEnabled} isDisabled={ipcProps.idError} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, largeImageEnabled: enabled}));
					}
				}/>
			</div>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					isClearable
					placeholder='large image tooltip'
					className='h-11'
					labelPlacement='outside'
					size='sm'
					errorMessage={largeImageTooltipHelper.text}
					color={largeImageTooltipHelper.color}
					width='100%'
					value={ipcProps.largeImageTooltip}
					isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`${largeImageTooltipHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>tooltip</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, largeImageTooltip: '', largeImageTooltipEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, largeImageTooltip: e.target.value, largeImageTooltipEnabled: containsText(e.target.value)}));
					}}
				/>
				<div>
					<Switch className='self-start mt-0' isSelected={ipcProps.largeImageTooltipEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled} onValueChange={
						enabled => {
							setIpcProps(prev => ({...prev, largeImageTooltipEnabled: enabled}));
						}
					}/>
				</div>
			</div>
			<p className='text-primary-500 text-sm mb-5 mt-2'>Small Image Settings</p>
			<div className='flex gap-6 mb-2'>
				<Input
					variant='bordered'
					isClearable
					className='h-11'
					labelPlacement='outside'
					size='sm'
					placeholder='small image resource name'
					color='primary'
					width='100%'
					value={ipcProps.smallImage}
					isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className='text-default-400 text-small'>name</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, smallImage: '', smallImageEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, smallImage: e.target.value, smallImageEnabled: containsText(e.target.value)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.smallImageEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, smallImageEnabled: enabled}));
					}
				}/>
			</div>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					isClearable
					placeholder='small image tooltip'
					className='h-11'
					labelPlacement='outside'
					size='sm'
					width='100%'
					errorMessage={smallImageTooltipHelper.text}
					color={smallImageTooltipHelper.color}
					value={ipcProps.smallImageTooltip}
					isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled || !ipcProps.smallImageEnabled}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`${smallImageTooltipHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>tooltip</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, smallImageTooltip: '', smallImageTooltipEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, smallImageTooltip: e.target.value, smallImageTooltipEnabled: containsText(e.target.value)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.smallImageTooltipEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled || !ipcProps.smallImageEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, smallImageTooltipEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
