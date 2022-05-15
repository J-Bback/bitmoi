import { CallApi } from '../../../utils/callApi';

export default {
  login(params: any) {
    return CallApi({
      disabledErrorHandler: params.disabledErrorHandler,
      url: '/auth',
      method: 'post',
      body: params,
    });
  },
};
