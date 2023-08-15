import React, {useEffect, useMemo, useState} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput} from '@/lib';

type ImageOptionProps = {
	enabled: boolean;
	onImageChange?: (largeImageName: string, smallImageName: string, largeImageEnabled: boolean, smallImageEnabled: boolean) => void;
	onTooltipChange?: (largeImageTooltip: string, smallImageTooltip: string, largeImageTooltipEnabled: boolean, smallImageTooltipEnabled: boolean) => void;
	onError?: (largeImageTooltipError: boolean, smallImageTooltipError: boolean) => void;
};

export default function ImageOptionForm(prop: ImageOptionProps) {
	const {onImageChange, onTooltipChange, onError, enabled} = prop;

	const [largeImageEnabled, setLargeImageEnabled] = useState<boolean>(false);
	const [smallImageEnabled, setSmallImageEnabled] = useState<boolean>(false);
	const [largeImageName, setLargeImageName] = useState<string>('');
	const [smallImageName, setSmallImageName] = useState<string>('');
	const [largeImageTooltipEnabled, setLargeImageTooltipEnabled] = useState<boolean>(false);
	const [smallImageTooltipEnabled, setSmallImageTooltipEnabled] = useState<boolean>(false);
	const [largeImageTooltip, setLargeImageTooltip] = useState<string>('');
	const [smallImagTooltip, setSmallImageTooltip] = useState<string>('');

	const largeImageTooltipHelper = useMemo(() => validateTextInput(largeImageTooltip, 20), [largeImageTooltip]);
	const smallImageTooltipHelper = useMemo(() => validateTextInput(smallImagTooltip, 20), [smallImagTooltip]);

	useEffect(() => {
		if (onImageChange) {
			onImageChange(largeImageName, smallImageName, largeImageEnabled, smallImageEnabled);
		}

		if (onTooltipChange) {
			onTooltipChange(largeImageTooltip, smallImagTooltip, largeImageTooltipEnabled, smallImageTooltipEnabled);
		}

		if (onError) {
			onError(largeImageTooltipHelper.error, smallImageTooltipHelper.error);
		}
	}, [
		largeImageEnabled,
		smallImageEnabled,
		largeImageName,
		smallImageName,
		largeImageTooltipEnabled,
		smallImageTooltipEnabled,
		largeImageTooltip,
		smallImagTooltip,
		largeImageTooltipHelper.error,
		smallImageTooltipHelper.error,
	]);

	return (<>
		<p>Image Settings</p>
		<p className='text-primary-500 text-sm'>Large Image Settings</p>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				isClearable
				placeholder='large image resource name'
				className='h-14'
				color='primary'
				width='100%'
				isDisabled={!enabled}
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
						<span className='text-default-400 text-small'>name</span>
					</div>
				}
				onClear={() => {
					setLargeImageName('');
					setLargeImageEnabled(false);
				}}
				onChange={e => {
					const {value} = e.target;
					setLargeImageName(value);
					if (containsText(value)) {
						setLargeImageEnabled(true);
					} else {
						setLargeImageEnabled(false);
					}
				}}
			/>
			<Switch className='self-start mt-1' isSelected={largeImageEnabled} isDisabled={!enabled} onValueChange={setLargeImageEnabled}/>
		</div>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				isClearable
				placeholder='large image tooltip'
				className='h-14'
				errorMessage={largeImageTooltipHelper.text}
				color={largeImageTooltipHelper.color}
				width='100%'
				isDisabled={!largeImageEnabled || !enabled}
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
						<span className={`${largeImageTooltipHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>tooltip</span>
					</div>
				}
				onChange={e => {
					const {value} = e.target;
					setLargeImageTooltip(value);
					if (containsText(value)) {
						setLargeImageTooltipEnabled(true);
					} else {
						setLargeImageTooltipEnabled(false);
					}
				}}
			/>
			<div>
				<Switch className='self-start mt-1' isSelected={largeImageTooltipEnabled} isDisabled={!enabled || !largeImageEnabled} onValueChange={setLargeImageTooltipEnabled}/>
			</div>
		</div>
		<p className='text-primary-500 text-sm'>Small Image Settings</p>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				isClearable
				className='h-14'
				placeholder='small image resource name'
				color='primary'
				width='100%'
				isDisabled={!enabled || !largeImageEnabled}
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
						<span className='text-default-400 text-small'>name</span>
					</div>
				}
				onClear={() => {
					setSmallImageName('');
					setSmallImageEnabled(false);
				}}
				onChange={e => {
					const {value} = e.target;
					setSmallImageName(value);
					if (containsText(value)) {
						setSmallImageEnabled(true);
					} else {
						setSmallImageEnabled(false);
					}
				}}
			/>
			<Switch className='self-start mt-1' isSelected={smallImageEnabled} isDisabled={!enabled || !largeImageEnabled} onValueChange={setSmallImageEnabled}/>
		</div>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				isClearable
				placeholder='small image tooltip'
				className='h-14'
				width='100%'
				errorMessage={smallImageTooltipHelper.text}
				color={smallImageTooltipHelper.color}
				isDisabled={!largeImageEnabled || !smallImageEnabled || !enabled}
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
						<span className={`${smallImageTooltipHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>tooltip</span>
					</div>
				}
				onClear={() => {
					setSmallImageTooltip('');
					setSmallImageTooltipEnabled(false);
				}}
				onChange={e => {
					const {value} = e.target;
					setSmallImageTooltip(value);
					if (containsText(value)) {
						setSmallImageTooltipEnabled(true);
					} else {
						setSmallImageTooltipEnabled(false);
					}
				}}
			/>
			<Switch className='self-start mt-1' isSelected={smallImageTooltipEnabled} isDisabled={!largeImageEnabled || !enabled || !smallImageEnabled} onValueChange={setSmallImageTooltipEnabled}/>
		</div>
	</>
	);
}
