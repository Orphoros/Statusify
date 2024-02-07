import {type IpcProps} from '@/types';
import React, {useContext} from 'react';
import {warn} from 'tauri-plugin-log-api';

export type TauriContextType = {
	isSessionRunning: boolean;
	ipcProps: IpcProps;
	setIsSessionRunning: React.Dispatch<React.SetStateAction<boolean>>;
	setIpcProps: React.Dispatch<React.SetStateAction<IpcProps>>;
};

export const TauriContext = React.createContext<TauriContextType>({
	isSessionRunning: false,
	ipcProps: {},
	setIsSessionRunning() {
		void warn('app context session watcher state setter called before initialization');
	},
	setIpcProps() {
		void warn('app context ipc props setter called before initialization');
	},
});

export const useTauriContext = () => useContext(TauriContext);
