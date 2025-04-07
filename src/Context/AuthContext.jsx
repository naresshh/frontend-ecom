import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
    roles: [],
    userId: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setAuth({
        isAuthenticated: true,
        token,
        user: user.username,
        roles: user.roles,
        userId: user.customerId,
      });
    }
  }, []);

  console.log("AuthContext initialized:", auth); // Add this log

  const login = (token, userInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setAuth({
      isAuthenticated: true,
      token,
      user: userInfo.username,
      roles: userInfo.roles,
      userId: userInfo.customerId,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null,
      roles: [],
      userId: null,
    });
    const logoutEvent = new CustomEvent("logout");
    window.dispatchEvent(logoutEvent);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
