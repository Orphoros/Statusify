export type LaunchConfProps = {
	startIpcOnLaunch?: boolean;
	startAppOnLaunch?: boolean;
	logLevel?: 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'off';
	locale?: string;
};
