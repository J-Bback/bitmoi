import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

const App: NextPage = () => {
  const router = useRouter();
  useEffect((): void => {
    router.push({
      pathname: '/home',
      query: {
        tab: 'krw',
      },
    });
  }, []);
  return <div className={styles.container}></div>;
};

export default App;
