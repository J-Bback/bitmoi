import CallApi from '../../../utils/callApi';

export default {
  login(params: any) {
    return CallApi({
      disabledErrorHandler: params.disabledErrorHandler,
      url: '/auth',
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
};
