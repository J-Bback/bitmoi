import React, { useState, Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Button from '../../atoms/Button';
import initializeStore from '../../stores';
import { removeCookie } from '../../utils/cookie';

import styles from './Nav.module.scss';

interface Props {
  setItem?: any;
  default?: string;
}

const Nav = (props: any) => {
  const router = useRouter();
  const store = initializeStore();
  const { authStore } = store;

  const [isUser, setIsUser] = useState<boolean>(false);
  const items = [
    { key: 'exchange', label: '거래소' },
    { key: 'ranking', label: '랭킹' },
    { key: 'asset', label: '보유자산' },
    // { key: 'subscription', label: '구독' },
    // { key: 'community', label: '커뮤니티' },
  ];

  useEffect(() => {
    console.log('authStore.jwt', authStore.jwt);
    console.log('authStore.logged === true', authStore.logged);
    if (authStore.jwt && authStore.logged === true) {
      setIsUser(true);
    }
  }, [router.pathname]);

  const selectItem = (key: string) => {
    if (!router.pathname.includes(key)) {
      if (key === 'home') {
        router.push(
          {
            pathname: '/home',
            query: { tab: 'krw' },
          },
          undefined,
          { shallow: true }
        );
        return;
      }
      if (key === 'exchange') {
        router.push(
          {
            pathname: '/exchange',
            query: { tab: 'krw' },
          },
          undefined,
          { shallow: true }
        );
        return;
      }
      router.push({ pathname: `/${key}` }, undefined, { shallow: true });
    }
  };

  const goToLogin = () => {
    return router.push(
      {
        pathname: '/login',
      },
      undefined,
      { shallow: true }
    );
  };

  const goToLogout = () => {
    removeCookie('token');
    alert('로그아웃 되었습니다.');
    window.location.reload();
    return router.push(
      {
        pathname: '/home',
        query: { tab: 'krw' },
      },
      undefined,
      { shallow: true }
    );
  };

  const goToSignUp = () => {
    return router.push(
      {
        pathname: '/signup',
      },
      undefined,
      { shallow: true }
    );
  };

  const renderItems = () => {
    return (
      <div className={styles.item_container}>
        <div className={styles.nav_logo} onClick={() => selectItem('home')}>
          <Image src="/images/candlestick.png" alt="Search Button" width={40} height={40} />
          <div className={router.pathname.includes('home') ? styles.active_title : styles.logo_title}>{'BITMOI'}</div>
        </div>
        <div className={styles.itemWrap}>
          {items.map((v, i) => {
            return (
              <div
                key={'nav' + i}
                className={router.pathname.includes(v.key) ? styles.activeItem : styles.item}
                onClick={() => selectItem(v.key)}>
                {v.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    return (
      <div className={styles.button_wrap}>
        {isUser ? (
          <div className={styles.logout_wrap}>
            <div className={styles.username}>{`${authStore.name} 님`}</div>
            <div className={styles.login_btn} onClick={() => goToLogout()}>
              {`로그아웃`}
            </div>
          </div>
        ) : (
          <Fragment>
            <div className={styles.login_btn} onClick={() => goToLogin()}>
              {'로그인'}
            </div>
            <Button btnText="회원가입" className={styles.signup_btn} btnClick={() => goToSignUp()} />
          </Fragment>
        )}
      </div>
    );
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.nav_container}>
        {renderItems()}
        {renderButtons()}
      </div>
    </nav>
  );
};

export default Nav;
