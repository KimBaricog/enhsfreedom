import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          "https://enhsfreedom-1.onrender.com/dashboard",
          {
            credentials: "include",
          },
        );

        if (res.ok) {
          const data = await res.json();

          setUser(data);
        } else {
          // retry once after short delay
          setTimeout(checkAuth, 30000);
        }
      } catch {
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    checkAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, authReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
