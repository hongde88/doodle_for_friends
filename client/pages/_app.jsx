import React from 'react';
import '../styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
