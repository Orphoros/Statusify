import React, {useState} from 'react';
import {TauriContext} from '@/context';
import {type LaunchConfProps, type IpcProps} from '@/types';
import {useTauriStore} from '@/store/TauriStore';
import {LoadingView} from '@/views';
import {type OsType} from '@tauri-apps/api/os';

type TauriProviderProps = {
	children: React.ReactNode;
	osType: OsType | undefined;
	locales: string[];
};

export default function TauriProvider({children, osType, locales}: TauriProviderProps) {
	const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);

	const [ipcProps, setIpcProps, ipcStoreLoading] = useTauriStore<IpcProps>('ipcProps', {
		timeAsStart: Date.now(),
		timeIsCurrent: true,
		buttonProtocol: 'https://',
		button2Protocol: 'https://',
	}, 'ipc.dat');

	const [launchConfProps, setLaunchConfProps, sysConfStoreLoading] = useTauriStore<LaunchConfProps>('launchOption', {
		startIpcOnLaunch: false,
		startAppOnLaunch: false,
		logLevel: 'debug',
		locale: 'en-US',
	}, 'launch.conf');

	return (
		<TauriContext value={{
			osType,
			showVibrancy: osType === 'Darwin',
			isSessionRunning,
			setLaunchConfProps,
			launchConfProps,
			setIsSessionRunning,
			ipcProps,
			setIpcProps,
			locales,
		}}>
			{ipcStoreLoading || sysConfStoreLoading || !osType
				? <LoadingView/>
				: children
			}
		</TauriContext>
	);
}
