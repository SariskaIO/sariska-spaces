import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import RootButton from "../../components/shared/RootButton";
import SariskaMediaTransport from "sariska-media-transport";
import { useHistory, useParams } from "react-router-dom";

const StyledStack = styled(Stack)(() => ({
  width: "100%",
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
}));

const Home = () => {
  const [ homeButonText] = useState("Get Space Terms");
  const history = useHistory();
  const queryParams = useParams();
  const urlSearchParams = new URLSearchParams(window.location.search);
  let spaceType = Object.fromEntries(urlSearchParams?.entries())?.spacetype;
  let userRole = Object.fromEntries(urlSearchParams?.entries())?.role;
  SariskaMediaTransport.initialize();
  SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR

  const handleSetTerms = () => {
    
    console.log("userRole", userRole, spaceType)
    if (queryParams.spaceId && userRole !== undefined && spaceType  !== undefined) {
      history.push(`/terms/${queryParams.spaceId}?spacetype=${spaceType}&role=${userRole}`);
    } else if ( queryParams.spaceId ) {
      history.push(`/terms/${queryParams.spaceId}`);
    } else {
      history.push("/terms");
    }
  }
  
  return (
    <StyledStack direction="column">
      <RootButton
        variant="extended"
        size="small"
        buttonText={homeButonText}
        onClick={handleSetTerms}
      />
    </StyledStack>
  );
};

export default Home;
