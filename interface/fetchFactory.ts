import { IncomingMessage, ServerResponse } from 'http';

export type FetchWrapperArg = FetchWrapperCBArgServer | FetchWrapperCBArgClient;

export type FetchWrapperCBArgClient = {
  props: any;
  setState: Function;
  auth?: authStoreTypes;
};

export type FetchWrapperCBArgServer = {
  isServer: boolean;
  req: IncomingMessage;
  res: ServerResponse;
  mobxStore: mobxStoreTypes;
  query: any;
};

/**
 * ServerSide와 ClientSide 객체 모두 해당되어, optional property로 합니다.
 */
export type FetchWrapperParams = {
  req?: IncomingMessage | boolean | undefined;
  res?: ServerResponse | boolean | undefined;
  auth?: authStoreTypes | boolean | undefined;
  mobxStore?: mobxStoreTypes;
  props?: any;
  query?: any;
};

export type mobxStoreTypes = {
  authStore?: any;
  loadingStore?: any;
  modalStore?: any;
};

export type authStoreTypes = {
  // belongTo: string;
  jwt: string;
  permission: number;
  permissionUserType: string; // 유저 구분
};
