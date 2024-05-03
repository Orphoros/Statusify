import {type OsType} from '@tauri-apps/api/os';
import {type Options, type Item} from 'tauri-plugin-context-menu/dist/types';
import {isFormCorrect, startIpc, stopIpc} from '@/lib';
import {type IpcProps} from '@/types';
import {invoke} from '@tauri-apps/api';

export class MenuOptionBuilder {
	private readonly options: Item[];
	constructor(private readonly e: React.MouseEvent<HTMLDivElement>, private readonly osType: OsType | undefined) {
		e.preventDefault();
		e.stopPropagation();
		this.options = [];
	}

	addSeparator(): this {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		this.options.push({is_separator: true});
		return this;
	}

	addCut(callback?: () => any): this {
		this.options.push({
			label: 'Cut',
			disabled: false,
			shortcut: this.osType! === 'Darwin' ? 'cmd+x' : 'ctrl+x',
			event() {
				const selection = window.getSelection();
				if (selection) {
					const text = selection.toString();
					if (text) {
						void navigator.clipboard.writeText(text);
					}
				}

				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addCopy(callback?: () => any): this {
		this.options.push({
			label: 'Copy',
			disabled: false,
			shortcut: this.osType! === 'Darwin' ? 'cmd+c' : 'ctrl+c',
			event() {
				const selection = window.getSelection();
				if (selection) {
					const text = selection.toString();
					if (text) {
						void navigator.clipboard.writeText(text);
					}
				}

				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addPaste(callback: () => any): this {
		this.options.push({
			label: 'Paste',
			disabled: false,
			shortcut: this.osType! === 'Darwin' ? 'cmd+v' : 'ctrl+v',
			event() {
				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addOpenInBrowser(url?: string): this {
		this.options.push({
			label: 'Open in Browser',
			disabled: !url,
			event() {
				void invoke('open_url', {url: url!});
			},
		});
		return this;
	}

	addToggleDisableOption(callback: () => any): this {
		this.options.push({
			label: 'Toggle Option',
			disabled: false,
			event() {
				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addClearOption(callback: () => any): this {
		this.options.push({
			label: 'Clear Field',
			disabled: false,
			event() {
				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	addStartIpc(isSessionRunning: boolean, setIsSessionRunning: React.Dispatch<React.SetStateAction<boolean>>, ipcProps: IpcProps, callback?: () => any): this {
		this.options.push({
			label: 'Start Rich Presence',
			disabled: isSessionRunning || !ipcProps.id || !isFormCorrect(ipcProps),
			event() {
				void startIpc(ipcProps, true).then(isSuccess => {
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

	addStopIpc(isSessionRunning: boolean, setIsSessionRunning: React.Dispatch<React.SetStateAction<boolean>>, callback?: () => any): this {
		this.options.push({
			label: 'Stop Rich Presence',
			disabled: !isSessionRunning,
			event() {
				void stopIpc(false);
				setIsSessionRunning(false);
				if (callback) {
					callback();
				}
			},
		});
		return this;
	}

	build(): Options {
		return {items: this.options};
	}
}
