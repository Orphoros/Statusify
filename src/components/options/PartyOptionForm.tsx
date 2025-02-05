import React, {useEffect} from 'react';

import {Input, Switch} from '@heroui/react';
import {validateNumberInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {showMenu} from 'tauri-plugin-context-menu';
import {useTranslation} from 'react-i18next';

export default function PartyOptionForm() {
	const {osType, setIsSessionRunning, isSessionRunning, ipcProps, setIpcProps} = useTauriContext();

	const {t: errorTranslator} = useTranslation('lib-digit-validator');
	const {t: ctxMenuTranslator} = useTranslation('lib-ctx-menu');
	const {t: rpcHandlerTranslator} = useTranslation('lib-rpc-handle');
	const {t} = useTranslation('cpt-otp-party');

	const minHelper = validateNumberInput({
		t: errorTranslator, text: ipcProps.partySize?.toString(), min: 1, max: 100,
	});
	const maxHelper = validateNumberInput({
		t: errorTranslator, text: ipcProps.partyMax?.toString(), min: 1, max: 100,
	});

	useEffect(() => {
		setIpcProps(prev => ({...prev, partyError: minHelper.error || maxHelper.error}));
	}, [minHelper.error, maxHelper.error]);

	return (
		<div>
			<p className='mb-5 capitalize'>{t('lbl-title')}</p>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					label={t('inp-party-size')}
					placeholder='0'
					defaultValue={ipcProps.partySize?.toString()}
					errorMessage={minHelper.text}
					isInvalid={minHelper.error}
					color={minHelper.color}
					isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled}
					className='h-11'
					labelPlacement='outside'
					size='sm'
					width='100%'
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(ctxMenuTranslator, e, osType)
							.addCopy()
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, partyEnabled: !ipcProps.partyEnabled}));
							})
							.addSeparator()
							.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, partySize: parseInt(e.target.value, 10), partyEnabled: e.target.value.isInteger()}));
					}}
				/>
				<Input
					variant='bordered'
					label={t('inp-party-max')}
					placeholder='0'
					defaultValue={ipcProps.partyMax?.toString()}
					errorMessage={maxHelper.text}
					color={maxHelper.color}
					isInvalid={maxHelper.error}
					isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled}
					className='h-11'
					labelPlacement='outside'
					size='sm'
					width='100%'
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(ctxMenuTranslator, e, osType)
							.addCopy()
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, partyEnabled: !ipcProps.partyEnabled}));
							})
							.addSeparator()
							.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, partyMax: parseInt(e.target.value, 10), partyEnabled: e.target.value.isInteger()}));
					}}
				/>

				<Switch className='self-start mt-6' isSelected={ipcProps.partyEnabled} isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, partyEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
