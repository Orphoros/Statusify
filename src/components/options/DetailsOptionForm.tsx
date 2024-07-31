import React, {useMemo, useEffect} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {showMenu} from 'tauri-plugin-context-menu';
import {useTranslation} from 'react-i18next';

export default function DetailsOptionForm() {
	const {osType, isSessionRunning, setIsSessionRunning, ipcProps, setIpcProps} = useTauriContext();

	const {t: errorTranslator} = useTranslation('lib-str-validator');
	const {t} = useTranslation('cpt-otp-details');

	const detailsHelper = useMemo(() => validateTextInput({t: errorTranslator, prop: ipcProps.details, maxStrLength: 35}), [ipcProps.details]);
	const stateHelper = useMemo(() => validateTextInput({t: errorTranslator, prop: ipcProps.details, maxStrLength: 20}), [ipcProps.state]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, detailsError: detailsHelper.error, stateError: stateHelper.error}));
	}, [detailsHelper.error, stateHelper.error]);

	return (
		<div>
			<p className='mb-5 capitalize'>{t('lbl-title')}</p>
			<div className='flex gap-6 mb-2'>
				<Input
					variant='bordered'
					className='h-11'
					size='sm'
					isClearable
					placeholder={t('inp-plh-details')}
					value={ipcProps.details}
					width='100%'
					labelPlacement='outside'
					errorMessage={detailsHelper.text}
					isInvalid={detailsHelper.error}
					color={detailsHelper.color}
					isDisabled={ipcProps.idError}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, details: '', detailsEnabled: false}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									const enabled = containsText(text) && containsText(ipcProps.buttonText);
									setIpcProps(prev => ({...prev, details: text, detailsEnabled: enabled}));
								});
							})
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, detailsEnabled: !ipcProps.detailsEnabled}));
							})
							.addClearOption(() => {
								setIpcProps(prev => ({...prev, details: '', detailsEnabled: false}));
							})
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`lowercase ${detailsHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{t('inp-details')}</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, details: '', detailsEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({
							...prev, details: e.target.value, detailsEnabled: containsText(e.target.value), stateEnabled: containsText(ipcProps.state),
						}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.detailsEnabled} isDisabled={ipcProps.idError} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, detailsEnabled: enabled}));
					}
				}/>
			</div>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					className='h-11'
					size='sm'
					isClearable
					value={ipcProps.state}
					placeholder={t('inp-plh-state')}
					isInvalid={stateHelper.error}
					errorMessage={stateHelper.text}
					color={stateHelper.color}
					width='100%'
					labelPlacement='outside'
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, state: '', stateEnabled: false}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									setIpcProps(prev => ({...prev, state: text, stateEnabled: containsText(text)}));
								});
							})
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, stateEnabled: !ipcProps.stateEnabled}));
							})
							.addClearOption(() => {
								setIpcProps(prev => ({...prev, state: '', stateEnabled: false}));
							})
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`lowercase ${stateHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{t('inp-state')}</span>
						</div>
					}
					isDisabled={ipcProps.idError! || !ipcProps.detailsEnabled || !containsText(ipcProps.details)}
					onClear={() => {
						setIpcProps(prev => ({...prev, state: '', stateEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, state: e.target.value, stateEnabled: containsText(e.target.value)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.stateEnabled} isDisabled={ipcProps.idError! || !ipcProps.detailsEnabled || !containsText(ipcProps.details)} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, stateEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
