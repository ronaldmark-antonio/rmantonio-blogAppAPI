import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser({ ...storedUser, isLoading: false });
    } else {
      setUser({ isAdmin: false, isLoading: false });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useGlobalStore = () => useContext(UserContext);

export default UserContext;
