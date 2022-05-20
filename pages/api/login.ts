import axios from 'axios';

type Props = {
  disabledErrorHandler?: boolean;
  url: string;
  body: {
    email: string;
    password: string;
  };
};

export default async function apiLogin(params: any) {
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
