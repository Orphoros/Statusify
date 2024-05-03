import React from 'react';
import {TitleBar, EditCard, PreviewCard} from '@/components';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {showMenu} from 'tauri-plugin-context-menu';

function MainView() {
	const {ipcProps, isSessionRunning, setIsSessionRunning, osType} = useTauriContext();

	return (
		<div onContextMenu={
			e => {
				void showMenu(new MenuOptionBuilder(e, osType)
					.addStartIpc(isSessionRunning, setIsSessionRunning, ipcProps)
					.addStopIpc(isSessionRunning, setIsSessionRunning)
					.build());
			}

		} className='flex flex-col h-screen overflow-none'>
			<TitleBar/>
			<div className='flex flex-row overflow-hidden h-full m-3'>
				<div className='basis-2/3 flex mr-3'>
					<EditCard/>
				</div>
				<div className='basis-1/3 flex justify-center items-center'>
					<PreviewCard />
				</div>
			</div>
		</div>
	);
}

export default MainView;
