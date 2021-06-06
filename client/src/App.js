import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat/Chat';
import Game from './components/Game/Game';
import Lobby from './components/Lobby/Lobby';
import Logo from './components/Logo/Logo';
import Splash from './pages/Splash/Splash';
import configureStore from './store/configureStore';

const Room = ({ match }) => {
  return (
    <>
      <div className='small-logo'>
        <Logo size='sm' />
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
            <Splash />
          </Route>
          <Route path='/rooms' component={Room} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
