import React, {useEffect} from 'react';

import {NumberInput, Switch} from '@heroui/react';
import {validateNumberInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {useTranslation} from 'react-i18next';
import {MudaContextMenu} from '@/components/muda';

export default function PartyOptionForm() {
	const {osType, setIsSessionRunning, isSessionRunning, ipcProps, setIpcProps} = useTauriContext();

	const {t: errorTranslator} = useTranslation('lib-digit-validator');
	const {t: ctxMenuTranslator} = useTranslation('lib-ctx-menu');
	const {t: rpcHandlerTranslator} = useTranslation('lib-rpc-handle');
	const {t} = useTranslation('cpt-otp-party');

	const minHelper = validateNumberInput({
		t: errorTranslator, text: ipcProps.partySize?.toString(), min: 1, max: ipcProps.partyMax,
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
				<MudaContextMenu className='w-full' menuItems={
					() => new MenuOptionBuilder(ctxMenuTranslator, osType)
						.addCopy(ipcProps.partySize?.toString())
						.addCut(ipcProps.partySize?.toString(), () => {
							setIpcProps(prev => ({...prev, partySize: 1}));
						})
						.addPaste(text => {
							if (!text || isNaN(parseInt(text, 10))) {
								return;
							}

							setIpcProps(prev => ({...prev, partySize: parseInt(text, 10)}));
						})
						.addSeparator()
						.addToggleDisableOption(() => {
							setIpcProps(prev => ({...prev, partyEnabled: !ipcProps.partyEnabled}));
						})
						.addSeparator()
						.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
						.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
						.build()
				}>
					<NumberInput
						variant='bordered'
						isClearable
						hideStepper
						label={t('inp-party-size')}
						placeholder='1'
						value={ipcProps.partySize}
						errorMessage={minHelper.text}
						isInvalid={minHelper.error}
						color={minHelper.color}
						isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled}
						className='h-11'
						labelPlacement='outside'
						size='sm'
						width='100%'
						minValue={1}
						maxValue={100}
						onValueChange={e => {
							setIpcProps(prev => ({...prev, partySize: e}));
						}}
					/>
				</MudaContextMenu>
				<MudaContextMenu className='w-full' menuItems={
					() => new MenuOptionBuilder(ctxMenuTranslator, osType)
						.addCopy(ipcProps.partyMax?.toString())
						.addCut(ipcProps.partyMax?.toString(), () => {
							setIpcProps(prev => ({...prev, partyMax: 1}));
						})
						.addPaste(text => {
							if (!text || isNaN(parseInt(text, 10))) {
								return;
							}

							setIpcProps(prev => ({...prev, partyMax: parseInt(text, 10)}));
						})
						.addSeparator()
						.addToggleDisableOption(() => {
							setIpcProps(prev => ({...prev, partyEnabled: !ipcProps.partyEnabled}));
						})
						.addSeparator()
						.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
						.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
						.build()
				}>
					<NumberInput
						variant='bordered'
						isClearable
						hideStepper
						label={t('inp-party-max')}
						placeholder='1'
						value={ipcProps.partyMax}
						errorMessage={maxHelper.text}
						color={maxHelper.color}
						isInvalid={maxHelper.error}
						isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled}
						className='h-11'
						labelPlacement='outside'
						size='sm'
						width='100%'
						minValue={1}
						maxValue={100}
						onValueChange={e => {
							setIpcProps(prev => ({...prev, partyMax: e}));
						}}
					/>
				</MudaContextMenu>

				<Switch className='self-start mt-6' isSelected={ipcProps.partyEnabled} isDisabled={ipcProps.idError! || !ipcProps.stateEnabled || !ipcProps.detailsEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, partyEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
