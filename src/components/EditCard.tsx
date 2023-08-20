import React from 'react';
import {Card, CardBody} from '@nextui-org/react';
import {AppOptionForm, ButtonOptionForm, DetailsOptionForm, ImageOptionForm, PartyOptionForm, TimeOptionForm} from './options';

export default function EditCard() {
	return (
		<Card className='min-w-[400px] overflow-y-auto bg-content2' shadow='none' fullWidth radius='none'>
			<CardBody className='overflow-y-auto flex justify-between'>
				<AppOptionForm/>
				<DetailsOptionForm/>
				<PartyOptionForm/>
				<ImageOptionForm/>
				<TimeOptionForm/>
				<ButtonOptionForm/>
			</CardBody>
		</Card>
	);
}
