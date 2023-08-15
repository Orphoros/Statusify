import React, {useEffect, useMemo, useState} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {isDigit, validateNumberInput} from '@/lib';

type PartyOptionProps = {
	enabled: boolean;
	onChange?: (min: string, max: string, enabled: boolean) => void;
	onError?: (minError: boolean, maxError: boolean) => void;
};

export default function PartyOptionForm(prop: PartyOptionProps) {
	const {onChange, onError, enabled} = prop;

	const [min, setMin] = useState<string>('');
	const [max, setMax] = useState<string>('');
	const [partyEnabled, setPartyEnabled] = useState<boolean>(false);

	const minHelper = useMemo(() => validateNumberInput({text: min, min: 0, max: 100}), [min]);
	const maxHelper = useMemo(() => validateNumberInput({text: max, min: 0, max: 100}), [max]);

	useEffect(() => {
		if (onChange) {
			onChange(min, max, partyEnabled);
		}

		if (onError) {
			onError(minHelper.error, maxHelper.error);
		}
	}, [min, max, partyEnabled, minHelper.error, maxHelper.error]);

	return (<>
		<p>Party Settings</p>
		<div className='flex gap-6'>
			<Input
				variant='underlined'
				label='Current'
				placeholder='0'
				errorMessage={minHelper.text}
				color={minHelper.color}
				isDisabled={!enabled}
				className='h-20'
				width='100%'
				onChange={e => {
					const {value} = e.target;
					setMin(value);
					if (isDigit(value) && isDigit(max)) {
						setPartyEnabled(true);
					} else {
						setPartyEnabled(false);
					}
				}}
			/>
			<Input
				variant='underlined'
				label='Max'
				placeholder='0'
				errorMessage={maxHelper.text}
				color={maxHelper.color}
				isDisabled={!enabled}
				className='h-14'
				width='100%'
				onChange={e => {
					const {value} = e.target;
					setMax(value);
					if (isDigit(min) && isDigit(value)) {
						setPartyEnabled(true);
					} else {
						setPartyEnabled(false);
					}
				}}
			/>

			<Switch className='self-start mt-4' isSelected={partyEnabled} isDisabled={!enabled} onValueChange={setPartyEnabled}/>
		</div>
	</>
	);
}
