
import React, {useEffect} from 'react'
import { Box, Typography } from "@mui/material";
import {Link, useParams} from 'react-router-dom';
import { styled } from "@mui/material/styles";
import {useSelector} from "react-redux";
import { color } from '../../assets/colors';

    const StyledBox = styled(Box)(({theme}) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        "& h3":{
            fontSize: '2rem',
            marginBottom: theme.spacing(4)
            }
      }));
      const Rejoin = styled(Link)(({theme}) => ({
        color: color.yellow,
            border: `1px solid ${color.yellow}`,
            borderRadius: '10px',
            textTransform: 'capitalize',
            textDecoration:'none',
            padding: theme.spacing(0.5, 2.5)
      }));
      const GoHome = styled(Link)(({theme}) => ({
        color: color.white,
                textDecoration:'none',
                border: `1px solid ${color.yellow}`,
                borderRadius: '10px',
                background: color.yellow,
                marginLeft: '20px',
                textTransform: 'capitalize',
                padding: theme.spacing(0.5, 2.5),
                "&:hover": {
                    color: color.yellow
                }
      }));

const Leave = () => {
    const spaceTitle  = useSelector(state=>state.profile?.spaceTitle);

    return (
        <StyledBox >
            <Typography variant="h3">You have left the Stage</Typography>
            <Box>
                <Rejoin to={`/${spaceTitle}`} >Rejoin</Rejoin>
                <GoHome to='/' >Go to Home</GoHome>
            </Box>
        </StyledBox>
    )
}

export default Leave
