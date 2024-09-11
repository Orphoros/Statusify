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
import {useTranslation} from 'react-i18next';

export default function AppOptionForm() {
	const {ipcProps, setIpcProps, osType, setIsSessionRunning, isSessionRunning} = useTauriContext();
	const {t: errorTranslator} = useTranslation('lib-digit-validator');
	const {t: ctxMenuTranslator} = useTranslation('lib-ctx-menu');
	const {t: rpcHandlerTranslator} = useTranslation('lib-rpc-handle');
	const {t} = useTranslation('cpt-otp-app');

	const helper = useMemo(() => validateNumberInput({
		t: errorTranslator, text: ipcProps.id, required: true,
	}), [ipcProps.id]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, idError: helper.error}));
	}, [ipcProps.id, helper.error]);

	return (
		<div>
			<p className='capitalize'>{t('lbl-title')}</p>
			<div className='flex items-center justify-center mt-2 gap-2 h-[4.5rem]'>
				<Input
					isRequired
					className='max-w-[11.5rem] h-[4.5rem]'
					size='sm'
					defaultValue={ipcProps.id}
					label={t('inp-app-id')}
					key='primary'
					color={helper.color}
					isInvalid={helper.error}
					errorMessage={helper.text}
					value={ipcProps.id}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(ctxMenuTranslator, e, osType)
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
							.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
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
									title: t('dlg-import-title'),
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
								void message(t('popup-open-fail'), {title: 'Statusify', type: 'error'});
								void debug(`error reading .rpc file: ${e}`);
							}
						}}
					>
						<FontAwesomeIcon icon={faFolderOpen} />{t('btn-import')}
					</Button>
					<Button
						disableRipple
						isDisabled={!isFormCorrect(ipcProps)}
						onClick={async () => {
							try {
								const filePath = await save({
									title: t('dlg-export-title'),
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
								void message(t('popup-save-fail'), {title: 'Statusify', type: 'error'});
								void debug(`error writing .rpc file: ${e}`);
							}
						}}
					>
						<FontAwesomeIcon icon={faSave} />{t('btn-export')}
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}
