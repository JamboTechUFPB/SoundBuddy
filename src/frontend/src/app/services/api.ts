const BASE_URL = 'http://localhost:8000/api';
const MEDIA_URL = 'http://localhost:8000';

const createRequest = (endpoint: string, options: RequestInit = {}): Request => {
  const accessToken = localStorage.getItem('accessToken');
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
    }
  };

  return new Request(`${BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
};

export const userService = {
  getProfile: async () => {
    try {
      const response = await fetch(createRequest('/users/profile'));
      if (!response.ok) throw new Error('Falha na requisição');
      const data = await response.json();
      
      // Modifica a URL da imagem para incluir a URL base do backend
      if (data.profileImage && !data.profileImage.startsWith('http')) {
        data.profileImage = `${MEDIA_URL}${data.profileImage}`;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch(createRequest('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}` // Usa refreshToken em vez de accessToken
        }
      }));
  
      if (response.status === 403 || response.status === 401) {
        // Se forbidden/unauthorized, apenas limpa os tokens locais
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return;
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer logout');
      }
  
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Limpa tokens mesmo em caso de erro
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  },
  register: async (formData: FormData) => {
    try {
      const response = await fetch(createRequest('/users/create', {
        method: 'POST',
        body: formData
      }));

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar usuário');
      }

      const data = await response.json();
      
      // Armazena os tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(createRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }));

      if (!response.ok) {
        throw new Error('Email ou senha incorretos');
      }

      const data = await response.json();
      
      // Armazena os tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },
};