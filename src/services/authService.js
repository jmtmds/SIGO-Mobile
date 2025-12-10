import { API_URL } from './api';

// LOGIN DO USUÁRIO
export const loginUser = async (matricula, senha) => {
  try {
    console.log(`Tentando login em: ${API_URL}/login`);

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matricula, password: senha }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Falha na autenticação');
    }

    // Retorna os dados completos (JSON)
    const userData = await response.json();
    return userData; 
  } catch (error) {
    console.error("Erro no serviço de login:", error);
    throw error;
  }
};

// ATUALIZAR PERFIL (NOVA FUNÇÃO)
export const updateUserProfile = async (id, userData) => {
  try {
    console.log(`Atualizando perfil para ID: ${id}`, userData);

    const response = await fetch(`${API_URL}/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Falha ao atualizar perfil');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no serviço de perfil:", error);
    throw error;
  }
};