import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat/Chat';
import Game from './components/Game/Game';
import Lobby from './components/Lobby/Lobby';
import PlayerCreation from './components/PlayerCreation/PlayerCreation';
import configureStore from './store/configureStore';

const Room = ({ match }) => {
  return (
    <>
      <div className='small-logo'>
        <Image src={`/images/logo/doodle.gif`} />
      </div>
      <Row>
        <Col md='9'>
          <Container fluid className='room-container'>
            <Switch>
              <Route path={`${match.path}/:id`} exact component={Lobby} />
              <Route path={`${match.path}/:id/game`} exact component={Game} />
            </Switch>
          </Container>
        </Col>
        <Col md='3'>
          <Chat />
        </Col>
      </Row>
    </>
  );
};

const App = () => {
  const store = configureStore();

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path='/' exact>
            <Image src={`/images/logo/doodle.gif`} />
            <PlayerCreation />
          </Route>
          <Route path='/rooms' component={Room} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
