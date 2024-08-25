import React from 'react';
import {Spinner} from '@nextui-org/react';
import {MudaMantle} from '@/components/muda';
import {useTauriContext} from '@/context';

function LoadingView() {
	const {osType} = useTauriContext();
	return (
		<MudaMantle osType={osType!}>
			<div className='flex h-screen select-none cursor-default'>
				<div className='m-auto select-none cursor-default'>
					<div className='flex flex-col select-none cursor-default'>
						<Spinner />
						<p className='mt-3 text-primary select-none cursor-default'>Loading</p>
					</div>
				</div>
			</div>
		</MudaMantle>
	);
}

export default LoadingView;
