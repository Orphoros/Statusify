import React from 'react';

import {Checkbox, Input, Switch} from '@nextui-org/react';
import {useTauriContext} from '@/context';

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
					<Input
						variant='bordered'
						radius='full'
						type='time'
						color='primary'
						className='max-w-[7rem]'
						labelPlacement='outside'
						size='sm'
						defaultValue={`${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()}`}
						isDisabled={ipcProps.idError! || ipcProps.timeIsCurrent}
						onChange={e => {
							const {value} = e.target;
							const [hour, minute] = value.split(':');

							today.setHours(parseInt(hour, 10));
							today.setMinutes(parseInt(minute, 10));

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
