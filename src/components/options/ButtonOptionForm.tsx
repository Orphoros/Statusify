import React, {useEffect, useMemo} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput, validateUrlInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {showMenu} from 'tauri-plugin-context-menu';

export default function ButtonOptionForm() {
	const {isSessionRunning, setIsSessionRunning, ipcProps, setIpcProps, osType} = useTauriContext();

	const buttonUrlHelper = useMemo(() => validateUrlInput(ipcProps.buttonUrl), [ipcProps.buttonUrl]);
	const buttonTextHelper = useMemo(() => validateTextInput(ipcProps.buttonText, 20), [ipcProps.buttonText]);

	const handleUrlProtocol = (path: string): [string, string] => {
		if (path.includes('http://') || path.includes('https://')) {
			const protocol = path.split('://')[0] + '://';
			const url = path.replace('http://', '').replace('https://', '');
			return [protocol, url];
		}

		return ['https://', path];
	};

	useEffect(() => {
		setIpcProps(prev => ({...prev, buttonError: buttonUrlHelper.error || buttonTextHelper.error}));
	}, [buttonUrlHelper.error, buttonTextHelper.error]);

	return (
		<div>
			<p>Button Settings</p>
			<p className='text-primary-500 text-sm mb-5'>Button</p>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					placeholder='button text'
					isClearable
					width='100%'
					className='h-11'
					labelPlacement='outside'
					size='sm'
					errorMessage={buttonTextHelper.text}
					color={buttonTextHelper.color}
					isDisabled={ipcProps.idError}
					value={ipcProps.buttonText}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, buttonText: '', buttonEnabled: false}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									const enabled = containsText(text) && containsText(ipcProps.buttonUrl);
									setIpcProps(prev => ({...prev, buttonText: text, buttonEnabled: enabled}));
								});
							})
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, buttonEnabled: !ipcProps.buttonEnabled}));
							})
							.addClearOption(() => {
								setIpcProps(prev => ({...prev, buttonText: '', buttonEnabled: false}));
							})
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					onClear={() => {
						setIpcProps(prev => ({...prev, buttonText: '', buttonEnabled: false}));
					}}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`${buttonTextHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>label</span>
						</div>
					}
					onChange={e => {
						setIpcProps(prev => ({...prev, buttonText: e.target.value, buttonEnabled: containsText(e.target.value) && containsText(ipcProps.buttonUrl)}));
					}}
				/>
				<Input
					variant='bordered'
					isClearable
					width='100%'
					className='h-11'
					labelPlacement='outside'
					size='sm'
					color={buttonUrlHelper.color}
					errorMessage={buttonUrlHelper.text}
					isDisabled={ipcProps.idError}
					value={ipcProps.buttonUrl}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, buttonUrl: '', buttonEnabled: false}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									const [protocol, url] = handleUrlProtocol(text);
									const enabled = containsText(text) && containsText(ipcProps.buttonText);
									setIpcProps(prev => ({
										...prev, buttonProtocol: protocol, buttonUrl: url, buttonEnabled: enabled,
									}));
								});
							})
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, buttonEnabled: !ipcProps.buttonEnabled}));
							})
							.addClearOption(() => {
								setIpcProps(prev => ({...prev, buttonUrl: '', buttonEnabled: false}));
							})
							.addOpenInBrowser(ipcProps.buttonUrl ? `${ipcProps.buttonProtocol}${ipcProps.buttonUrl}` : undefined)
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					onClear={() => {
						setIpcProps(prev => ({...prev, buttonUrl: '', buttonEnabled: false}));
					}}
					startContent={
						<div className='pointer-events-none flex items-center w-11'>
							<span className={`${buttonUrlHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>{ipcProps.buttonProtocol}</span>
						</div>
					}
					onChange={e => {
						const {value} = e.target;
						const [protocol, url] = handleUrlProtocol(value);

						setIpcProps(prev => ({
							...prev, buttonProtocol: protocol, buttonUrl: url, buttonEnabled: containsText(value) && containsText(ipcProps.buttonText),
						}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.buttonEnabled} isDisabled={ipcProps.idError} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, buttonEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
