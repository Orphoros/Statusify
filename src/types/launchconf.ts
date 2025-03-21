export type LaunchConfProps = {
	startIpcOnLaunch?: boolean;
	startAppOnLaunch?: boolean;
	theme?: 'light' | 'dark' | 'system';
	logLevel?: 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'off';
	locale?: string;
};
