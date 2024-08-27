import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import {MudaMantle, MudaTitlebar} from '@/components/muda';
import {useTauriContext} from '@/context';

function ErrorView({error}: {error?: string}) {
	const {osType} = useTauriContext();

	return (
		<MudaMantle osType={osType!}>
			<MudaTitlebar osType={osType!} transparent hiddenTitle blend/>
			<div className='flex h-screen cursor-default select-none' data-tauri-drag-region>
				<div className='m-auto' data-tauri-drag-region>
					<div className='flex flex-col text-center' data-tauri-drag-region>
						<FontAwesomeIcon className='text-danger-400 text-7xl' icon={faCircleExclamation}/>
						<p className='mt-3 text-7xl text-danger-400' data-tauri-drag-region>Fatal Error</p>
						<p className='mt-3 text-xl text-default-400' data-tauri-drag-region>Statusify encountered a fatal error and can no longer operate. Restart the application.</p>
						<p className='text-xl text-default-400' data-tauri-drag-region>For detailed information, check the logs. If the problem persists, try reinstalling the software.</p>
						<p className='text-xl text-default-400' data-tauri-drag-region></p>
						<p className='mt-5 text-lg text-default-300 uppercase' data-tauri-drag-region>error: {error ?? 'unknown'}</p>
					</div>
				</div>
			</div>
		</MudaMantle>
	);
}

export default ErrorView;
