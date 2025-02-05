import React from 'react';
import {Card, CardBody, Divider} from '@heroui/react';
import {
	AppOptionForm, ButtonOptionForm, DetailsOptionForm, ImageOptionForm, PartyOptionForm, TimeOptionForm,
} from './options';
import {useTauriContext} from '@/context';

export default function EditCard() {
	const {showVibrancy} = useTauriContext();
	return (
		<Card
			className={`min-w-[500px] overflow-y-auto ${showVibrancy ? 'bg-content1 bg-opacity-50' : 'bg-content2'} rounded-2xl`}
			shadow='none'
			fullWidth radius='none'
		>
			<CardBody className='overflow-y-auto flex justify-between gap-5'>
				<AppOptionForm/>
				<Divider/>
				<DetailsOptionForm/>
				<Divider/>
				<PartyOptionForm/>
				<Divider/>
				<ImageOptionForm/>
				<Divider/>
				<TimeOptionForm/>
				<Divider/>
				<ButtonOptionForm/>
			</CardBody>
		</Card>
	);
}
