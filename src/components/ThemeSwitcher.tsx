import React from 'react';

import {Select, SelectItem} from '@heroui/select';
import {useTauriContext} from '@/context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	faPalette, faSun, faMoon, faDesktop,
} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'next-themes';
import {debug} from 'tauri-plugin-log-api';
import {invoke} from '@tauri-apps/api';

function themeToCode(theme: string) {
	switch (theme) {
		case 'opt-theme-light':
			return 'light';
		case 'opt-theme-dark':
			return 'dark';
		case 'opt-theme-sys':
			return 'system';
		default:
			return 'system';
	}
}

function codeToTheme(code: string | undefined) {
	if (!code) {
		return 'opt-theme-sys';
	}

	switch (code) {
		case 'light':
			return 'opt-theme-light';
		case 'dark':
			return 'opt-theme-dark';
		case 'system':
			return 'opt-theme-sys';
		default:
			return 'opt-theme-sys';
	}
}

export default function ThemeSwitcher() {
	const {setLaunchConfProps, osType} = useTauriContext();
	const {theme, setTheme} = useTheme();
	const {t} = useTranslation('cpt-settings');

	const themes = [
		{key: 'opt-theme-light', icon: faSun},
		{key: 'opt-theme-dark', icon: faMoon},
		{key: 'opt-theme-sys', icon: faDesktop},
	];

	const currentValue = codeToTheme(theme);

	return (
		<Select
			defaultSelectedKeys={[currentValue]}
			selectionMode='single'
			disallowEmptySelection
			aria-label='Theme'
			variant='flat'
			size='sm'
			radius='full'
			startContent={
				<FontAwesomeIcon icon={faPalette} />
			}
			onSelectionChange={async e => {
				const theme = e.currentKey;
				if (!theme) {
					return;
				}

				const themeCode = themeToCode(theme);

				if (osType !== 'Darwin') {
					setTheme(themeCode);
					setLaunchConfProps(prev => ({...prev, theme: themeCode}));
					void debug(`set theme to ${themeCode}`);
					return;
				}

				invoke('plugin:theme|set_theme', {
					theme: themeCode === 'system' ? 'auto' : themeCode,
				}).then(() => {
					setTheme(themeCode);
					setLaunchConfProps(prev => ({...prev, theme: themeCode}));
					void debug(`set theme to ${themeCode}`);
				}).catch(e => {
					void debug(`failed to set theme to auto: ${e}`);
				});
			}}
		>
			{themes.map(locale => <SelectItem
				key={locale.key}
				startContent={
					<FontAwesomeIcon icon={locale.icon} />
				}
			>
				{t(locale.key)}
			</SelectItem>)}
		</Select>
	);
}
