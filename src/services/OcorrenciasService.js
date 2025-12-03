import { API_URL } from './api';

const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      credentials: 'include', // <--- Envia o cookie salvo
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.log('Erro ao buscar perfil (Status):', response.status);
    }
    return null;
  } catch (error) {
    console.error("Erro de conexão ao buscar perfil:", error);
    return null;
  }
};

export const getMyIncidents = async () => {
  try {
    // 1. Busca o ID do usuário logado
    const userProfile = await getUserProfile();
    
    if (!userProfile || !userProfile.id) {
      throw new Error('Usuário não identificado. Tente fazer login novamente.');
    }

    const userId = userProfile.id;
    console.log(`Buscando ocorrências para ID: ${userId}`);

    // 2. Busca as ocorrências usando o ID
    const response = await fetch(`${API_URL}/user/${userId}/occurrences`, {
      method: 'GET',
      credentials: 'include', // <--- Envia o cookie salvo
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Erro Backend Ocorrências:', text);
      throw new Error(text || 'Falha ao buscar ocorrências');
    }

    const data = await response.json();
    return data; 

  } catch (error) {
    console.error("Erro detalhado no serviço:", error);
    throw error;
  }
};