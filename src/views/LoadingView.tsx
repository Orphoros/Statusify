import React from 'react';
import {Spinner} from '@nextui-org/react';
import {MudaMantle, MudaTitlebar} from '@/components/muda';
import {useTauriContext} from '@/context';

function LoadingView() {
	const {osType} = useTauriContext();
	return (
		<MudaMantle osType={osType!}>
			<MudaTitlebar osType={osType!} transparent hiddenTitle blend/>
			<div className='flex h-screen select-none cursor-default' data-tauri-drag-region>
				<div className='m-auto select-none cursor-default' data-tauri-drag-region>
					<div className='flex flex-col select-none cursor-default' data-tauri-drag-region>
						<Spinner/>
						<p className='mt-3 text-primary select-none cursor-default' data-tauri-drag-region>Loading</p>
					</div>
				</div>
			</div>
		</MudaMantle>
	);
}

export default LoadingView;
