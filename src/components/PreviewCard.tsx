import React, {useEffect, useState} from 'react';
import {
	Image, Button, Card, Tooltip, Badge, Avatar, CardHeader, Divider, CardBody,
} from '@nextui-org/react';
import {message} from '@tauri-apps/api/dialog';
import {resolveResource} from '@tauri-apps/api/path';
import {useTauriContext} from '@/context';
import {error} from 'tauri-plugin-log-api';
import {readTextFile} from '@tauri-apps/api/fs';
import {
	showButton, showCurrentTime, showDetails, showGivenTime, showLargeImage, showLargeImageText, showParty, showSmallImage, showSmallImageText, showState,
} from '@/lib';

export default function PreviewCard() {
	const {ipcProps, showVibrancy} = useTauriContext();

	const [largeImage, setLargeImage] = useState<string>('');
	const [smallImage, setSmallImage] = useState<string>('');

	useEffect(() => {
		const init = async () => {
			try {
				const l = await resolveResource('images/largeimage.svg');
				const largeSvg = await readTextFile(l);
				setLargeImage(largeSvg);

				const s = await resolveResource('images/smallimage.svg');
				const smallSvg = await readTextFile(s);
				setSmallImage(smallSvg);
			} catch (err) {
				void error(`error while setting images: ${err as string}`);
			}
		};

		init().catch(console.error);
	}, []);
	useEffect(() => {
		const id = setInterval(checkTime, 1000);
		return () => {
			clearInterval(id);
		};
	}, []);

	let time = new Date();
	const [currentTime, changeTime] = useState(time);
	const handler = async () => {
		await message(`Clicking this button would open '${(ipcProps.buttonProtocol ?? '') + (ipcProps.buttonUrl ?? '')}' in the web-browser`, {title: 'Statusify', type: 'info'});
	};

	let secondsElapsed = 0;
	let minutesElapsed = 0;
	let hoursElapsed = 0;

	if (ipcProps.timeAsStart && currentTime.getTime() > ipcProps.timeAsStart) {
		const diff = currentTime.getTime() - ipcProps.timeAsStart;
		secondsElapsed = Math.floor(diff / 1000);
		minutesElapsed = Math.floor(secondsElapsed / 60);
		hoursElapsed = Math.floor(minutesElapsed / 60);
	}

	const secondsToDisplay: string = secondsElapsed % 60 < 10 ? `0${secondsElapsed % 60}` : `${secondsElapsed % 60}`;
	const minutesToDisplay: string = minutesElapsed % 60 < 10 ? `0${minutesElapsed % 60}` : `${minutesElapsed % 60}`;
	const hoursToDisplay: string = hoursElapsed % 60 < 10 ? `0${hoursElapsed % 60}` : `${hoursElapsed % 60}`;

	function checkTime() {
		time = new Date();
		changeTime(time);
	}

	return (
		<Card className={`w-[380px] h-[300px] ${showVibrancy ? 'bg-content1  bg-opacity-50' : 'bg-content2'} rounded-2xl`} shadow='none'>
			<CardHeader>
				<p>Preview</p>
			</CardHeader>
			<Divider/>
			<CardBody>
				<div className='flex flex-col justify-center h-full'>
					<p className='text-sm font-bold mb-2'>PLAYING A GAME</p>
					<div className='flex gap-3 mb-4'>
						{showLargeImage(ipcProps)
						&& <Badge draggable={false} disableAnimation className='w-8 h-8 min-w-8 min-h-8 bottom-[12%] right-[12%]' isInvisible={!showSmallImage(ipcProps)} isOneChar content={
							<Tooltip isDisabled={!showSmallImageText(ipcProps)} content={ipcProps.smallImageTooltip}>
								<Image draggable={false} radius='full' src={`data:image/svg+xml;utf8,${encodeURIComponent(smallImage)}`} alt='Small image'/>
							</Tooltip>
						} placement='bottom-right'>
							<Tooltip isDisabled={!showLargeImageText(ipcProps)} content={ipcProps.largeImageTooltip}>
								<Avatar
									draggable={false}
									radius='sm'
									onDragStart={event => {
										event.preventDefault();
									}}
									className='w-20 h-20 text-large'
									src={`data:image/svg+xml;utf8,${encodeURIComponent(largeImage)}`}
									alt='Large image'
								/>
							</Tooltip>
						</Badge>}
						<div className='flex flex-col align justify-center truncate'>
							<p className='text-sm font-bold'>Your app name</p>
							{showDetails(ipcProps) && <p className='text-sm text-ellipsis overflow-hidden'>{ipcProps.details ?? ''}</p>}
							{showState(ipcProps) && <p className='text-sm'>{(ipcProps.state ?? '') + (showParty(ipcProps) ? (` (${ipcProps.partySize ?? 0} of ${ipcProps.partyMax ?? 0})`) : '')}</p>}
							{showGivenTime(ipcProps) && <p className='text-sm'>{`${hoursElapsed > 0 ? `${hoursToDisplay}:` : ''}${minutesToDisplay}:${secondsToDisplay} elapsed`}</p>}
							{showCurrentTime(ipcProps) && <p className='text-sm'>Current time here once started</p>}
						</div>
					</div>
					{showButton(ipcProps) && <Button className='rounded' color='primary' onClick={handler}>{ipcProps.buttonText}</Button>}
				</div>
			</CardBody>
		</Card>
	);
}
