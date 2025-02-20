import React, {useEffect, useState} from 'react';
import {appWindow} from '@tauri-apps/api/window';
import {default as AppTitleBar} from 'frameless-titlebar-fork';
import {type OsType} from '@tauri-apps/api/os';

type MudaTitlebarProps = {
	children?: React.ReactNode;
	osType: OsType;
	title?: string;
	hiddenTitle?: boolean;
	transparent?: boolean;
	blend?: boolean;
};

export default function MudaTitlebar({
	children,
	osType,
	title = 'Statusify',
	hiddenTitle = false,
	transparent = false,
	blend = false,
}: MudaTitlebarProps) {
	type Platform = 'win32' | 'linux' | 'darwin';
	const [platform, setPlatform] = useState<Platform | undefined>('darwin');
	const [maximized, setMaximized] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const unlisten = await appWindow.onResized(async () => {
				const isMaximized = await appWindow.isMaximized();
				setMaximized(isMaximized);
			});
			return () => {
				unlisten();
			};
		})();

		const titlebar = document.querySelector('.style_Bar__nNJjZ');
		if (titlebar) {
			titlebar.setAttribute('data-tauri-drag-region', 'true');
		}
	}, []);

	useEffect(() => {
		switch (osType) {
			case 'Darwin':
				setPlatform('darwin');
				break;
			case 'Windows_NT':
				setPlatform('win32');
				break;
			case 'Linux':
				setPlatform('linux');
				break;
		}
	}, [osType]);

	return (
		<div className={
			`statusify-titlebar *:cursor-default *:select-none ${osType === 'Darwin' ? '*:px-2' : ''} ${blend ? ' *:absolute *:top-0 *:left-0 *:right-0 *:z-50' : ''
			}`}>
			<AppTitleBar
				platform={platform}
				title={hiddenTitle ? '' : title}
				theme={{
					bar: {
						background: transparent ? 'transparent' : '#006FEE',
						height: '50px',
						borderBottom: 'none',
						title: {
							align: platform === 'darwin' ? 'center' : 'left',
						},
					},
					controls: {
						border: 'none',
						layout: 'right',
						normal: {
							default: {
								color: 'inherit',
								background: 'transparent',
							},
							hover: {
								color: '#fff',
								background: 'rgba(255,255,255,0.3)',
							},
						},
						close: {
							default: {
								color: 'inherit',
								background: 'transparent',
							},
							hover: {
								color: '#fff',
								background: '#e81123',
							},
						},
					},
				}}
				onMinimize={() => {
					void appWindow.minimize();
				}}
				maximized={maximized}
				onMaximize={() => {
					if (maximized) {
						void appWindow.unmaximize();
					} else {
						void appWindow.maximize();
					}
				}}
				onClose={() => {
					void appWindow.hide();
				}}
			>
				{children}
			</AppTitleBar>
		</div>
	);
}
