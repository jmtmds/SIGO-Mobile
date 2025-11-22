// src/services/authService.js
import { API_URL } from './api';

export const loginUser = async (matricula, senha) => {
  try {
    // O backend em Gleam espera dados como se fosse um formulário HTML clássico
    const params = new URLSearchParams();
    params.append('matricula', matricula);
    params.append('senha', senha);

    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      // Tenta ler a mensagem de erro do backend, se houver
      const errorText = await response.text();
      throw new Error(errorText || 'Falha na autenticação');
    }

    // Se der sucesso (Status 200), retornamos true
    // Futuramente aqui você pode capturar o token ou cookie retornado
    return true; 
  } catch (error) {
    console.error("Erro no serviço de login:", error);
    throw error;
  }
};