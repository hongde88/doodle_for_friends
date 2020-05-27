import Head from 'next/Head';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Logo from '../Logo/Logo';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Doodle</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Can you guess what your friend is doodling?'
        />
        <meta name='og:title' content='Doodle' />
      </Head>
      <Container fluid>
        <header>
          <Logo />
        </header>
        <main>{children}</main>
      </Container>
    </>
  );
};

export default Layout;
