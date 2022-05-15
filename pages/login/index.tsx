import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import JsonWebToken from 'jsonwebtoken';
// import sha256 from 'crypto-js/sha256';
import { setCookie, getCookie } from '../../utils/cookie';
import apiAuth from '../api/auth';

import Button from '../../atoms/Button';

import styles from './Login.module.scss';
const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [idWarning, setIdWarning] = useState<boolean>(false);
  const [idWarningMessage, setIdWarningMessage] = useState<string>('');
  const [passwordWarning, setPasswordWarning] = useState<boolean>(false);
  const [passwordWarningMessage, setPasswordWarningMessage] = useState<string>('');

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

  const loginFunction = async () => {
    const data = {
      disabledErrorHandler: true,
      username: email,
      password: password.current?.value.toString(),
    };

    try {
      const response = await apiAuth.login(data);
      console.log('login response', response);
      // if (response.status === 200) {

      // }
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
