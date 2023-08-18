import React from 'react';
import {TitleBar, EditCard, PreviewCard} from '@/components';
import {useTauriContext} from '@/context';

function MainView() {
	const {ipcProps, setIpcProps} = useTauriContext();

	return (
		<div className='flex flex-col h-screen overflow-none'>
			<TitleBar/>
			<div className='flex flex-row overflow-hidden h-full'>
				<div className='basis-1/2 flex'>
					<EditCard onAppChange={id => {
						setIpcProps(prev => ({...prev, id}));
					}}
					onAppError={e => {
						setIpcProps(prev => ({...prev, idError: e}));
					}}
					onDetailsChange={(d, s, dEnable, sEnable) => {
						setIpcProps(prev => ({...prev, details: d, state: s, detailsEnabled: dEnable, stateEnabled: sEnable}));
					}}
					onDetailsError={(dError, sError) => {
						setIpcProps(prev => ({...prev, detailsError: dError, stateError: sError}));
					}}
					onPartyChange={(min, max, enabled) => {
						const minNum = parseInt(min, 10);
						const maxNum = parseInt(max, 10);
						setIpcProps(prev => ({...prev, partySize: minNum, partyMax: maxNum, partyEnabled: enabled}));
					}}
					onPartyError={e => {
						setIpcProps(prev => ({...prev, partyError: e}));
					}}
					onImageChange={(large, small, largeEnable, smallEnable) => {
						setIpcProps(prev => ({...prev, largeImage: large, smallImage: small, largeImageEnabled: largeEnable, smallImageEnabled: smallEnable}));
					}}
					onTooltipChange={(large, small, largeEnable, smallEnable) => {
						setIpcProps(prev => ({...prev, largeImageTooltip: large, smallImageTooltip: small, largeImageTooltipEnabled: largeEnable, smallImageTooltipEnabled: smallEnable}));
					}}
					onImageError={(lErr, sErr) => {
						setIpcProps(prev => ({...prev, largeImageTooltipError: lErr, smallImageTooltipError: sErr}));
					}}
					onTimeChange={(t, useCurrent, enabled) => {
						const epoch = t.getTime();
						setIpcProps(prev => ({...prev, timeAsStart: epoch, timeIsCurrent: useCurrent, timeEnabled: enabled}));
					}}
					onButtonChange={(text, url, protocol, enabled) => {
						setIpcProps(prev => ({...prev, buttonText: text, buttonUrl: url, buttonProtocol: protocol, buttonEnabled: enabled}));
					}}
					onButtonError={e => {
						setIpcProps(prev => ({...prev, buttonError: e}));
					}}
					detailsEnabled={!ipcProps.idError}
					partyEnabled={!(ipcProps.idError ?? false) && (ipcProps.stateEnabled ?? false) && (ipcProps.detailsEnabled ?? false)}
					imageEnabled={!ipcProps.idError}
					timeEnabled={!ipcProps.idError}
					buttonEnabled={!ipcProps.idError}
					/>
				</div>
				<div className='basis-1/2 flex justify-center items-center'>
					<PreviewCard />
				</div>
			</div>
		</div>
	);
}

export default MainView;
