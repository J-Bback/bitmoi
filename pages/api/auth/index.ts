import CallApi from '../../../utils/callApi';

export default {
  login(params: any) {
    return CallApi({
      disabledErrorHandler: params.disabledErrorHandler,
      url: 'http://44.198.67.139:9000/user/login',
      method: 'POST',
      body: params,
    });
  },
  checkEmail(params: any) {
    return CallApi({
      url: `${params.url}`,
      method: 'POST',
      body: params.body,
    });
  },
  signup(params: any) {
    return CallApi({
      // disabledErrorHandler: params.disabledErrorHandler,
      url: 'http://44.198.67.139:9000/user/join',
      method: 'POST',
      body: params.body,
    });
  },
};
