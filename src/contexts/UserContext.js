import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  const signIn = (userData) => {
    // Atualizado para Carlos Ferreira
    setUser({ 
      name: 'Carlos Ferreira', 
      role: '2º Tenente',
      matricula: userData?.matricula || '123456'
    }); 
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signed: !!user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado dentro de um UserProvider');
  return context;
}