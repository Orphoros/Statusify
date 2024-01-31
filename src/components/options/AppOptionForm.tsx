import React, {useEffect, useMemo} from 'react';
import {Input} from '@nextui-org/react';
import {validateNumberInput} from '@/lib';
import {useTauriContext} from '@/context';

export default function AppOptionForm() {
	const {ipcProps, setIpcProps} = useTauriContext();

	const helper = useMemo(() => validateNumberInput({text: ipcProps.id, length: 18, required: true}), [ipcProps.id]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, idError: helper.error}));
	}, [ipcProps.id, helper.error]);

	return (
		<div>
			<p>App Connection</p>
			<div className='flex justify-center mt-2'>
				<Input
					isRequired
					className='max-w-[11.5rem]'
					defaultValue={ipcProps.id}
					label='App ID'
					key='primary'
					color={helper.color}
					errorMessage={helper.text}
					onChange={e => {
						const {value} = e.target;
						setIpcProps(prev => ({...prev, id: value}));
					}}
				/>
			</div>
		</div>
	);
}
