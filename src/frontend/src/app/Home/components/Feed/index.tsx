import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkIcon, PaperAirplaneIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

import NewPostModal from './NewPostModal';
import ChatModal from '@/app/components/ChatModal';
import { IPost, PostData } from './components/types';
import { MediaType } from './components/types';
import { Media } from './components/types';
import { userService, postService } from '@/app/services/api';

/**
 * Componente Feed
 * 
 * Exibe um feed de posts de vários usuários em formato de timeline,
 * permitindo interações como salvar posts e iniciar conversas,
 * além de visualizar e reproduzir mídia (imagens, vídeos e áudio).
 */
const Feed = () => {
  // Estado para rastrear quais posts foram salvos pelo usuário
  const [savedPosts, setSavedPosts] = useState(new Set());
  // Estado para controlar a visibilidade do modal de novo post
  const [showModal, setShowModal] = useState(false);
  // Estado para armazenar o usuário selecionado para chat
  const [selectedUser, setSelectedUser] = useState(null);
  // Estado para controlar a ampliação de imagens
  const [enlargedImage, setEnlargedImage] = useState(null);
  // Estado para controlar a ampliação de vídeos
  const [enlargedVideo, setEnlargedVideo] = useState(null);

  const [feedPageNumber, setFeedPageNumber] = useState(1);
  const PAGE_SIZE = 10;
  
  const [currentUser, setCurrentUser] = useState({
    profileImage: 'https://i.pravatar.cc/150?img=8',
    name: '@user'
  });

  const [postData, setPostData] = useState({
    content: '',
    mediaType: null,
    mediaUrl: null,
    mediaName: null,
    mediaFile: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [posts, setPosts] = useState<IPost[]>([]);

  // Hook de roteamento do Next.js
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifica se existe token válido
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/Login');
          return;
        }

        // Busca informações básicas do usuário
        const userInfo = await userService.getBasicInfo();
        setCurrentUser(userInfo);
        
        // Aqui você faria a chamada para buscar os posts
        const response = await postService.getPosts(feedPageNumber, PAGE_SIZE);
        setPosts(response.posts);
        setFeedPageNumber(response.currentPage);

      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/Login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (posts.length === 0) {
    console.log('Não há posts.');
  }

  /**
   * Alterna o estado de salvamento de um post
   * @param {number} postId - ID do post a ser alternado
   */
  const toggleSave = (postId) => {
    const newSaved = new Set(savedPosts);
    newSaved.has(postId) ? newSaved.delete(postId) : newSaved.add(postId);
    setSavedPosts(newSaved);
  };

  /**
   * Adiciona um novo post ao feed
   * @param {object} postData - Dados do novo post (conteúdo e mídia)
   */
  const handleNewPost = async (postData: PostData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('content', postData.content);

      if (postData.mediaType) {
        formDataToSend.append('mediaType', postData.mediaType);
      }
      if (postData.mediaName) {
        formDataToSend.append('mediaName', postData.mediaName);
      }
      if (postData.media) {
        formDataToSend.append('media', postData.media);
      }

      const response = await postService.createPost(formDataToSend);

      const newPost = {
        id: response.id,
        user: {
          name: currentUser.name,
          profileImage: currentUser.profileImage
        },
        content: postData.content,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        media: {
          type: response.media?.type || '',
          url: response.media?.url || '',
          name: response.media?.name || ''
        }
      }
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao criar post:', error);
      // Implementar tratamento de erro adequado
    }
  };

  /**
   * Abre o modal de chat com um usuário específico
   * @param {object} user - Dados do usuário para iniciar chat
   */
  const handleOpenChat = (user) => {
    setSelectedUser({
      username: user.username,
      profileImg: user.profileImg
    });
  };

  // navegação perfil
  const handleProfileClick = (username: string) => {
    router.push(`/Profile/${encodeURIComponent(username)}`);
    setShowModal(false); // Fecha o modal de novo post
    setSelectedUser(null); // Fecha o modal de chat se aberto
    setEnlargedImage(null); // Fecha o modal de imagem ampliada se aberto
    setEnlargedVideo(null); // Fecha o modal de vídeo ampliado se aberto
  };

  /**
   * Renderiza um componente de mídia baseado no tipo (imagem, vídeo ou áudio)
   * @param {object} post - Post contendo dados de mídia
   */
  const renderMedia = (media: Media) => {
    if (!media) return null;
    if (!media.type) return null;

    switch (media.type) {
      case 'image':
        return (
          <div className="mt-3 mb-10 flex justify-center">
            <div 
              className="relative rounded-lg overflow-hidden cursor-pointer max-w-md"
              onClick={() => setEnlargedImage(media.url)}
            >
              <img
                src={media.url}
                alt="Imagem do post"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="mt-3 mb-10 flex justify-center">
            <div className="relative rounded-lg overflow-hidden max-w-md">
              <video 
                src={media.url}
                className="w-full h-full rounded-lg"
                controls
                onClick={(e) => {
                  // Previne que o clique no vídeo abra o modal se estiver clicando nos controles
                  if (e.target === e.currentTarget) {
                    setEnlargedVideo(media.url);
                  }
                }}
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
              <div 
                className="absolute cursor-pointer"
                onClick={() => setEnlargedVideo(media.url)}
              ></div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="mt-3 mb-10 bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <MusicalNoteIcon className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {media.name || "Áudio"}
              </span>
            </div>
            <audio 
              controls 
              className="w-full"
              src={media.url}
            >
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="top-[50px] flex-1 overflow-hidden">
      {/* Botão flutuante para criar novo post */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed z-40 bottom-5 left-1/2 -translate-x-1/2
        bg-black shadow-lg text-white rounded-full w-14 h-14
        flex items-center justify-center text-3xl
        hover:bg-gray-800 shadow-xl transition-all"
      >
        +
      </button>

      {/* Modal para criação de novo post */}
      <NewPostModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleNewPost}
        setPostData={setPostData}
        currentUser={currentUser}
      />

      {/* Container principal do feed com posicionamento fixo */}
      <div className="fixed top-[60px] bottom-0 md:bottom-[15px] left-1/2 -translate-x-1/2 w-full max-w-4xl">
        <div className="h-full bg-gradient-to-t from-white/10 to-transparent rounded-xl mx-auto overflow-hidden scrollbar-right shadow-2xl relative">
          {/* Gradiente de fade-out na parte inferior 
          
          <div className="fixed bottom-0 rounded-xl left-0 right-0 h-25 z-50 bg-gradient-to-t from-zinc-700/70 to-transparent" />*/}

          {/* Área rolável com os posts */}
          <div className="h-full overflow-y-auto px-4 py-6 pb-25 space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="relative bg-white shadow-lg rounded-2xl p-4">
                {/* Cabeçalho do post com avatar e nome de usuário */}
                <div className="flex items-center mb-4">
                  <img 
                    src={post.user.profileImage}
                    alt={`Perfil de ${post.user.name}`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <span onClick={() => handleProfileClick(post.user.name)} className="font-semibold text-gray-800 cursor-pointer">@{post.user.name}</span>
                </div>
 
                {/* Botão de salvar post */}
                <button 
                  onClick={() => toggleSave(post.id)}
                  className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <BookmarkIcon 
                    className={`w-5 h-5 cursor-pointer ${savedPosts.has(post.id) ? 'text-blue-500 fill-current' : 'text-gray-400'}`}
                  />
                </button>

                {/* Conteúdo do post */}
                <p className="text-gray-800 pr-8">{post.content}</p>

                {/* Renderização da mídia (imagem, vídeo ou áudio) */}
                {renderMedia(post.media)}

                {/* Botão para iniciar chat com o autor do post */}
                <button 
                  onClick={() => handleOpenChat(post)}
                  className="absolute bottom-2 right-2 p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <PaperAirplaneIcon className="w-5 h-5 cursor-pointer text-gray-600 -rotate-45" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de chat - exibido quando um usuário é selecionado para conversa */}
      {selectedUser && (
        <ChatModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Modal para visualização ampliada de imagens, talvez eu coloque em outro arquivo tanto esse quanto video */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={enlargedImage} 
              alt="Imagem ampliada" 
              className="max-w-full max-h-full object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              onClick={() => setEnlargedImage(null)}
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Modal para visualização ampliada de vídeos */}
      {enlargedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/80  flex items-center justify-center p-4"
          onClick={() => setEnlargedVideo(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <video 
              src={enlargedVideo} 
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
            <button 
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              onClick={() => setEnlargedVideo(null)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;