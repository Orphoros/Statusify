import React from 'react';
import {NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import TauriProvider from './TauriProvider';

export default function AppProvider({children}: {children: React.ReactNode}) {
	return (
		<NextUIProvider>
			<NextThemesProvider attribute='class' defaultTheme='system'>
				<TauriProvider>
					{children}
				</TauriProvider>
			</NextThemesProvider>
		</NextUIProvider>
	);
}
