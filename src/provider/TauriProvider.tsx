import React, {useState} from 'react';
import {TauriContext} from '@/context';
import {type IpcProps} from '@/types';

export default function TauriProvider({children}: {children: React.ReactNode}) {
	const [isDiscordRunning, setIsDiscordRunning] = useState<boolean>(false);
	const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
	const [ipcProps, setIpcProps] = useState<IpcProps>({});

	return (
		<TauriContext.Provider value={{
			isDiscordRunning,
			setIsDiscordRunning,
			isSessionRunning,
			setIsSessionRunning,
			ipcProps,
			setIpcProps,
		}}>
			{children}
		</TauriContext.Provider>
	);
}
