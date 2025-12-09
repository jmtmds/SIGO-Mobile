import { API_URL } from './api';

// Função auxiliar para pegar o perfil (usado para validar ID)
// No backend novo, essa rota retorna o usuário 'default' se não passar ID, servindo para teste.
const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/user/profile`);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.log('Erro getUserProfile:', error);
    return null;
  }
};

export const registerIncident = async (incidentData) => {
  try {
    // Busca o usuário para garantir que temos um ID válido (opcional, mas bom pra garantir)
    const user = await getUserProfile(); 
    if (!user) throw new Error("Usuário não autenticado para registrar ocorrência.");

    const payload = {
      categoria: incidentData.tipo,
      subcategoria: incidentData.subtipo || '',
      prioridade: incidentData.prioridade,
      descricao: incidentData.descricao || '',
      endereco: incidentData.endereco,
      ponto_referencia: incidentData.pontoReferencia || '',
      codigo_viatura: incidentData.codigoViatura,
      gps: incidentData.gps || [0, 0], 
      userId: user.id // Importante: Vincula a ocorrência ao usuário
    };

    console.log('[OcorrenciasService] Enviando payload:', payload);

    const response = await fetch(`${API_URL}/occurrence/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    return await response.json();
  } catch (error) {
    console.error('[OcorrenciasService] Erro:', error);
    throw error;
  }
};

export const getMyIncidents = async () => {
  try {
    const user = await getUserProfile();
    if (!user || !user.id) throw new Error('Usuário desconhecido');

    const response = await fetch(`${API_URL}/user/${user.id}/occurrences`);
    
    if (!response.ok) throw new Error('Erro ao buscar lista');
    
    return await response.json();
  } catch (error) {
    console.error('[OcorrenciasService] Erro ao buscar:', error);
    throw error;
  }
};