import React from 'react';

import {useTauriContext} from '@/context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGear} from '@fortawesome/free-solid-svg-icons';
import {
	Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownSection, DropdownItem,
	Switch,
} from '@nextui-org/react';
import {error, debug} from 'tauri-plugin-log-api';
import {isEnabled, enable, disable} from 'tauri-plugin-autostart-api';
import {useTranslation} from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Settings() {
	const {launchConfProps, setLaunchConfProps} = useTauriContext();
	const {t} = useTranslation('cpt-settings');

	return (
		<Dropdown
			showArrow
			closeOnSelect={false}
			classNames={{
				base: 'before:bg-default-200',
				content: 'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
			}}
		>
			<DropdownTrigger>
				<Button
					variant='light'
					isIconOnly
					disableRipple
					className='text-white'
				>
					<FontAwesomeIcon icon={faGear} />
				</Button>
			</DropdownTrigger>
			<DropdownMenu variant='faded'>
				<DropdownSection title={t('lbl-title')}>
					<DropdownItem
						key='system-start'
						isReadOnly
						className='hover:cursor-auto hover:border-transparent'
					>
						<Switch
							size='sm'
							isSelected={launchConfProps.startAppOnLaunch}
							onValueChange={
								async enabled => {
									setLaunchConfProps(prev => ({...prev, startAppOnLaunch: enabled}));
									isEnabled()
										.then(async sysStartEnabled => {
											try {
												if (enabled && !sysStartEnabled) {
													await enable();
													void debug('enabled autostart with the system');
												} else if (!enabled && sysStartEnabled) {
													await disable();
													void debug('disabled autostart with the system');
												}
											} catch (e) {
												void error('could set autostart with the system');
											}
										})
										.catch(async () => {
											void error('could not get autostart status');
										});
								}
							}
						>
							{t('chk-system-start')}
						</Switch>
					</DropdownItem>
					<DropdownItem
						key='system-start'
						isReadOnly
						className='hover:cursor-auto hover:border-transparent'
						showDivider
					>
						<Switch
							size='sm'
							isSelected={launchConfProps.startIpcOnLaunch}
							onValueChange={
								enabled => {
									void debug(`set startIpcOnLaunch to ${enabled}`);
									setLaunchConfProps(prev => ({...prev, startIpcOnLaunch: enabled}));
								}
							}
						>
							{t('chk-rpc-autostart')}
						</Switch>
					</DropdownItem>
					<DropdownItem
						key='system-start'
						isReadOnly
						className='hover:cursor-auto hover:border-transparent'
					>
						<LanguageSwitcher />
					</DropdownItem>
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}
