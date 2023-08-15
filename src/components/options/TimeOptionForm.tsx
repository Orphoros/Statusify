import React, {useEffect, useState} from 'react';

import {Checkbox, Input, Switch} from '@nextui-org/react';

type TimeOptionProps = {
	enabled: boolean;
	onChange?: (time: Date, useCurrent: boolean, enabled: boolean) => void;
};

export default function TimeOptionForm(prop: TimeOptionProps) {
	const {onChange, enabled} = prop;

	const [time, setTime] = useState<Date>(new Date());
	const [timeEnabled, setTimeEnabled] = useState<boolean>(false);
	const [useCurrent, setUseCurrent] = useState<boolean>(true);

	useEffect(() => {
		if (onChange) {
			onChange(time, useCurrent, timeEnabled);
		}
	}, [time, useCurrent, timeEnabled]);

	return (<>
		<p>Timer Settings</p>
		<div className='flex gap-6 items-center'>
			<div className='flex flex-grow gap-3 items-center'>
				<p className='text-primary-500 text-sm'>Start from:</p>
				<Input
					variant='bordered'
					radius='full'
					type='time'
					color='primary'
					className='max-w-[5.2rem]'
					defaultValue={`${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()}`}
					isDisabled={!enabled || useCurrent}
					onChange={e => {
						const {value} = e.target;
						const [hour, minute] = value.split(':');
						const newTime = new Date();

						newTime.setHours(parseInt(hour, 10));
						newTime.setMinutes(parseInt(minute, 10));

						if (newTime.getTime() > Date.now()) {
							newTime.setDate(newTime.getDate() - 1);
						}

						setTime(newTime);
						setTimeEnabled(true);
					}}
				/>
				<Checkbox
					defaultSelected
					isDisabled={!enabled}
					isSelected={useCurrent}
					onValueChange={setUseCurrent}
					size='sm'
				>
					Use current time on start
				</Checkbox>
			</div>
			<Switch isSelected={timeEnabled} isDisabled={!enabled} onValueChange={setTimeEnabled}/>
		</div>
	</>
	);
}
