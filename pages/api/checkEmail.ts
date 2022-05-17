import axios from 'axios';
import { result } from 'lodash';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Props = {
  url: string;
  method: string;
  body: { email: string };
};

export default async function checkEmail(params: Props) {
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
