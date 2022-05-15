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
  const cookies = serverCookie ? new Cookies(serverCookie) : new Cookies();
  const jwt = cookies.get(`${process.env.API_ENV}`);
  if (jwt && callback) {
    await callback(jwt);
  }
}

MyApp.getStaticProps = async (appContext: any) => {
  const mobxStore = initializeStore();
  appContext.ctx.mobxStore = mobxStore;
  appContext.ctx.isServer = typeof window === 'undefined';
  if (appContext.ctx.req && appContext.ctx.req.headers) {
    const uaParser = new UAParser(appContext.ctx.req.headers['user-agent']);

    if (uaParser.getBrowser().name === 'IE' && appContext.ctx.req.url !== '/notSupportedExploler') {
      appContext.ctx.res.writeHead(302, { Location: '/notSupportedExploler' });
      appContext.ctx.res.end();
      return;
    }

    if (appContext.ctx.isServer) {
      console.log('쿠키 요청 헤더', appContext.ctx.req.headers);
      console.log('인증 스토어 로그인', appContext.ctx.mobxStore.authStore.login);
      await login(appContext.ctx.req.headers.cookie, appContext.ctx.mobxStore.authStore.login); // authStore.login
    }
  }
  const appProps = await App.getInitialProps(appContext);
  return {
    ...appProps,
    initialMobxState: mobxStore,
  };
};

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider>
      <Head>
        <title>암호화폐 모의투자</title>
        <meta
          name="viewport"
          id="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="icon" href="/candlestick.png" />
      </Head>
      <Nav {...pageProps} />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
