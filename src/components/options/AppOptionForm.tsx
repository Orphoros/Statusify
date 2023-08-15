import React, {useEffect, useMemo, useState} from 'react';
import {Input} from '@nextui-org/react';
import {validateNumberInput} from '@/lib';

type AppOptionProps = {
	onChange?: (id: string) => void;
	onError?: (error: boolean) => void;
};

export default function AppOptionForm(props: AppOptionProps) {
	const {onChange, onError} = props;

	const [id, setId] = useState<string>('');
	const helper = useMemo(() => validateNumberInput({text: id, length: 18, required: true}), [id]);

	useEffect(() => {
		if (onChange) {
			onChange(id);
		}

		if (onError) {
			onError(helper.error);
		}
	}, [id, helper.error]);

	return (<>
		<p>App Connection</p>
		<div className='flex justify-center mt-2'>
			<Input
				isRequired
				className='max-w-[11.5rem] h-20'
				label='App ID'
				key='primary'
				color={helper.color}
				errorMessage={helper.text}
				onChange={e => {
					const {value} = e.target;
					setId(value);
				}}
			/>
		</div>
	</>
	);
}
