import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { setCookie, getCookie } from '../../utils/cookie';
import apiAuth from '../api/auth';
import apiLogin from '../api/login';
import AuthStore from '../../stores/AuthStore';

import Button from '../../atoms/Button';

import styles from './Login.module.scss';
const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [idWarning, setIdWarning] = useState<boolean>(false);
  const [idWarningMessage, setIdWarningMessage] = useState<string>('');
  const [passwordWarning, setPasswordWarning] = useState<boolean>(false);
  const [passwordWarningMessage, setPasswordWarningMessage] = useState<string>('');

  const store = new AuthStore();
  const router = useRouter();
  const password = useRef<any>();

  const emailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // validate email
    e.target.value = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    // set
    setEmail(e.target.value);
    return;
  };

  const goHome = () => {
    router.push(
      {
        pathname: '/home',
        query: { tab: 'krw' },
      },
      undefined,
      { shallow: true }
    );
    return;
  };

  const loginFunction = async () => {
    const data = {
      url: 'http://52.78.124.218:9000/user/login',
      body: {
        email: email,
        password: password.current?.value.toString(),
      },
    };

    try {
      const response: any = await apiLogin(data);
      // const responseJson: any = await response.json();
      const responseData: any = response?.data;
      if (response.status === 200) {
        if (responseData?.accessToken === '존재하지 않은 회원입니다.') {
          return alert('이메일 또는 비밀번호가 맞지 않습니다.');
        }
        if (!!responseData?.accessToken) {
          store.login(responseData.accessToken);
          // setCookie('token', responseData.accessToken, {
          //   path: '/',
          //   secure: true,
          //   sameSite: 'none',
          // });
          goHome();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginValidation = (e: any) => {
    e.preventDefault();

    if (email.trim().length === 0) {
      setIdWarning(true);
      setIdWarningMessage('아이디를 입력해주세요');
      setPasswordWarning(false);
      setPasswordWarningMessage('');
    }
    if (password.current.value?.trim().length === 0) {
      setPasswordWarning(true);
      setPasswordWarningMessage('비밀번호를 입력해주세요');
      setIdWarning(false);
      setIdWarningMessage('');
    }

    if (password.current.value?.trim().length !== 0 && email.trim().length !== 0) {
      setPasswordWarning(false);
      setPasswordWarningMessage('');
      setIdWarning(false);
      setIdWarningMessage('');
    }

    loginFunction();
  };

  const goSignup = () => {
    router.push({ pathname: '/signup' }, undefined, { shallow: true });
  };

  const resetPassword = () => {
    // 모달띄우기
    return alert('점검중입니다. acepark14@gmail.com 으로 문의 부탁드립니다.');
  };

  return (
    <div className={styles.container}>
      <form className={styles.login_wrap} onSubmit={(e: any) => loginValidation(e)}>
        <div className={styles.title}>로그인</div>
        <div className={styles.email_text}>E-mail</div>
        <input
          type="email"
          className={styles.input}
          placeholder={'email@example.com'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => emailValidation(e)}
        />
        <div className={styles.warning}>{idWarning && idWarningMessage}</div>
        <div className={styles.password_text}>Password</div>
        <input className={styles.input} placeholder={'비밀번호'} type="password" ref={password} />
        <div className={styles.warning}>{passwordWarning && passwordWarningMessage}</div>
        <div>
          <Button btnText="로그인" className={styles.login_button} btnClick={(e: any) => loginValidation(e)} />
        </div>
        <div className={styles.signup_button}>
          <div className={styles.signup} onClick={() => goSignup()}>{`회원가입`}</div>
          <div>{'|'}</div>
          <div className={styles.signup} onClick={() => resetPassword()}>
            {'비밀번호 재설정'}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
