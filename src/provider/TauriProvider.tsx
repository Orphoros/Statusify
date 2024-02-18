import React, {useLayoutEffect, useState} from 'react';
import {TauriContext} from '@/context';
import {type IpcProps} from '@/types';
import {useTauriStore} from '@/store/TauriStore';
import {appWindow} from '@tauri-apps/api/window';
import {error} from 'tauri-plugin-log-api';
import {LoadingView} from '@/views';
import {type OsType} from '@tauri-apps/api/os';

type TauriProviderProps = {
	children: React.ReactNode;
	osType: OsType | undefined;
};

export default function TauriProvider({children, osType}: TauriProviderProps) {
	const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
	const [ipcProps, setIpcProps, loading] = useTauriStore<IpcProps>('ipcProps', {
		timeAsStart: Date.now(),
		timeIsCurrent: true,
		buttonProtocol: 'https://',
	}, 'ipc.dat');

	return (
		<TauriContext.Provider value={{
			osType,
			showVibrancy: osType === 'Windows_NT' || osType === 'Darwin',
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
