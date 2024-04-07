import {type LaunchConfProps, type IpcProps} from '@/types';
import {type OsType} from '@tauri-apps/api/os';
import React, {useContext} from 'react';
import {warn} from 'tauri-plugin-log-api';

export type TauriContextType = {
	isSessionRunning: boolean;
	ipcProps: IpcProps;
	launchConfProps: LaunchConfProps;
	showVibrancy: boolean;
	osType: OsType | undefined;
	setIsSessionRunning: React.Dispatch<React.SetStateAction<boolean>>;
	setIpcProps: React.Dispatch<React.SetStateAction<IpcProps>>;
	setLaunchConfProps: React.Dispatch<React.SetStateAction<LaunchConfProps>>;
};

export const TauriContext = React.createContext<TauriContextType>({
	osType: undefined,
	showVibrancy: false,
	isSessionRunning: false,
	ipcProps: {},
	launchConfProps: {},
	setIsSessionRunning() {
		void warn('app context session watcher state setter called before initialization');
	},
	setIpcProps() {
		void warn('app context ipc props setter called before initialization');
	},
	setLaunchConfProps() {
		void warn('app context sysconf props setter called before initialization');
	},
});

export const useTauriContext = () => useContext(TauriContext);
