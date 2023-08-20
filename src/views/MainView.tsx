import React from 'react';
import {TitleBar, EditCard, PreviewCard} from '@/components';

function MainView() {
	return (
		<div className='flex flex-col h-screen overflow-none'>
			<TitleBar/>
			<div className='flex flex-row overflow-hidden h-full'>
				<div className='basis-1/2 flex'>
					<EditCard/>
				</div>
				<div className='basis-1/2 flex justify-center items-center'>
					<PreviewCard />
				</div>
			</div>
		</div>
	);
}

export default MainView;
