import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  // Agora signIn recebe o objeto completo que veio do backend
  const signIn = (apiResponse) => {
    setUser({ 
      id: apiResponse.id,
      name: apiResponse.name || 'Usuário', 
      role: apiResponse.role || 'Bombeiro',
      matricula: apiResponse.matricula,
      email: apiResponse.email || '', 
      phone: apiResponse.phone || ''
    }); 
  };

  const signOut = () => {
    setUser(null);
  };

  // Função para atualizar dados do perfil
  const updateUser = (updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }));
  };

  return (
    <UserContext.Provider value={{ user, signed: !!user, signIn, signOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado dentro de um UserProvider');
  return context;
}