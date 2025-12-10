import { API_URL } from './api';

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

    // AQUI ESTÁ A MUDANÇA: Retornamos os dados completos (JSON)
    const userData = await response.json();
    return userData; 
  } catch (error) {
    console.error("Erro no serviço de login:", error);
    throw error;
  }
};