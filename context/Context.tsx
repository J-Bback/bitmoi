import React from 'react';
import { IMainContext } from '../interface/interface';

export const MainContext = React.createContext<IMainContext>({
  favorites: [],
  handleStateChange: () => {},
});
