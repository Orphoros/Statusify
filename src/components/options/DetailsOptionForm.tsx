import React, {useState, useMemo, useEffect} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput} from '@/lib';

type DetailsOptionProps = {
	onChange?: (details: string, state: string, detailsEnabled: boolean, stateEnabled: boolean) => void;
	onError?: (detailsError: boolean, stateError: boolean) => void;
	enabled: boolean;
};

export default function DetailsOptionForm(props: DetailsOptionProps) {
	const {onChange, onError, enabled} = props;

	const [detailsEnabled, setDetailsEnabled] = useState<boolean>(false);
	const [stateEnabled, setStateEnabled] = useState<boolean>(false);
	const [details, setDetails] = useState<string>('');
	const [state, setState] = useState<string>('');

	const detailsHelper = useMemo(() => validateTextInput(details, 35), [details]);
	const stateHelper = useMemo(() => validateTextInput(state, 20), [state]);

	useEffect(() => {
		if (onChange) {
			onChange(details, state, detailsEnabled, stateEnabled);
		}

		if (onError) {
			onError(detailsHelper.error, stateHelper.error);
		}
	}, [detailsEnabled, stateEnabled, details, state, detailsHelper.error]);

	return (<>
		<p>Main Settings</p>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				className='h-14'
				isClearable
				placeholder='main cation'
				width='100%'
				errorMessage={detailsHelper.text}
				color={detailsHelper.color}
				isDisabled={!enabled}
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
						<span className={`${detailsHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>details</span>
					</div>
				}
				onClear={() => {
					setDetails('');
					setDetailsEnabled(false);
				}}
				onChange={e => {
					const {value} = e.target;
					setDetails(value);
					if (containsText(value)) {
						setDetailsEnabled(true);
						if (containsText(state)) {
							setStateEnabled(true);
						} else {
							setStateEnabled(false);
						}
					} else {
						setDetailsEnabled(false);
						setStateEnabled(false);
					}
				}}
			/>
			<Switch className='self-start mt-1' isSelected={detailsEnabled} isDisabled={!enabled} onValueChange={setDetailsEnabled}/>
		</div>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				className='h-14'
				isClearable
				placeholder='the current state'
				errorMessage={stateHelper.text}
				color={stateHelper.color}
				width='100%'
				startContent={
					<div className='pointer-events-none flex shrink-0 items-center w-16'>
						<span className={`${stateHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>state</span>
					</div>
				}
				isDisabled={!enabled || !detailsEnabled}
				onClear={() => {
					setState('');
					setStateEnabled(false);
				}}
				onChange={e => {
					const {value} = e.target;
					setState(value);
					if (containsText(value)) {
						setStateEnabled(true);
					} else {
						setStateEnabled(false);
					}
				}}
			/>
			<Switch className='self-start mt-1' isSelected={stateEnabled} isDisabled={!enabled || !detailsEnabled} onValueChange={setStateEnabled}/>
		</div>
	</>
	);
}
