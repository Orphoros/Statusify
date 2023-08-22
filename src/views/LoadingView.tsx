import React from 'react';
import {Spinner} from '@nextui-org/react';

function MainView() {
	return (
		<div className='flex h-screen'>
			<div className='m-auto'>
				<div className='flex flex-col'>
					<Spinner />
					<p className='mt-3 text-primary'>Loading</p>
				</div>
			</div>
		</div>
	);
}

export default MainView;
