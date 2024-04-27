import React from 'react';

import {
	Checkbox, Switch, TimeInput,
} from '@nextui-org/react';
import {useTauriContext} from '@/context';
import {Time} from '@internationalized/date';

export default function TimeOptionForm() {
	const {ipcProps, setIpcProps} = useTauriContext();

	const today = new Date();

	const time = new Date(ipcProps.timeAsStart!);

	return (
		<div>
			<p>Timer Settings</p>
			<p className='text-primary-500 text-sm mb-5'>Start from:</p>
			<div className='flex gap-6 items-center'>
				<div className='flex flex-grow gap-3 items-center'>
					<TimeInput
						variant='bordered'
						color='primary'
						className='max-w-[7rem]'
						labelPlacement='outside'
						size='sm'
						hourCycle={12}
						defaultValue={new Time(time.getHours(), time.getMinutes())}
						isDisabled={ipcProps.idError! || ipcProps.timeIsCurrent}
						onChange={time => {
							const {hour, minute} = time;

							today.setHours(hour);
							today.setMinutes(minute);

							if (today.getTime() > Date.now()) {
								today.setDate(today.getDate() - 1);
							}

							today.setSeconds(0);

							setIpcProps(prev => ({...prev, timeAsStart: today.getTime(), timeEnabled: true}));
						}}
					/>
					<Checkbox
						isDisabled={ipcProps.idError}
						isSelected={ipcProps.timeIsCurrent}
						onValueChange={
							enabled => {
								setIpcProps(prev => ({...prev, timeIsCurrent: enabled}));
							}
						}
						size='sm'
					>
					Use current time on start
					</Checkbox>
				</div>
				<Switch isSelected={ipcProps.timeEnabled} isDisabled={ipcProps.idError} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, timeEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
