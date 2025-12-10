import { API_URL } from './api';

// Função auxiliar para pegar o perfil (usado para validar ID)
const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/user/profile`);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.log('Erro getUserProfile:', error);
    return null;
  }
};

// 1. REGISTRAR NOVA OCORRÊNCIA
export const registerIncident = async (incidentData) => {
  try {
    const user = await getUserProfile(); 
    
    const payload = {
      categoria: incidentData.tipo,
      subcategoria: incidentData.subtipo || '',
      prioridade: incidentData.prioridade,
      descricao: incidentData.descricao || '',
      endereco: incidentData.endereco,
      ponto_referencia: incidentData.pontoReferencia || '',
      codigo_viatura: incidentData.codigoViatura,
      gps: incidentData.gps || [0, 0], 
      userId: user ? user.id : undefined 
    };

    console.log('[OcorrenciasService] Enviando payload:', payload);

    const response = await fetch(`${API_URL}/occurrence/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Falha ao registrar ocorrência');
    }

    return await response.json();
  } catch (error) {
    console.error('[OcorrenciasService] Erro no registro:', error);
    throw error;
  }
};

// 2. BUSCAR MINHAS OCORRÊNCIAS
export const getMyIncidents = async () => {
  try {
    const user = await getUserProfile();
    const userId = user?.id || 'undefined';

    const response = await fetch(`${API_URL}/user/${userId}/occurrences`);
    
    if (!response.ok) throw new Error('Erro ao buscar lista');
    
    return await response.json();
  } catch (error) {
    console.error('[OcorrenciasService] Erro ao buscar:', error);
    throw error; 
  }
};

// 3. ATUALIZAR STATUS (Aberta -> Em Andamento -> Finalizada)
export const updateIncidentStatus = async (id, newStatus) => {
  try {
    console.log(`[OcorrenciasService] Atualizando status ID ${id} para: ${newStatus}`);

    const response = await fetch(`${API_URL}/occurrence/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Erro ao atualizar status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('[OcorrenciasService] Erro na atualização:', error);
    throw error;
  }
};

// 4. EDITAR DADOS (PUT)
export const updateIncident = async (id, data) => {
  try {
    console.log(`[OcorrenciasService] Editando ID ${id}`, data);
    const response = await fetch(`${API_URL}/occurrence/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Erro ao salvar edição');
    return await response.json();
  } catch (error) {
    console.error('[OcorrenciasService] Erro na edição:', error);
    throw error;
  }
};

// 5. DELETAR OCORRÊNCIA (DELETE)
export const deleteIncident = async (id) => {
  try {
    console.log(`[OcorrenciasService] Deletando ID ${id}`);
    console.log(`[OcorrenciasService] URL: ${API_URL}/occurrence/${id}`);
    
    const response = await fetch(`${API_URL}/occurrence/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`[OcorrenciasService] Response status: ${response.status}`);
    console.log(`[OcorrenciasService] Response ok: ${response.ok}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`[OcorrenciasService] Error response: ${errorText}`);
      throw new Error(`Falha ao deletar ocorrência: ${response.status} - ${errorText}`);
    }
    
    console.log(`[OcorrenciasService] Delete successful`);
    return true;
  } catch (error) {
    console.error('[OcorrenciasService] Erro ao deletar:', error);
    throw error;
  }
};