import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { setAccessToken } from "../api/axiosInstance";

const AuthContext = createContext(null);

const STORAGE_KEY = "msp_auth";

const readStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

const normalizeAuth = (data) => ({
  accessToken: data.accessToken ?? data.token,
  userId: data.userId,
  email: data.email,
  role: data.role,
});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const [initializing, setInitializing] = useState(true);

  const persist = useCallback((value) => {
    setAuth(value);

    setAccessToken(value?.accessToken);

    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const restore = async () => {
      // Already have access token
      if (auth?.accessToken) {
        setAccessToken(auth.accessToken);
        setInitializing(false);
        return;
      }

      try {
        // refresh endpoint returns only access token string
        const { data } = await authApi.refresh();

        const stored = readStoredAuth();

        if (stored) {
          const updated = {
            ...stored,
            accessToken: data,
          };

          persist(updated);
        } else {
          persist(null);
        }
      } catch {
        persist(null);
      } finally {
        setInitializing(false);
      }
    };

    restore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    async (credentials) => {
      const { data } = await authApi.login(credentials);

      const value = normalizeAuth(data);

      persist(value);

      return value;
    },
    [persist]
  );

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      persist(null);
    }
  }, [persist]);

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth?.accessToken),
      initializing,
      login,
      register,
      logout,
    }),
    [auth, initializing, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;