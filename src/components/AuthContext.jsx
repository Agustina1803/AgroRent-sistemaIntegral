/* El provider y el hook useAuth se mantienen en el mismo archivo por convención:
   el hook necesita el contexto que este módulo crea y separarlos obligaría a
   exportar el objeto AuthContext desde un archivo de componente. */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  login as loginRequest,
  logout as logoutRequest,
  panelFor,
  register as registerRequest,
  requestPasswordReset as requestReset,
  resetPassword as resetPasswordRequest,
  restoreUser,
} from './authStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreUser);

  const login = useCallback((email, password, rol, remember) => {
    const result = loginRequest({ email, password, rol, remember });
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const register = useCallback((data, remember) => {
    const result = registerRequest(data, remember);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      panelFor: panelFor(user?.rol),
      login,
      register,
      logout,
      requestPasswordReset: requestReset,
      resetPassword: resetPasswordRequest,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return context;
}
