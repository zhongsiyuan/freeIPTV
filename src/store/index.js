import { createContext, useContext } from 'react';
import player from './player';

export const MobxContext = createContext(null);

export const useStore = (moduleName) => {
  const Context = useContext(MobxContext);

  return moduleName ? Context[moduleName] : Context;
};

export default player;
