import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import JsonWebToken from 'jsonwebtoken';
// import sha256 from 'crypto-js/sha256';
import { setCookie, getCookie } from '../../utils/cookie';
import apiAuth from '../api/auth';

import Button from '../../atoms/Button';

import styles from './Signup.module.scss';
const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [idWarning, setIdWarning] = useState<boolean>(false);
  const [idWarningMessage, setIdWarningMessage] = useState<string>('');
  const [passwordWarning, setPasswordWarning] = useState<boolean>(false);
  const [password2Warning, setPassword2Warning] = useState<boolean>(false);
  const [passwordWarningMessage, setPasswordWarningMessage] = useState<string>('');
  const [password2WarningMessage, setPassword2WarningMessage] = useState<string>('');

  const router = useRouter();
  const password = useRef<any>();
  const password2 = useRef<any>();

  const emailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // validate email
    e.target.value = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    // set
    setEmail(e.target.value);
    return;
  };

  const validateEmail = async () => {
    const data = {
      url: `https://api.bitmoi.com/users/join/check?${email}`,
      password: password.current?.value.toString(),
    };

    try {
      const response = await apiAuth.validateEmail(data);
      console.log('login response', response);
      // if (response.status === 200) {

      // }
    } catch (error) {
      console.log(error);
    }
  };

  const signupFunction = async () => {
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

  const signupValidation = (e: any) => {
    e.preventDefault();

    if (email.trim().length === 0) {
      setIdWarning(true);
      setIdWarningMessage('아이디를 입력해주세요');
      return;
      // setPasswordWarning(false);
      // setPasswordWarningMessage('');
    }
    if (password.current.value?.trim().length === 0) {
      setPasswordWarning(true);
      setPasswordWarningMessage('비밀번호를 입력해주세요');
      return;
      // setIdWarning(false);
      // setIdWarningMessage('');
    }
    if (password2.current.value?.trim().length === 0) {
      setPassword2Warning(true);
      setPassword2WarningMessage('비밀번호를 입력해주세요');
      return;
      // setIdWarning(false);
      // setIdWarningMessage('');
    }

    if (
      password2.current.value?.trim().length !== 0 &&
      password.current.value?.trim().length !== 0 &&
      email.trim().length !== 0
    ) {
      setPasswordWarning(false);
      setPasswordWarningMessage('');
      setIdWarning(false);
      setIdWarningMessage('');
    }

    signupFunction();
  };

  const goLogin = () => {
    router.push({ pathname: '/login' }, undefined, { shallow: true });
  };

  const resetPassword = () => {
    // 모달띄우기
  };

  return (
    <div className={styles.container}>
      <form className={styles.login_wrap} onSubmit={(e: any) => signupValidation(e)}>
        <div className={styles.title}>회원가입</div>
        <div className={styles.email_text}>E-mail</div>
        <div className={styles.email_wrap}>
          <input
            type="email"
            className={styles.email_input}
            placeholder={'email@example.com'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => emailValidation(e)}
          />
          <input type="button" value="중복확인" className={styles.validate_button} onClick={() => validateEmail()} />
        </div>
        <div className={styles.warning}>{idWarning && idWarningMessage}</div>
        <div className={styles.nickname}>닉네임</div>
        <input
          type="text"
          className={styles.input}
          placeholder={'닉네임'}
          maxLength={8}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => emailValidation(e)}
        />
        <div className={styles.nickname_description}>최대 8자까지 가능합니다</div>
        <div className={styles.password_text}>Password</div>
        <input className={styles.input} placeholder={'비밀번호'} type="password" ref={password} />
        <div className={styles.warning}>{passwordWarning && passwordWarningMessage}</div>
        <div className={styles.password_text}>8~15자 영문 대소문자,숫자,특수문자 모두 사용</div>
        <input className={styles.input} placeholder={'비밀번호 확인'} type="password" ref={password2} />
        <div className={styles.warning}>{password2Warning && password2WarningMessage}</div>
        <div>
          <Button btnText="회원가입" className={styles.login_button} btnClick={(e: any) => signupValidation(e)} />
        </div>
        <div className={styles.signup_button}>
          <div className={styles.signup} onClick={() => goLogin()}>{`로그인`}</div>
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
