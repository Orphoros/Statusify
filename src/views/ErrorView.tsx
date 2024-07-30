import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons';

function ErrorView({error}: {error?: string}) {
	return (
		<div className='flex h-screen cursor-default select-none'>
			<div className='m-auto'>
				<div className='flex flex-col text-center'>
					<FontAwesomeIcon className='text-danger-400 text-7xl' icon={faCircleExclamation} />
					<p className='mt-3 text-7xl text-danger-400'>Fatal Error</p>
					<p className='mt-3 text-2xl text-default-400'>Statusify could not start due to a fatal system error.</p>
					<p className='text-2xl text-default-400'>If the problem persists, try reinstalling the software.</p>
					<p className='mt-3 text-xl text-default-300 uppercase'>error: {error ?? 'unknown'}</p>
				</div>
			</div>
		</div>
	);
}

export default ErrorView;
