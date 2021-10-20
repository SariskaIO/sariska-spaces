import React, {useState} from 'react';
import SpaceFooterActions from '../SpaceFooterActions';
import ContentBox from '../../shared/ContentBox';
import DialogueHeader from '../../shared/DialogueHeader';
import ParticipantsList from '../../shared/ParticipantsList';

const ParticipantsGrid = ({dominantSpeakerId, handleLeave, handleMinimize}) => {
    const [localHandRaise, setLocalHandRaise] = useState(false);
    return (
        <ContentBox>
            <DialogueHeader handleLeave={handleLeave} handleMinimize={handleMinimize} closeTitle="Leave Space"/>
            <ParticipantsList dominantSpeakerId={dominantSpeakerId} localHandRaise={localHandRaise}/>
            <SpaceFooterActions dominantSpeakerId={dominantSpeakerId} setLocalHandRaise={setLocalHandRaise}/>
        </ContentBox>
    )
}

export default ParticipantsGrid
