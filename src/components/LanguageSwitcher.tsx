import React, {useState} from 'react';

import {Select, SelectItem} from '@nextui-org/select';
import localeCode from 'locale-code';
import i18next from 'i18next';
import {useTauriContext} from '@/context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLanguage} from '@fortawesome/free-solid-svg-icons';

export default function LanguageSwitcher() {
	const {setLaunchConfProps, locales, launchConfProps} = useTauriContext();

	const currentValue = launchConfProps.locale ?? 'en-US';
	const [_, setLoc] = useState(currentValue);

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

	return (
		<Select
			defaultSelectedKeys={[currentValue]}
			selectionMode='single'
			disallowEmptySelection
			aria-label='Language'
			variant='flat'
			size='sm'
			radius='full'
			startContent={
				<FontAwesomeIcon icon={faLanguage} />
			}
			onChange={e => {
				if (e.target.value === '') {
					setLoc(currentValue);
				}

				const locale = locales.find(locale => locale === e.target.value)!;
				setLoc(locale);
				void i18next.changeLanguage(locale);
				setLaunchConfProps(prev => ({...prev, locale}));
			}}
		>
			{locales
				.sort()
				.map(locale => <SelectItem
					key={locale}
					value={capitalize(localeCode.getLanguageNativeName(locale))}
					startContent={
						<FontAwesomeIcon icon={faLanguage} />
					}
				>
					{capitalize(localeCode.getLanguageNativeName(locale))}
				</SelectItem>)}
		</Select>
	);
}
