import { API_URL } from './api';

// Função auxiliar para buscar o perfil e pegar o ID
const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }
};

export const getMyIncidents = async () => {
  try {
    // 1. Busca o ID do usuário logado
    const userProfile = await getUserProfile();
    
    if (!userProfile || !userProfile.id) {
      throw new Error('Não foi possível identificar o usuário.');
    }

    const userId = userProfile.id;

    // 2. Busca as ocorrências usando o ID
    const response = await fetch(`${API_URL}/user/${userId}/occurrences`, {
      method: 'GET',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Falha ao buscar ocorrências');
    }

    const data = await response.json();
    return data; 

  } catch (error) {
    console.error("Erro no serviço de ocorrências:", error);
    throw error;
  }
};