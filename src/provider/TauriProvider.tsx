import React, {useLayoutEffect, useState} from 'react';
import {TauriContext} from '@/context';
import {type IpcProps} from '@/types';
import {useTauriStore} from '@/store/TauriStore';
import {appWindow} from '@tauri-apps/api/window';
import {error} from 'tauri-plugin-log-api';
import {LoadingView} from '@/views';

export default function TauriProvider({children}: {children: React.ReactNode}) {
	const [isDiscordRunning, setIsDiscordRunning] = useState<boolean>(false);
	const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
	const [ipcProps, setIpcProps, loading] = useTauriStore<IpcProps>('ipcProps', {
		timeAsStart: Date.now(),
		timeIsCurrent: true,
		buttonProtocol: 'https://',
	}, 'ipc.dat');

	useLayoutEffect(() => {
		setTimeout(() => {
			void appWindow.show().catch(async () => {
				await error('failed to show main app window');
			});
		}, 300); // Wait a bit so the window is ready and no flickering occurs
	}, []);

	return (
		<TauriContext.Provider value={{
			isDiscordRunning,
			setIsDiscordRunning,
			isSessionRunning,
			setIsSessionRunning,
			ipcProps,
			setIpcProps,
		}}>
			{loading
				? <LoadingView/>
				: children
			}
		</TauriContext.Provider>
	);
}
