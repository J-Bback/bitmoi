import { useRouter } from 'next/router';
import React, { useState, Fragment } from 'react';
import Image from 'next/image';
import Button from '../../atoms/Button';

import styles from './Nav.module.scss';

interface Props {
  setItem?: any;
  default?: string;
}

const Nav = (props: Props) => {
  const router = useRouter();
  const items = [
    { key: 'exchange', label: '거래소' },
    { key: 'ranking', label: '랭킹' },
    { key: 'asset', label: '보유자산' },
    { key: 'subscription', label: '구독' },
    { key: 'community', label: '커뮤니티' },
  ];

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
        <div className={styles.login_btn} onClick={() => goToLogin()}>
          {'로그인'}
        </div>
        <Button btnText="회원가입" className={styles.signup_btn} btnClick={() => goToSignUp()} />
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
