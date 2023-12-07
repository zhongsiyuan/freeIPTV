import { createContext, useContext } from 'react';
import player from './player';

const mobx = {
  player,
};

export const MobxContext = createContext(mobx);

export const useStore = (moduleName) => {
  const Context = useContext(MobxContext);

  return moduleName ? Context[moduleName] : Context;
};

export default mobx;
