import { API_URL } from './api';

export const loginUser = async (matricula, senha) => {
  try {
    const params = new URLSearchParams();
    params.append('matricula', matricula);
    params.append('senha', senha);

    console.log(`Tentando login em: ${API_URL}/user/login`);

    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // <--- IMPORTANTE: Aceita o cookie do backend
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro Login Backend:', response.status, errorText);
      throw new Error(errorText || 'Falha na autenticação');
    }

    return true; 
  } catch (error) {
    console.error("Erro no serviço de login:", error);
    throw error;
  }
};