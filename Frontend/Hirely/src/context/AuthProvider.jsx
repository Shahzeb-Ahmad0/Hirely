import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth`,
        {
          withCredentials: true,
        }
      );

      if (res.data.loggedIn) {
        setIsLoggedIn(true);
        setUser(res.data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}