import { enableStaticRendering } from 'mobx-react';

import NavStore from './NavStore';

const isServer: boolean = typeof window === 'undefined';

enableStaticRendering(isServer);
let store: any = null;

class RootStore {
  navStore;
  constructor() {
    this.navStore = new NavStore();
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