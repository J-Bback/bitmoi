import { makeAutoObservable } from "mobx";

class NavStore {

  value = '';

  constructor() {
    makeAutoObservable(this);
  }

  setValue(value: any) {
    this.value = value;
  }
}

export default NavStore;