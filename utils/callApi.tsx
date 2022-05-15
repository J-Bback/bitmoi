import React from 'react';
import axios from 'axios';

type DataProps = {
  method: string;
  url: string;
  body?: any;
  disabledErrorHandler?: any;
};

type Options = {
  // mode: any;
  method: string;
  header: any;
  body?: any;
  params?: any;
  disabledErrorHandler?: any;
};

export const CallApi = async (data: DataProps) => {
  const options: Options = {
    // mode: 'no-cors',
    method: data.method,
    header: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    disabledErrorHandler: data.disabledErrorHandler ?? null,
  };

  if (options.disabledErrorHandler === null) {
    delete options.disabledErrorHandler;
  }

  if (!!data.body && data.method === 'POST') {
    options.body = data.body.stringify();
  }
  const response = await fetch(data.url, options)
    .then((res) => res)
    .catch((e) => console.log(e));
  return response;
};
