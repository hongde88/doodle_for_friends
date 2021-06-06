import Head from 'next/Head';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Logo from '../Logo/Logo';
import styles from './Layout.module.css';

const Layout = ({ children, home }) => {
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
      <Container fluid className={styles.container}>
        <header>
          {home ? (
            <Logo />
          ) : (
            <div className={styles.logoDiv}>
              <Logo />
            </div>
          )}
        </header>
        <main>{children}</main>
      </Container>
    </>
  );
};

export default Layout;
