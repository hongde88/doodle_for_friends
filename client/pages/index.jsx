import React from 'react';
import Layout from '../components/Layout/Layout';
import PlayerCreation from '../components/PlayerCreation/PlayerCreation';

const Home = () => {
  return (
    <Layout home>
      <PlayerCreation />
    </Layout>
  );
};

export default Home;
