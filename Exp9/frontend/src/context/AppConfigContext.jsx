/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react';
import { appConfig } from '../lib/config';

export const AppConfigContext = createContext(appConfig);

export function AppConfigProvider({ children }) {
  return <AppConfigContext.Provider value={appConfig}>{children}</AppConfigContext.Provider>;
}
