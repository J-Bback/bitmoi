import axios from 'axios';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Props = {
  disabledErrorHandler?: boolean;
  url: string;
  body: {
    email: string;
    password: string;
    phone: string;
    name: string;
  };
};

export default async function apiSignup(params: Props) {
  try {
    const response = await axios.post(params.url, params.body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
