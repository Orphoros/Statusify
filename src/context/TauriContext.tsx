import {type IpcProps} from '@/types';
import React, {useContext} from 'react';
import {warn} from 'tauri-plugin-log-api';

export type TauriContextType = {
	isDiscordRunning: boolean;
	isSessionRunning: boolean;
	ipcProps: IpcProps;
	setIsDiscordRunning: React.Dispatch<React.SetStateAction<boolean>>;
	setIsSessionRunning: React.Dispatch<React.SetStateAction<boolean>>;
	setIpcProps: React.Dispatch<React.SetStateAction<IpcProps>>;
};

export const TauriContext = React.createContext<TauriContextType>({
	isDiscordRunning: false,
	isSessionRunning: false,
	ipcProps: {},
	setIsDiscordRunning() {
		void warn('app context ipc state setter called before initialization');
	},
	setIsSessionRunning() {
		void warn('app context session watcher state setter called before initialization');
	},
	setIpcProps() {
		void warn('app context ipc props setter called before initialization');
	},
});

export const useTauriContext = () => useContext(TauriContext);
