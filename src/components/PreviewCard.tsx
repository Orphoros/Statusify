import React, {useEffect, useState} from 'react';
import {
	Image, Button, Card, Tooltip, Badge, CardHeader, Divider, CardBody,
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
	const [largeImage, setLargeImage] = useState<string>(ipcProps.largeImage ?? '');
	const [smallImage, setSmallImage] = useState<string>(ipcProps.smallImage ?? '');
	const [placeholderLargeImage, setPlaceholderLargeImage] = useState<string>('');
	const [placeholderSmallImage, setPlaceholderSmallImage] = useState<string>('');
	const [currentTime, changeTime] = useState(new Date());

	(async () => {
		if (largeImage.isDefined() && smallImage.isDefined()) {
			return;
		}

		const l = await resolveResource('images/largeimage.svg');
		const largeSvg = await readTextFile(l);
		setPlaceholderLargeImage(`data:image/svg+xml;utf8,${encodeURIComponent(largeSvg)}`);
		if (largeImage.isEmpty()) {
			setLargeImage(placeholderLargeImage);
		}

		const s = await resolveResource('images/smallimage.svg');
		const smallSvg = await readTextFile(s);
		setPlaceholderSmallImage(`data:image/svg+xml;utf8,${encodeURIComponent(smallSvg)}`);
		if (smallImage.isEmpty()) {
			setSmallImage(placeholderSmallImage);
		}
	})().catch(error);

	useEffect(() => {
		const interval = setInterval(() => {
			changeTime(new Date());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		(async () => {
			if (ipcProps.largeImage?.isOnlineImage()) {
				setLargeImage(ipcProps.largeImage);
			} else {
				setLargeImage(placeholderLargeImage);
			}

			if (ipcProps.smallImage?.isOnlineImage()) {
				setSmallImage(ipcProps.smallImage);
			} else {
				setSmallImage(placeholderSmallImage);
			}
		})().catch(error);
	}, [ipcProps.largeImage, ipcProps.smallImage]);

	const handler = async () => {
		await message(`Clicking this button would open '${(ipcProps.buttonProtocol ?? '') + (ipcProps.buttonUrl ?? '')}' in the web-browser`, {title: 'Statusify', type: 'info'});
	};

	let secondsElapsed = 0;
	let minutesElapsed = 0;
	let hoursElapsed = 0;

	if (ipcProps.timeAsStart && currentTime.getTime() > ipcProps.timeAsStart) {
		const diff = Math.floor((currentTime.getTime() - ipcProps.timeAsStart) / 1000);
		secondsElapsed = diff;
		minutesElapsed = Math.floor(secondsElapsed / 60);
		hoursElapsed = Math.floor(minutesElapsed / 60);
	}

	const secondsToDisplay: string = secondsElapsed % 60 < 10 ? `0${secondsElapsed % 60}` : `${secondsElapsed % 60}`;
	const minutesToDisplay: string = minutesElapsed % 60 < 10 ? `0${minutesElapsed % 60}` : `${minutesElapsed % 60}`;
	const hoursToDisplay: string = hoursElapsed % 60 < 10 ? `0${hoursElapsed % 60}` : `${hoursElapsed % 60}`;

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
						&& <Badge
							draggable={false}
							disableAnimation
							className={`w-8 h-8 min-w-8 min-h-8 bottom-[12%] right-[12%] ${showVibrancy ? 'border-content1  border-opacity-50' : 'border-content2'}`}
							isInvisible={!showSmallImage(ipcProps)}
							isOneChar
							content={
								<Tooltip isDisabled={!showSmallImageText(ipcProps)} content={ipcProps.smallImageTooltip}>
									<Image
										draggable={false}
										radius='full'
										src={smallImage}
										alt='Small image'
										loading='lazy'
										className='object-cover w-7 h-7 min-w-7 min-h-7'
										onError={() => {
											setSmallImage(placeholderSmallImage);
										}}
									/>
								</Tooltip>
							} placement='bottom-right'>
							<Tooltip isDisabled={!showLargeImageText(ipcProps)} content={ipcProps.largeImageTooltip}>
								<Image
									draggable={false}
									radius='sm'
									loading='lazy'
									src={largeImage}
									alt='Large image'
									className='object-cover w-20 h-20'
									onError={() => {
										setLargeImage(placeholderLargeImage);
									}}
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
