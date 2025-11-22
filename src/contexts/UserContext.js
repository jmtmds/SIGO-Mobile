import React, { createContext, useState, useContext } from 'react';

// Cria o contexto
const UserContext = createContext({});

// Cria o Provedor (que vai envolver o App)
export const UserProvider = ({ children }) => {
  // Estado que guarda os dados do usuário. 
  // null = não logado. Objeto preenchido = logado.
  const [user, setUser] = useState(null); 

  // Função chamada pela tela de Login quando tudo der certo
  const signIn = (userData) => {
    // Aqui você salvaria o token no armazenamento local futuramente
    setUser(userData || { name: 'Usuário Padrão' }); 
  };

  // Função de Logout para o futuro
  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signed: !!user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nas outras telas
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}