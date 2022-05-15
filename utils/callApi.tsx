import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

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
  console.log('env', process.env);
  console.log('axios defaults', axios.defaults);
  const options: Options = {
    // mode: 'no-cors',
    method: data.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    disabledErrorHandler: data.disabledErrorHandler ?? null,
  };
  // const cookies = new Cookies();
  // const jwt = await cookies.get('bitmoi-jwt');

  if (options.disabledErrorHandler === null) {
    delete options.disabledErrorHandler;
  }

  if (!!data.body && data.method === 'POST') {
    options.body = JSON.stringify(data.body);
  }

  // if (!!jwt) {
  //   options.headers.Authorization = `JWT ${jwt}`;
  // }

  // const response = await axios.get(data.url, { headers: { options.header}})

  const response = await fetch(data.url, options)
    .then((res) => res)
    .catch((e) => console.log(e));
  return response;
};

export default CallApi;
