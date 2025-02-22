import React from 'react';
import {TitleBar, EditCard, PreviewCard} from '@/components';
import {MenuOptionBuilder, useTauriContext} from '@/context';
import {useTranslation} from 'react-i18next';
import {MudaMantle, MudaContextMenu} from '@/components/muda';

function MainView() {
	const {ipcProps, isSessionRunning, setIsSessionRunning, osType} = useTauriContext();
	const {t: rpcHandlerTranslator} = useTranslation('lib-rpc-handle');
	const {t: ctxMenuTranslator} = useTranslation('lib-ctx-menu');

	return (
		<MudaMantle osType={osType!}>
			<MudaContextMenu menuItems={
				() => new MenuOptionBuilder(ctxMenuTranslator, osType)
					.addStartIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning, ipcProps)
					.addStopIpc(rpcHandlerTranslator, isSessionRunning, setIsSessionRunning)
					.build()}>
				<div className='flex flex-col h-screen overflow-none'>
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
			</MudaContextMenu>
		</MudaMantle>
	);
}

export default MainView;
