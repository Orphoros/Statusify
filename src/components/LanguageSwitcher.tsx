import React, {useState} from 'react';

import {Select, SelectItem} from '@nextui-org/select';
import localeCode from 'locale-code';
import i18next from 'i18next';
import countryCodeToFlagEmoji from 'country-code-to-flag-emoji';
import {useTauriContext} from '@/context';

export default function LanguageSwitcher() {
	const {setLaunchConfProps, locales, launchConfProps} = useTauriContext();

	const currentValue = launchConfProps.locale ?? 'en-US';
	const [loc, setLoc] = useState(currentValue);

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

	return (
		<Select
			className='w-40'
			defaultSelectedKeys={[currentValue]}
			selectionMode='single'
			disallowEmptySelection
			aria-label='Language'
			variant='bordered'
			size='sm'
			radius='full'
			startContent={
				countryCodeToFlagEmoji(loc)
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
				.map(locale => {
					const emoji = countryCodeToFlagEmoji(locale);
					return <SelectItem
						key={locale}
						value={capitalize(localeCode.getLanguageNativeName(locale))}
						startContent={
							emoji
						}
					>
						{capitalize(localeCode.getLanguageNativeName(locale))}
					</SelectItem>;
				})}
		</Select>
	);
}
