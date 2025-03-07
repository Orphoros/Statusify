import React, {useEffect} from 'react';

import {Input, Switch} from '@heroui/react';
import {containsText, validateTextInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {useTranslation} from 'react-i18next';
import {MudaContextMenu} from '@/components/muda';

export default function ImageOptionForm() {
	const {osType, setIsSessionRunning, isSessionRunning, ipcProps, setIpcProps} = useTauriContext();

	const {t: errorTranslator} = useTranslation('lib-str-validator');
	const {t: ctxMenuTranslator} = useTranslation('lib-ctx-menu');
	const {t: rpcHandlerTranslator} = useTranslation('lib-rpc-handle');
	const {t} = useTranslation('cpt-opt-image');

	const largeImageTooltipHelper = validateTextInput({t: errorTranslator, prop: ipcProps.largeImageTooltip, maxStrLength: 20});
	const smallImageTooltipHelper = validateTextInput({t: errorTranslator, prop: ipcProps.smallImageTooltip, maxStrLength: 20});
	const largeImageUrlHelper = validateTextInput({t: errorTranslator, prop: ipcProps.largeImage, maxStrLength: 255});
	const smallImageUrlHelper = validateTextInput({t: errorTranslator, prop: ipcProps.smallImage, maxStrLength: 255});

	useEffect(() => {
		setIpcProps(prev => ({
			...prev,
			largeImageTooltipError: largeImageTooltipHelper.error,
			smallImageTooltipError: smallImageTooltipHelper.error,
			largeImageUrlError: largeImageUrlHelper.error,
			smallImageUrlError: smallImageUrlHelper.error,
		}));
	}, [largeImageTooltipHelper.error, smallImageTooltipHelper.error, largeImageUrlHelper.error, smallImageUrlHelper.error]);

	return (
		<div>
			<p className='capitalize'>{t('lbl-title')}</p>
			<p className='text-primary-500 text-sm mb-5 capitalize'>{t('lbl-subtitle-li')}</p>
			<div className='flex gap-6 mb-2'>
				<MudaContextMenu className='w-full' menuItems={
					() => new MenuOptionBuilder(ctxMenuTranslator, osType)
						.addCopy(ipcProps.largeImage)
						.addCut(ipcProps.largeImage, () => {
							setIpcProps(prev => ({...prev, largeImage: '', largeImageEnabled: false}));
						})
						.addPaste(text => {
							setIpcProps(prev => ({...prev, largeImage: text, largeImageEnabled: containsText(text)}));
						})
						.addSeparator()
						.addToggleDisableOption(() => {
							setIpcProps(prev => ({...prev, largeImageEnabled: !ipcProps.largeImageEnabled}));
						})
						.addClearOption(() => {
							setIpcProps(prev => ({...prev, largeImage: '', largeImageEnabled: false}));
						})
						.addOpenInBrowser(ipcProps.largeImage)
						.addSeparator()
						.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
						.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
						.build()
				}>
					<Input
						variant='bordered'
						isClearable
						placeholder={t('input-li-plh')}
						className='h-11'
						labelPlacement='outside'
						size='sm'
						width='100%'
						value={ipcProps.largeImage}
						isDisabled={ipcProps.idError}
						errorMessage={largeImageUrlHelper.text}
						isInvalid={largeImageUrlHelper.error}
						color={largeImageUrlHelper.color}
						startContent={
							<div className='pointer-events-none flex shrink-0 items-center w-11'>
								<span className={`${largeImageUrlHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{t('inp-li')}</span>
							</div>
						}
						onClear={() => {
							setIpcProps(prev => ({...prev, largeImage: '', largeImageEnabled: false}));
						}}
						onChange={e => {
							setIpcProps(prev => ({...prev, largeImage: e.target.value, largeImageEnabled: containsText(e.target.value)}));
						}}
					/>
				</MudaContextMenu>
				<Switch className='self-start mt-0' isSelected={ipcProps.largeImageEnabled} isDisabled={ipcProps.idError} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, largeImageEnabled: enabled}));
					}
				}/>
			</div>
			<div className='flex gap-6'>
				<MudaContextMenu className='w-full' menuItems={
					() => new MenuOptionBuilder(ctxMenuTranslator, osType)
						.addCopy(ipcProps.largeImageTooltip)
						.addCut(ipcProps.largeImageTooltip, () => {
							setIpcProps(prev => ({...prev, largeImageTooltip: '', largeImageTooltipEnabled: false}));
						})
						.addPaste(text => {
							setIpcProps(prev => ({...prev, largeImageTooltip: text, largeImageTooltipEnabled: containsText(text)}));
						})
						.addSeparator()
						.addToggleDisableOption(() => {
							setIpcProps(prev => ({...prev, largeImageTooltipEnabled: !ipcProps.largeImageTooltipEnabled}));
						})
						.addClearOption(() => {
							setIpcProps(prev => ({...prev, largeImageTooltip: '', largeImageTooltipEnabled: false}));
						})
						.addSeparator()
						.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
						.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
						.build()
				}>
					<Input
						variant='bordered'
						isClearable
						placeholder={t('inp-li-tooltip-plh')}
						className='h-11'
						labelPlacement='outside'
						size='sm'
						errorMessage={largeImageTooltipHelper.text}
						isInvalid={largeImageTooltipHelper.error}
						color={largeImageTooltipHelper.color}
						width='100%'
						value={ipcProps.largeImageTooltip}
						isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled}
						startContent={
							<div className='pointer-events-none flex shrink-0 items-center w-11'>
								<span className={`lowercase ${largeImageTooltipHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{t('inp-li-tooltip')}</span>
							</div>
						}
						onClear={() => {
							setIpcProps(prev => ({...prev, largeImageTooltip: '', largeImageTooltipEnabled: false}));
						}}
						onChange={e => {
							setIpcProps(prev => ({...prev, largeImageTooltip: e.target.value, largeImageTooltipEnabled: containsText(e.target.value)}));
						}}
					/>
				</MudaContextMenu>
				<div>
					<Switch className='self-start mt-0' isSelected={ipcProps.largeImageTooltipEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled} onValueChange={
						enabled => {
							setIpcProps(prev => ({...prev, largeImageTooltipEnabled: enabled}));
						}
					}/>
				</div>
			</div>
			<p className='text-primary-500 text-sm mb-5 mt-2 capitalize'>{t('lbl-subtitle-si')}</p>
			<div className='flex gap-6 mb-2'>
				<MudaContextMenu className='w-full' menuItems={
					() => new MenuOptionBuilder(ctxMenuTranslator, osType)
						.addCopy(ipcProps.smallImage)
						.addCut(ipcProps.smallImage, () => {
							setIpcProps(prev => ({...prev, smallImage: '', smallImageEnabled: false}));
						})
						.addPaste(text => {
							setIpcProps(prev => ({...prev, smallImage: text, smallImageEnabled: containsText(text)}));
						})
						.addSeparator()
						.addToggleDisableOption(() => {
							setIpcProps(prev => ({...prev, smallImageEnabled: !ipcProps.smallImageEnabled}));
						})
						.addClearOption(() => {
							setIpcProps(prev => ({...prev, smallImage: '', smallImageEnabled: false}));
						})
						.addOpenInBrowser(ipcProps.smallImage)
						.addSeparator()
						.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
						.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
						.build()
				}>
					<Input
						variant='bordered'
						isClearable
						className='h-11'
						labelPlacement='outside'
						size='sm'
						placeholder={t('input-si-plh')}
						width='100%'
						value={ipcProps.smallImage}
						isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled}
						errorMessage={smallImageUrlHelper.text}
						isInvalid={smallImageUrlHelper.error}
						color={smallImageUrlHelper.color}
						startContent={
							<div className='pointer-events-none flex shrink-0 items-center w-11'>
								<span className={`lowercase ${smallImageUrlHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{t('inp-si')}</span>
							</div>
						}
						onClear={() => {
							setIpcProps(prev => ({...prev, smallImage: '', smallImageEnabled: false}));
						}}
						onChange={e => {
							setIpcProps(prev => ({...prev, smallImage: e.target.value, smallImageEnabled: containsText(e.target.value)}));
						}}
					/>
				</MudaContextMenu>
				<Switch className='self-start mt-0' isSelected={ipcProps.smallImageEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, smallImageEnabled: enabled}));
					}
				}/>
			</div>
			<div className='flex gap-6'>
				<MudaContextMenu className='w-full' menuItems={
					() => new MenuOptionBuilder(ctxMenuTranslator, osType)
						.addCopy(ipcProps.smallImageTooltip)
						.addCut(ipcProps.smallImageTooltip, () => {
							setIpcProps(prev => ({...prev, smallImageTooltip: '', smallImageTooltipEnabled: false}));
						})
						.addPaste(text => {
							setIpcProps(prev => ({...prev, smallImageTooltip: text, smallImageTooltipEnabled: containsText(text)}));
						})
						.addSeparator()
						.addToggleDisableOption(() => {
							setIpcProps(prev => ({...prev, smallImageTooltipEnabled: !ipcProps.smallImageTooltipEnabled}));
						})
						.addClearOption(() => {
							setIpcProps(prev => ({...prev, smallImageTooltip: '', smallImageTooltipEnabled: false}));
						})
						.addSeparator()
						.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
						.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
						.build()
				}>
					<Input
						variant='bordered'
						isClearable
						placeholder={t('inp-si-tooltip-plh')}
						className='h-11'
						labelPlacement='outside'
						size='sm'
						width='100%'
						errorMessage={smallImageTooltipHelper.text}
						color={smallImageTooltipHelper.color}
						isInvalid={smallImageTooltipHelper.error}
						value={ipcProps.smallImageTooltip}
						isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled || !ipcProps.smallImageEnabled}
						startContent={
							<div className='pointer-events-none flex shrink-0 items-center w-11'>
								<span className={`lowercase ${smallImageTooltipHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{t('inp-si-tooltip')}</span>
							</div>
						}
						onClear={() => {
							setIpcProps(prev => ({...prev, smallImageTooltip: '', smallImageTooltipEnabled: false}));
						}}
						onChange={e => {
							setIpcProps(prev => ({...prev, smallImageTooltip: e.target.value, smallImageTooltipEnabled: containsText(e.target.value)}));
						}}
					/>
				</MudaContextMenu>
				<Switch className='self-start mt-0' isSelected={ipcProps.smallImageTooltipEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled || !ipcProps.smallImageEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, smallImageTooltipEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
