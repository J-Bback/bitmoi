import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import apiAuth from '../api/auth';
import checkEmail from '../api/checkEmail';
import apiSignup from '../api/signup';
import Button from '../../atoms/Button';

import styles from './Signup.module.scss';
// import { getMaxListeners } from 'process';
const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
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

  const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const validateEmail = async () => {
    if (email.length === 0) {
      alert('이메일을 입력해주세요.');
    }
    const data = {
      url: `https://cors-anywhere.herokuapp.com/52.78.124.218:9000/user/check`,
      method: 'POST',
      body: { email: email },
    };

    try {
      const response = await checkEmail(data);
      const responseData = response?.data;
      if (response?.status === 200) {
        if (responseData.message === 'FAIL') {
          return alert('이미 존재하는 이메일입니다.');
        }
        alert('이메일 중복확인을 완료하였습니다.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signupFunction = async () => {
    const data = {
      url: 'https://cors-anywhere.herokuapp.com/52.78.124.218:9000/user/join',
      body: {
        email: email,
        password: password.current.value,
        phone: phone,
        name: name,
      },
    };
    try {
      const response = await apiSignup(data);
      const responseData = response?.data;

      if (response?.status === 200) {
        if (responseData.message === 'FAIL') {
          return alert('입력정보를 다시 확인해주세요.');
        }
        alert('회원가입이 완료되었습니다.');
        goLogin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signupValidation = (e: any) => {
    const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    e.preventDefault();
    const passwordValue = password.current.value;
    const password2Value = password2.current.value;

    if (email.trim().length === 0) {
      setIdWarning(true);
      setIdWarningMessage('아이디를 입력해주세요');
      return;
    }

    if (passwordValue?.trim().length === 0) {
      setIdWarning(false);
      setIdWarningMessage('');
      setPassword2Warning(false);
      setPassword2WarningMessage('');

      setPasswordWarning(true);
      setPasswordWarningMessage('비밀번호를 입력해주세요');
      return;
      // setIdWarning(false);
      // setIdWarningMessage('');
    }

    if (password2Value?.trim().length === 0) {
      setIdWarning(false);
      setIdWarningMessage('');
      setPasswordWarning(false);
      setPasswordWarningMessage('');

      setPassword2Warning(true);
      setPassword2WarningMessage('비밀번호를 입력해주세요');
      return;
      // setIdWarning(false);
      // setIdWarningMessage('');
    }

    if (passwordValue !== password2Value) {
      setIdWarning(false);
      setIdWarningMessage('');
      setPasswordWarning(false);
      setPasswordWarningMessage('');

      setPassword2Warning(true);
      setPassword2WarningMessage('비밀번호를 확인해주세요.');
      return;
    }

    if (regPhone.test(phone) !== true) {
      console.log('asdfsaf');
      alert('휴대전화번호 형식을 확인해주세요.');
      return;
    }

    if (password2Value?.trim().length !== 0 && passwordValue?.trim().length !== 0 && email.trim().length !== 0) {
      setPasswordWarning(false);
      setPasswordWarningMessage('');
      setIdWarning(false);
      setIdWarningMessage('');
      setPassword2Warning(false);
      setPassword2WarningMessage('');
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
        <div className={styles.nickname}>이름</div>
        <input
          type="text"
          className={styles.input}
          placeholder={'닉네임'}
          maxLength={8}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        {/* <div className={styles.nickname_description}>최대 8자까지 가능합니다</div> */}
        <div className={styles.phone_text}>휴대폰번호</div>
        <input
          type="tel"
          className={styles.input}
          name="userPhoneNumber"
          placeholder={'010-1234-5678'}
          maxLength={15}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePhone(e)}
        />
        <div className={styles.password_text}>{'비밀번호 (숫자, 영문 포함 8~15자)'}</div>
        <input className={styles.input} placeholder={'비밀번호'} type="password" ref={password} />
        <div className={styles.warning}>{passwordWarning && passwordWarningMessage}</div>
        <div className={styles.password_text}>비밀번호 확인</div>
        <input className={styles.input} placeholder={'비밀번호 확인'} type="password" ref={password2} />
        <div className={styles.warning}>{password2Warning && password2WarningMessage}</div>
        <div>
          <Button btnText="회원가입" className={styles.login_button} btnClick={(e: any) => signupValidation(e)} />
        </div>
        <div className={styles.signup_button}>
          <div className={styles.signup} onClick={() => goLogin()}>{`로그인`}</div>
          {/* <div>{'|'}</div>
          <div className={styles.signup} onClick={() => resetPassword()}>
            {'비밀번호 재설정'}
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default Login;
