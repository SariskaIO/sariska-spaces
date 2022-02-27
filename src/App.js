import React, { Fragment } from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import Home from './views/home';
import Leave from './views/Leave';
import Space from './views/Space';
import InviteMembers from './views/InviteMembers';
import InviteCoHosts from './views/InviteCoHosts';
import InviteSpeakers from './views/InviteSpeakers';
import SpaceTerms from './views/Terms';
import StartSpace from './views/StartSpace';

function App() {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/terms/:spaceId?" component={SpaceTerms} />
        <Route exact path="/start/:spaceId?" component={StartSpace} />
        <Route exact path="/leave/:spaceId" component={Leave} />
        <Route exact path='/invite/:spaceId?' component={InviteMembers} />
        <Route exact path='/invite/co-host/:spaceId' component={InviteCoHosts} />
        <Route exact path='/invite/speaker/:spaceId' component={InviteSpeakers} />
        <Route exact path='/:spaceId' component={Space} />
      </Switch>
    </Fragment>
  );
}

export default App;
