import React, {useEffect, useMemo, useState} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput, validateUrlInput} from '@/lib';

type ButtonOptionProps = {
	enabled: boolean;
	onChange?: (text: string, url: string, protocol: string, enabled: boolean) => void;
	onError?: (buttonError: boolean) => void;
};

export default function ButtonOptionForm(props: ButtonOptionProps) {
	const {enabled, onChange, onError} = props;

	const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
	const [protocol, setProtocol] = useState<string>('https://');
	const [text, setText] = useState<string>('');
	const [url, setUrl] = useState<string>('');

	const buttonUrlHelper = useMemo(() => validateUrlInput(url), [url]);
	const buttonTextHelper = useMemo(() => validateTextInput(text, 20), [text]);

	useEffect(() => {
		if (onChange) {
			onChange(text, url, protocol, buttonEnabled);
		}

		if (onError) {
			onError(buttonUrlHelper.error || buttonTextHelper.error);
		}
	}, [text, url, protocol, buttonEnabled, buttonUrlHelper.error, buttonTextHelper.error]);

	return (<>
		<p>Button Settings</p>
		<p className='text-primary-500 text-sm'>Button</p>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				placeholder='button text'
				isClearable
				width='100%'
				className='h-14'
				errorMessage={buttonTextHelper.text}
				color={buttonTextHelper.color}
				isDisabled={!enabled}
				onClear={() => {
					setText('');
					setButtonEnabled(false);
				}}
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
						<span className={`${buttonTextHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>label</span>
					</div>
				}
				onChange={e => {
					const {value} = e.target;
					setText(value);
					if (containsText(value) && containsText(url)) {
						setButtonEnabled(true);
					} else {
						setButtonEnabled(false);
					}
				}}
			/>
			<Input
				variant='bordered'
				isClearable
				width='100%'
				className='h-16'
				color={buttonUrlHelper.color}
				errorMessage={buttonUrlHelper.text}
				isDisabled={!enabled}
				value={url}
				onClear={() => {
					setUrl('');
					setButtonEnabled(false);
				}}
				startContent={
					<div className='pointer-events-none flex items-center w-16'>
						<span className={`${buttonUrlHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{protocol}</span>
					</div>
				}
				onChange={e => {
					const {value} = e.target;
					if (value.includes('http://') || value.includes('https://')) {
						setProtocol(value.split('://')[0] + '://');
					}

					setUrl(value.replace('http://', '').replace('https://', ''));

					if (containsText(value) && containsText(text)) {
						setButtonEnabled(true);
					} else {
						setButtonEnabled(false);
					}
				}}
			/>
			<Switch className='self-start mt-1' isSelected={buttonEnabled} isDisabled={!enabled} onValueChange={setButtonEnabled}/>
		</div>
	</>
	);
}
