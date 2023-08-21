import React, {useState} from 'react';
import {TauriContext} from '@/context';
import {type IpcProps} from '@/types';
import {useTauriStore} from '@/store/TauriStore';

export default function TauriProvider({children}: {children: React.ReactNode}) {
	const [isDiscordRunning, setIsDiscordRunning] = useState<boolean>(false);
	const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
	const [ipcProps, setIpcProps, loading] = useTauriStore<IpcProps>('ipcProps', {
		timeAsStart: Date.now(),
		timeIsCurrent: true,
	}, 'ipc.dat');

	// TODO: Show loading screen while loading

	// TODO: Move title bar to provider and always show it

	return (
		<TauriContext.Provider value={{
			isDiscordRunning,
			setIsDiscordRunning,
			isSessionRunning,
			setIsSessionRunning,
			ipcProps,
			setIpcProps,
		}}>
			{!loading && children}
		</TauriContext.Provider>
	);
}
