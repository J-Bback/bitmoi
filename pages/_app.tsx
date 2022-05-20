import React, { Fragment } from 'react';
import { Provider } from 'mobx-react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import App from 'next/app';
import Cookies from 'universal-cookie';
import type { AppProps } from 'next/app';
import { UAParser } from 'ua-parser-js';

import initializeStore from '../stores';
import Nav from '../components/Nav';
import '../styles/globals.css';
import '../styles/slider.css';

async function login(serverCookie: any, callback: any) {
  // const cookies = serverCookie ? new Cookies(serverCookie) : new Cookies();
  const tokenFromLocalStorage = localStorage.getItem('token');
  // const jwt = cookies.get('token');
  // if (jwt && callback) {
  //   await callback(jwt);
  // }
  if (tokenFromLocalStorage && callback) {
    await callback(tokenFromLocalStorage);
  }
}

// MyApp.getinitialProps = async (ctx: any) => {
//   const mobxStore = initializeStore();
//   ctx.mobxStore = mobxStore;
//   ctx.isServer = typeof window === 'undefined';
//   if (ctx.req && ctx.req.headers) {
//     const uaParser = new UAParser(ctx.req.headers['user-agent']);

//     if (uaParser.getBrowser().name === 'IE' && ctx.req.url !== '/notSupportedExploler') {
//       ctx.res.writeHead(302, { Location: '/notSupportedExploler' });
//       ctx.res.end();
//       return;
//     }

//     if (ctx.isServer) {
//       await login(ctx.req.headers.cookie, ctx.mobxStore.authStore.login); // authStore.login
//     }
//   }
//   const appProps = await App.getInitialProps(ctx);
//   return {
//     ...appProps,
//     initialMobxState: mobxStore,
//   };
// };

function MyApp({ Component, pageProps }: any) {
  const isServer = typeof window === 'undefined';
  const store = initializeStore();
  const { authStore } = store;
  // if (isServer) {
  login(null, authStore.login);
  // }

  return (
    <Provider {...store}>
      <Head>
        <title>암호화폐 모의투자</title>
        <meta
          name="viewport"
          id="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="icon" href="/candlestick.png" />
      </Head>
      <Nav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
