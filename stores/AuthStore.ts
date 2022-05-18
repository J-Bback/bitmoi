import { makeAutoObservable } from 'mobx';
import Cookies from 'universal-cookie';
import JsonWebToken from 'jsonwebtoken';

const cookies = new Cookies();

type DecodedToken = {
  exp: number;
  id: string;
  name: string;
  userId: number;
};
class AuthStore {
  jwt = null;
  userId = null;
  name = '';
  // phone = null;
  logged = false;
  email = '';

  constructor() {
    makeAutoObservable(this);
  }

  login = async (jwt: any) => {
    const afterOneYear = new Date();
    afterOneYear.setFullYear(afterOneYear.getFullYear() + 1);
    cookies.set('token', jwt, {
      domain: process.env.cookieDomain,
      maxAge: 12 * 60 * 60,
      expires: afterOneYear,
      path: '/',
      secure: true,
    });
    const decodedToken: any = JsonWebToken.decode(jwt);
    this.jwt = jwt;
    this.userId = decodedToken.userId;
    this.name = decodedToken.name;
    this.email = decodedToken?.id;
    // this.phone = decodedToken.phone;
    this.logged = true;
  };
}

export default AuthStore;
