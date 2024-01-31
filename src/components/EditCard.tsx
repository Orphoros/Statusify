import React from 'react';
import {Card, CardBody, Divider} from '@nextui-org/react';
import {AppOptionForm, ButtonOptionForm, DetailsOptionForm, ImageOptionForm, PartyOptionForm, TimeOptionForm} from './options';

export default function EditCard() {
	return (
		<Card className='min-w-[500px] overflow-y-auto bg-content2' shadow='none' fullWidth radius='none'>
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
