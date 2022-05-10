import { enableStaticRendering } from 'mobx-react';

import NavStore from './NavStore';
import AuthStore from './AuthStore';

const isServer: boolean = typeof window === 'undefined';

enableStaticRendering(isServer);
let store: any = null;

class RootStore {
  navStore;
  authStore;
  constructor() {
    this.navStore = new NavStore();
    this.authStore = new AuthStore();
  }
}

export default function initializeStore() {
  if (isServer) {
    return new RootStore();
  } else {
    if (store === null) {
      store = new RootStore();
    }
    return store;
  }
}