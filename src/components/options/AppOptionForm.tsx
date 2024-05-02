import React, {useEffect, useMemo} from 'react';
import {Input} from '@nextui-org/react';
import {validateNumberInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {showMenu} from 'tauri-plugin-context-menu';

export default function AppOptionForm() {
	const {ipcProps, setIpcProps, osType, setIsSessionRunning, isSessionRunning} = useTauriContext();

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
					className='max-w-[11.5rem] h-[4.5rem]'
					size='sm'
					defaultValue={ipcProps.id}
					label='App ID'
					key='primary'
					color={helper.color}
					errorMessage={helper.text}
					value={ipcProps.id}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, id: ''}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									setIpcProps(prev => ({...prev, id: text}));
								});
							})
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build());
					}}
					onChange={e => {
						const {value} = e.target;
						setIpcProps(prev => ({...prev, id: value}));
					}}
				/>
			</div>
		</div>
	);
}
