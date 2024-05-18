import React, {useEffect, useMemo} from 'react';

import {Input, Switch} from '@nextui-org/react';
import {containsText, validateTextInput} from '@/lib';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {showMenu} from 'tauri-plugin-context-menu';

export default function ImageOptionForm() {
	const {osType, setIsSessionRunning, isSessionRunning, ipcProps, setIpcProps} = useTauriContext();

	const largeImageTooltipHelper = useMemo(() => validateTextInput(ipcProps.largeImageTooltip, 20), [ipcProps.largeImageTooltip]);
	const smallImageTooltipHelper = useMemo(() => validateTextInput(ipcProps.smallImageTooltip, 20), [ipcProps.smallImageTooltip]);

	useEffect(() => {
		setIpcProps(prev => ({...prev, largeImageTooltipError: largeImageTooltipHelper.error, smallImageTooltipError: smallImageTooltipHelper.error}));
	}, [largeImageTooltipHelper.error, smallImageTooltipHelper.error]);

	return (
		<div>
			<p>Image Settings</p>
			<p className='text-primary-500 text-sm mb-5'>Large Image Settings</p>
			<div className='flex gap-6 mb-2'>
				<Input
					variant='bordered'
					isClearable
					placeholder='large image resource name or url'
					className='h-11'
					labelPlacement='outside'
					size='sm'
					color='primary'
					width='100%'
					value={ipcProps.largeImage}
					isDisabled={ipcProps.idError}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, largeImage: '', largeImageEnabled: false}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									setIpcProps(prev => ({...prev, largeImage: text, largeImageEnabled: containsText(text)}));
								});
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
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className='text-default-400 text-small'>image</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, largeImage: '', largeImageEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, largeImage: e.target.value, largeImageEnabled: containsText(e.target.value)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.largeImageEnabled} isDisabled={ipcProps.idError} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, largeImageEnabled: enabled}));
					}
				}/>
			</div>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					isClearable
					placeholder='large image tooltip'
					className='h-11'
					labelPlacement='outside'
					size='sm'
					errorMessage={largeImageTooltipHelper.text}
					isInvalid={largeImageTooltipHelper.error}
					color={largeImageTooltipHelper.color}
					width='100%'
					value={ipcProps.largeImageTooltip}
					isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, largeImageTooltip: '', largeImageTooltipEnabled: false}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									setIpcProps(prev => ({...prev, largeImageTooltip: text, largeImageTooltipEnabled: containsText(text)}));
								});
							})
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, largeImageTooltipEnabled: !ipcProps.largeImageTooltipEnabled}));
							})
							.addClearOption(() => {
								setIpcProps(prev => ({...prev, largeImageTooltip: '', largeImageTooltipEnabled: false}));
							})
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`${largeImageTooltipHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>tooltip</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, largeImageTooltip: '', largeImageTooltipEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, largeImageTooltip: e.target.value, largeImageTooltipEnabled: containsText(e.target.value)}));
					}}
				/>
				<div>
					<Switch className='self-start mt-0' isSelected={ipcProps.largeImageTooltipEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled} onValueChange={
						enabled => {
							setIpcProps(prev => ({...prev, largeImageTooltipEnabled: enabled}));
						}
					}/>
				</div>
			</div>
			<p className='text-primary-500 text-sm mb-5 mt-2'>Small Image Settings</p>
			<div className='flex gap-6 mb-2'>
				<Input
					variant='bordered'
					isClearable
					className='h-11'
					labelPlacement='outside'
					size='sm'
					placeholder='small image resource name or url'
					color='primary'
					width='100%'
					value={ipcProps.smallImage}
					isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, smallImage: '', smallImageEnabled: false}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									setIpcProps(prev => ({...prev, smallImage: text, smallImageEnabled: containsText(text)}));
								});
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
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className='text-default-400 text-small'>image</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, smallImage: '', smallImageEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, smallImage: e.target.value, smallImageEnabled: containsText(e.target.value)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.smallImageEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, smallImageEnabled: enabled}));
					}
				}/>
			</div>
			<div className='flex gap-6'>
				<Input
					variant='bordered'
					isClearable
					placeholder='small image tooltip'
					className='h-11'
					labelPlacement='outside'
					size='sm'
					width='100%'
					errorMessage={smallImageTooltipHelper.text}
					color={smallImageTooltipHelper.color}
					isInvalid={smallImageTooltipHelper.error}
					value={ipcProps.smallImageTooltip}
					isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled || !ipcProps.smallImageEnabled}
					onContextMenu={e => {
						void showMenu(new MenuOptionBuilder(e, osType)
							.addCopy()
							.addCut(() => {
								setIpcProps(prev => ({...prev, smallImageTooltip: '', smallImageTooltipEnabled: false}));
							})
							.addPaste(() => {
								void navigator.clipboard.readText().then(text => {
									setIpcProps(prev => ({...prev, smallImageTooltip: text, smallImageTooltipEnabled: containsText(text)}));
								});
							})
							.addSeparator()
							.addToggleDisableOption(() => {
								setIpcProps(prev => ({...prev, smallImageTooltipEnabled: !ipcProps.smallImageTooltipEnabled}));
							})
							.addClearOption(() => {
								setIpcProps(prev => ({...prev, smallImageTooltip: '', smallImageTooltipEnabled: false}));
							})
							.addSeparator()
							.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
							.addStopIpc(isSessionRunning, setIsSessionRunning)
							.build(),
						);
					}}
					startContent={
						<div className='pointer-events-none flex shrink-0 items-center w-11'>
							<span className={`${smallImageTooltipHelper.error ? 'text-danger-500' : 'text-default-400'} text-small`}>tooltip</span>
						</div>
					}
					onClear={() => {
						setIpcProps(prev => ({...prev, smallImageTooltip: '', smallImageTooltipEnabled: false}));
					}}
					onChange={e => {
						setIpcProps(prev => ({...prev, smallImageTooltip: e.target.value, smallImageTooltipEnabled: containsText(e.target.value)}));
					}}
				/>
				<Switch className='self-start mt-0' isSelected={ipcProps.smallImageTooltipEnabled} isDisabled={ipcProps.idError! || !ipcProps.largeImageEnabled || !ipcProps.smallImageEnabled} onValueChange={
					enabled => {
						setIpcProps(prev => ({...prev, smallImageTooltipEnabled: enabled}));
					}
				}/>
			</div>
		</div>
	);
}
