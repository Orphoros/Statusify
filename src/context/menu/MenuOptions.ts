import {useId} from 'react';
import {type OsType} from '@tauri-apps/api/os';
import {readText, writeText} from '@tauri-apps/api/clipboard';
import {isFormCorrect, startIpc, stopIpc} from '@/lib';
import {type IpcProps} from '@/types';
import {invoke} from '@tauri-apps/api';
import {type TFunction} from 'i18next';
import {type Item} from '@/components/muda';
import {
	faCopy, faCut, faEraser, faGlobe, faPaste, faPlay, faStop,
	faToggleOff,
} from '@fortawesome/free-solid-svg-icons';

export class MenuOptionBuilder {
	private readonly options: Item[];
	constructor(private readonly t: TFunction<'lib-ctx-menu'>, private readonly osType: OsType | undefined) {
		this.options = [];
	}

	addSeparator(): this {
		this.options[this.options.length - 1].isSeparator = true;
		return this;
	}

	addCut(text: string | undefined, callback?: () => any): this {
		this.options.push({
			label: this.t('lbl-cut'),
			key: useId(),
			disabled: false,
			icon: faCut,
			shortcut: this.osType! === 'Darwin' ? '⌘ X' : 'Ctrl X',
			onClick() {
				if (text) {
					void writeText(text);
				}

				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addCopy(text: string | undefined, callback?: () => any): this {
		this.options.push({
			label: this.t('lbl-copy'),
			key: useId(),
			disabled: false,
			icon: faCopy,
			shortcut: this.osType! === 'Darwin' ? '⌘ C' : 'Ctrl C',
			onClick() {
				if (text) {
					void writeText(text);
				}

				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addPaste(callback?: (t: string | undefined) => any): this {
		this.options.push({
			label: this.t('lbl-paste'),
			key: useId(),
			disabled: false,
			icon: faPaste,
			shortcut: this.osType! === 'Darwin' ? '⌘ V' : 'Ctrl V',
			onClick() {
				if (callback) {
					void readText().then(t => {
						callback(t as string | undefined);
					});
				}
			},
		});
		return this;
	}

	addOpenInBrowser(url?: string): this {
		this.options.push({
			label: this.t('lbl-open-browser'),
			key: useId(),
			disabled: !url,
			icon: faGlobe,
			onClick() {
				void invoke('open_url', {url: url!});
			},
		});
		return this;
	}

	addToggleDisableOption(callback?: () => any): this {
		this.options.push({
			label: this.t('lbl-toggle'),
			key: useId(),
			disabled: false,
			icon: faToggleOff,
			onClick() {
				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addClearOption(callback?: () => any): this {
		this.options.push({
			label: this.t('lbl-clear'),
			disabled: false,
			icon: faEraser,
			key: useId(),
			onClick() {
				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addStartIpc(t: TFunction<'lib-rpc-handle'>, isSessionRunning: boolean, setIsSessionRunning: React.Dispatch<React.SetStateAction<boolean>>, ipcProps: IpcProps, callback?: () => any): this {
		this.options.push({
			label: this.t('lbl-start'),
			key: useId(),
			disabled: isSessionRunning || !ipcProps.id || !isFormCorrect(ipcProps),
			icon: faPlay,
			onClick() {
				void startIpc(t, ipcProps, true).then(isSuccess => {
					if (isSuccess) {
						setIsSessionRunning(true);
					}
				});
				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addStopIpc(t: TFunction<'lib-rpc-handle'>, isSessionRunning: boolean, setIsSessionRunning: React.Dispatch<React.SetStateAction<boolean>>, callback?: () => any): this {
		this.options.push({
			label: this.t('lbl-stop'),
			disabled: !isSessionRunning,
			icon: faStop,
			key: useId(),
			onClick() {
				void stopIpc(t, false);
				setIsSessionRunning(false);
				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	build(): Item[] {
		return this.options;
	}
}
