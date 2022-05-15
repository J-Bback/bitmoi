import CallApi from '../../../utils/callApi';

export default {
  login(params: any) {
    return CallApi({
      disabledErrorHandler: params.disabledErrorHandler,
      url: 'https://cors-anywhere.herokuapp.com/52.78.124.218:9000/user/login',
      method: 'POST',
      body: params,
    });
  },
  validateEmail(params: any) {
    return CallApi({
      url: params.url,
      method: 'GET',
    });
  },
  signup(params: any) {
    return CallApi({
      // disabledErrorHandler: params.disabledErrorHandler,
      url: 'https://cors-anywhere.herokuapp.com/52.78.124.218:9000/user/join',
      method: 'POST',
      body: params,
    });
  },
};
