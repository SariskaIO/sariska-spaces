import { Box, styled, Typography} from '@mui/material'
import React from 'react';
import { color } from '../../../assets/colors';

const CaptionContainer = styled(Box)(()=>({
    height: '70px',
    overflow: 'auto',
    borderTop: `1px solid ${color.border}`,
    borderBottom: `1px solid ${color.border}`,
}))
const Caption = styled(Typography)(()=>({
    fontSize: '0.8rem'
}))

const CaptionBox = () => {
    return (
        <CaptionContainer>
            <Caption>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe debitis maxime, non veniam sit neque qui eos reprehenderit impedit, ullam dignissimos atque? Voluptates minima, voluptatibus dolorem possimus quia eius voluptate. Amet at hic reiciendis quasi qui maxime itaque voluptatibus officia!
            </Caption>
        </CaptionContainer>
    )
}

export default CaptionBox
