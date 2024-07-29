import React, {useEffect, useMemo} from 'react';
import {Button, ButtonGroup, Input} from '@nextui-org/react';
import {isFormCorrect, validateNumberInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {showMenu} from 'tauri-plugin-context-menu';
import {save, open, message} from '@tauri-apps/api/dialog';
import {debug} from 'tauri-plugin-log-api';
import {BaseDirectory, readTextFile, writeTextFile} from '@tauri-apps/api/fs';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	faFolderOpen, faSave,
} from '@fortawesome/free-regular-svg-icons';

export default function AppOptionForm() {
	const {ipcProps, setIpcProps, osType, setIsSessionRunning, isSessionRunning} = useTauriContext();

	const helper = useMemo(() => validateNumberInput({text: ipcProps.id, length: 18, required: true}), [ipcProps.id]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, idError: helper.error}));
	}, [ipcProps.id, helper.error]);

	return (
		<div>
			<p>App Connection</p>
			<div className='flex items-center justify-center mt-2 gap-2 h-[4.5rem]'>
				<Input
					isRequired
					className='max-w-[12.8rem] h-[4.5rem]'
					size='sm'
					defaultValue={ipcProps.id}
					label='App ID'
					key='primary'
					color={helper.color}
					isInvalid={helper.error}
					errorMessage={helper.text}
					value={ipcProps.id}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
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
				<ButtonGroup size='sm' className='mb-6'>
					<Button
						disableRipple
						onClick={async () => {
							try {
								const filePath = await open({
									title: 'Open your file',
									multiple: false,
									filters: [{
										name: 'presence',
										extensions: ['rpc'],
									}],
								});
								if (!filePath) {
									return;
								}

								const contents = await readTextFile(filePath as string, {dir: BaseDirectory.AppConfig});
								if (!contents) {
									return;
								}

								setIpcProps({...ipcProps, ...JSON.parse(contents) as typeof ipcProps});
							} catch (e) {
								void message('Could not open the configuration file', {title: 'Statusify', type: 'error'});
								void debug(`error reading .rpc file: ${JSON.stringify(e)}`);
							}
						}}
					>
						<FontAwesomeIcon icon={faFolderOpen} />Import
					</Button>
					<Button
						disableRipple
						isDisabled={!isFormCorrect(ipcProps)}
						onClick={async () => {
							try {
								const filePath = await save({
									title: 'Save your file',
									filters: [{
										name: 'presence',
										extensions: ['rpc'],
									}],
								});

								if (!filePath) {
									return;
								}

								await writeTextFile({path: filePath, contents: JSON.stringify(ipcProps)}, {dir: BaseDirectory.AppConfig});
							} catch (e) {
								void message('Could not save the configuration file', {title: 'Statusify', type: 'error'});
								void debug(`error writing .rpc file: ${JSON.stringify(e)}`);
							}
						}}
					>
						<FontAwesomeIcon icon={faSave} />Export
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}
