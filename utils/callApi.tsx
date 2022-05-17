import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import JsonWebToken from 'jsonwebtoken';
import { config } from 'process';

type DataProps = {
  method: string;
  url: string;
  body?: any;
  disabledErrorHandler?: any;
};

type Options = {
  // mode: any;
  method: string;
  headers: any;
  body?: any;
  params?: any;
  disabledErrorHandler?: any;
};

const CallApi = async (data: DataProps) => {
  const cookies = new Cookies();
  const jwt = await cookies.get('bitmoi-jwt');
  const options: Options = {
    method: data.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    disabledErrorHandler: data.disabledErrorHandler ?? null,
  };
  if (options.disabledErrorHandler === null) {
    delete options.disabledErrorHandler;
  }

  if (!!data.body && data.method === 'POST') {
    options.body = JSON.stringify(data.body);
  }

  if (!data.url.includes('bithumb')) {
    if (!!jwt) {
      options.headers.Authorization = `${jwt}`;
    }
  }
  // const response = await axios.get(data.url, { headers: { options.header}})

  const response = await fetch(data.url, options)
    .then((res) => res)
    .catch((e) => console.log(e));
  return response;
};

export default CallApi;
