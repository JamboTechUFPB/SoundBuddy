import { IPost, PostData } from "../Home/components/Feed/components/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const MEDIA_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

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
  getPublicProfile: async (username: string) => {
    try {
      const response = await fetch(createRequest(`/users/${username}`));
      if (!response.ok) throw new Error('Falha ao buscar perfil público');
      
      const data = await response.json();
      console.log('Dados do perfil público:', data);

      // try to parse tags as array
      if (typeof data.tags === 'string') {
        try {
          data.tags = JSON.parse(data.tags);
        } catch (error) {
          console.error('Erro ao analisar tags:', error);
          data.tags = [];
        }
      }
      
      // Modifica a URL da imagem para incluir a URL base do backend
      if (data.profileImage && !data.profileImage.startsWith('http')) {
        data.profileImage = `${MEDIA_URL}${data.profileImage}`;
      }

      // get posts from user
      const postsResponse = await fetch(createRequest(`/posts/${username}`));
      if (!postsResponse.ok) throw new Error('Falha ao buscar posts do usuário');
      const postsData = await postsResponse.json();
      // Modifica a URL da imagem para incluir a URL base do backend
      postsData.posts = postsData.posts.map((post: IPost) => {
        if (post.media && post.media.url) {
          post.media.url = `${MEDIA_URL}${post.media.url}`;
        }
        if (post.user && post.user.profileImage && !post.user.profileImage.startsWith('http')) {
          post.user.profileImage = `${MEDIA_URL}${post.user.profileImage}`;
        }
        return post;
      });
      data.posts = postsData.posts;
      data.totalPages = postsData.totalPages;
      data.currentPage = postsData.currentPage;
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil público:', error);
      throw error;
    }
  },

  getBasicInfo: async () => {
    try {
      const response = await fetch(createRequest('/user'));
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
  updateProfile: async (formData: FormData) => {
    try {
      const response = await fetch(`${BASE_URL}/users/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil');
      }

      const data = await response.json();
      const userData = data.user;
      
      // Modifica a URL da imagem para incluir a URL base do backend
      if (userData.profileImage && !userData.profileImage.startsWith('http')) {
        userData.profileImage = `${MEDIA_URL}${userData.profileImage}`;
      }
      
      return userData;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
};

export const postService = {
  getPosts: async (page: number, limit: number) => {
    try {
      const response = await fetch(createRequest(`/posts?page=${page}&limit=${limit}`));
      if (!response.ok) throw new Error('Falha na requisição');
      const data = await response.json();
      // Modifica a URL da imagem para incluir a URL base do backend
      // para o url da media dos posts e do profileimage
      data.posts = data.posts.map((post: IPost) => {
        if (post.media && post.media.url) {
          post.media.url = `${MEDIA_URL}${post.media.url}`;
        }
        if (post.user && post.user.profileImage && !post.user.profileImage.startsWith('http')) {
          post.user.profileImage = `${MEDIA_URL}${post.user.profileImage}`;
        }
        return post;
      });
      return {
        posts: data.posts,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      };
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw error;
    }
  },
  getPost: async (postId: string) => {
    try {
      const response = await fetch(createRequest(`/posts/${postId}`));
      if (!response.ok) throw new Error('Falha na requisição');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar post:', error);
      throw error;
    }
  },
  createPost: async (formData: FormData) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar post');
      }

      // append localhost:8000 to response media.url
      const data = await response.json();

      if (data.media && data.media.url) {
        data.media.url = `${MEDIA_URL}${data.media.url}`;
      }
      return data;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    }
  },
  deletePost: async (postId: string) => {
    try {
      const id = postId;
      const response = await fetch(`${BASE_URL}/posts/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar post');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      throw error;
    }
  }
};