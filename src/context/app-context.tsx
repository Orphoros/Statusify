import {type IpcProps} from '@/types';
import React from 'react';
import {warn} from 'tauri-plugin-log-api';
import {Store} from 'tauri-plugin-store-api';

export type AppContextType = {
	isDiscordRunning: boolean;
	isSessionRunning: boolean;
	ipcProps: IpcProps;
	setIsDiscordRunning: React.Dispatch<React.SetStateAction<boolean>>;
	setIsSessionRunning: React.Dispatch<React.SetStateAction<boolean>>;
	setIpcProps: React.Dispatch<React.SetStateAction<IpcProps>>;
};

export const AppContext = React.createContext<AppContextType>({
	isDiscordRunning: false,
	isSessionRunning: false,
	ipcProps: {},
	setIsDiscordRunning() {
		void warn('App context ipc state setter called before initialization');
	},
	setIsSessionRunning() {
		void warn('App context session watcher state setter called before initialization');
	},
	setIpcProps() {
		void warn('App context ipc props setter called before initialization');
	},
});
