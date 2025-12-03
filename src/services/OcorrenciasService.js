import { API_URL } from './api';

// Função auxiliar para buscar o perfil do usuário logado e pegar o ID
const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      credentials: 'include', // Importante: Envia o cookie de sessão
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

// Busca a lista de ocorrências do usuário logado
export const getMyIncidents = async () => {
  try {
    // 1. Busca o ID do usuário
    const userProfile = await getUserProfile();

    if (!userProfile || !userProfile.id) {
      throw new Error('Usuário não identificado. Tente fazer login novamente.');
    }

    const userId = userProfile.id;
    console.log(`Buscando ocorrências para ID: ${userId}`);

    // 2. Busca as ocorrências usando o ID
    const response = await fetch(`${API_URL}/user/${userId}/occurrences`, {
      method: 'GET',
      credentials: 'include',
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

// Registra uma nova ocorrência
export const registerIncident = async (incidentData) => {
  try {
    // Monta o payload no formato que o backend Gleam espera (Snake Case ou Camel Case dependendo do endpoint)
    // Baseado no seu backend, ele aceita JSON direto no /occurrence/new
    const payload = {
      categoria: incidentData.tipo,
      subcategoria: incidentData.subtipo || '',
      prioridade: incidentData.prioridade,
      descricao: incidentData.descricao || '',
      endereco: incidentData.endereco,
      ponto_referencia: incidentData.pontoReferencia || '',
      codigo_viatura: incidentData.codigoViatura,
      gps: incidentData.gps || [0, 0], // Envia 0,0 se não tiver GPS
      id_equipes: [] // Array vazio se não tiver equipe selecionada (backend trata)
    };

    console.log('Enviando nova ocorrência:', payload);

    const response = await fetch(`${API_URL}/occurrence/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante para validar quem está criando
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Erro Backend Registro:', text);
      throw new Error(text || 'Falha ao registrar ocorrência');
    }

    // Se o backend retornar o objeto criado, devolvemos ele
    // Se retornar vazio ou texto, tratamos com try/catch
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      return { success: true };
    }

  } catch (error) {
    console.error("Erro no serviço de registro:", error);
    throw error;
  }
};