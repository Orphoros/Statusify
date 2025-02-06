import React, {useEffect, useState} from 'react';
import {type OsType} from '@tauri-apps/api/os';
import {appWindow} from '@tauri-apps/api/window';

type MudaMantleProps = {
	children: React.ReactNode;
	osType: OsType;
};

export default function MudaMantle({children, osType}: MudaMantleProps) {
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
	}, []);

	return (
		<div className={`h-screen overflow-none ${osType !== 'Darwin' && !maximized ? 'border-gray-900 border-1' : ''}`}>
			{children}
		</div>
	);
}
