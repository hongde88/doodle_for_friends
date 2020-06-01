import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import Lobby from './components/Lobby/Lobby';
import PlayerCreation from './components/PlayerCreation/PlayerCreation';
import configureStore from './store/configureStore';

const App = () => {
  const store = configureStore();

  return (
    <Provider store={store}>
      <Router>
        <Container>
          <Switch>
            <Route path='/' exact>
              <Image src={`/images/logo/doodle.gif`} />
              <PlayerCreation />
            </Route>
            <Route path='/rooms/:id' exact>
              <div className='smallLogo'>
                <Image src={`/images/logo/doodle.gif`} />
              </div>
              <Lobby />
            </Route>
          </Switch>
        </Container>
      </Router>
    </Provider>
  );
};

export default App;
