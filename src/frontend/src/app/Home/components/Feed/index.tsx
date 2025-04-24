import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkIcon, PaperAirplaneIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

import NewPostModal from './NewPostModal';
import ChatModal from '@/app/components/ChatModal';

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
  // Hook de roteamento do Next.js
  const router = useRouter();
  
  // TODO: Integrar com API de posts/feed
  // Dados mockados de posts - agora incluindo mídia
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'tech_enthusiast',
      profileImg: 'https://i.pravatar.cc/150?img=1',
      content: 'Acabei de atualizar meu setup! Novo monitor ultrawide e teclado mecânico 🚀 #setupgoals',
      mediaType: 'image',
      mediaUrl: 'https://i.pravatar.cc/600?img=1' 
    },
    {
      id: 2,
      username: 'travel_addict',
      profileImg: 'https://i.pravatar.cc/150?img=2',
      content: 'Vista incrível da Praia do Sancho em Fernando de Noronha 🌴 Quem mais ama praias paradisíacas?'
    },
    {
      id: 3,
      username: 'foodie_br',
      profileImg: 'https://i.pravatar.cc/150?img=3',
      content: 'Experimentando o novo restaurante de comida japonesa na cidade 🍣 O sashimi estava perfeito!'
    },
    {
      id: 4,
      username: 'fitness_freak',
      profileImg: 'https://i.pravatar.cc/150?img=4',
      content: 'Começando o dia com treino pesado 🏋️‍♀️ #foco #disciplina'
    },
    {
      id: 5,
      username: 'music_junkie',
      profileImg: 'https://i.pravatar.cc/150?img=6',
      content: 'Minha nova composição! O que acharam? 🎧 #música #composição',
      mediaType: 'audio',
      mediaUrl: '/sample-audio.mp3',
      audioName: 'Nova Composição - Demo.mp3'
    },
    {
      id: 6,
      username: 'vinyl_collector',
      profileImg: 'https://i.pravatar.cc/150?img=11',
      content: 'Acabei de encontrar um vinil raro dos anos 70 🕺 Alguém mais coleciona?',
      mediaType: 'image',
      mediaUrl: 'https://i.pravatar.cc/600?img=11' // Imagem placeholder
    },
    {
      id: 7,
      username: 'guitar_player',
      profileImg: 'https://i.pravatar.cc/150?img=12',
      content: 'Gravei uma nova música autoral com minha guitarra 🎸 O que acharam do solo?',
      mediaType: 'audio',
      mediaUrl: '/guitar-solo.mp3',
      audioName: 'Guitar Solo - Autoral.mp3'
    },
    {
      id: 8,
      username: 'playlist_curator',
      profileImg: 'https://i.pravatar.cc/150?img=14',
      content: 'Criei uma playlist de indie rock para relaxar 🌊 Quem quer o link?'
    },
    {
      id: 9,
      username: 'skate_videos',
      profileImg: 'https://i.pravatar.cc/150?img=15',
      content: 'Novo truque que aprendi hoje! 🛹 #skate #manobras',
      mediaType: 'video',
      mediaUrl: '/sample-video.mp4'
    }
  ]);

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
  const handleNewPost = (postData) => {
    // Verifica se postData é uma string (apenas texto) ou um objeto (com mídia)
    let newPost;
    
    if (typeof postData === 'string') {
      // Caso seja apenas texto
      newPost = {
        id: Date.now(), // Gera um ID único baseado no timestamp
        username: 'current_user', // Deve vir do contexto de autenticação
        profileImg: 'https://i.pravatar.cc/150?img=5', // Deve vir do perfil do usuário atual
        content: postData
      };
    } else {
      // Caso inclua mídia
      newPost = {
        id: Date.now(),
        username: 'current_user',
        profileImg: 'https://i.pravatar.cc/150?img=5',
        content: postData.content,
        mediaType: postData.mediaType,
        mediaUrl: postData.mediaUrl,
        mediaName: postData.mediaName
      };
    }
    
    setPosts([newPost, ...posts]); // Adiciona o novo post no topo do feed
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
  const handleProfileClick = () => {
    router.push('/Profile');
  };

  /**
   * Renderiza um componente de mídia baseado no tipo (imagem, vídeo ou áudio)
   * @param {object} post - Post contendo dados de mídia
   */
  const renderMedia = (post) => {
    if (!post.mediaType) return null;

    switch (post.mediaType) {
      case 'image':
        return (
          <div className="mt-3 mb-10 flex justify-center">
            <div 
              className="relative rounded-lg overflow-hidden cursor-pointer max-w-md"
              onClick={() => setEnlargedImage(post.mediaUrl)}
            >
              <img
                src={post.mediaUrl}
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
                src={post.mediaUrl}
                className="w-full h-full rounded-lg"
                controls
                onClick={(e) => {
                  // Previne que o clique no vídeo abra o modal se estiver clicando nos controles
                  if (e.target === e.currentTarget) {
                    setEnlargedVideo(post.mediaUrl);
                  }
                }}
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
              <div 
                className="absolute cursor-pointer"
                onClick={() => setEnlargedVideo(post.mediaUrl)}
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
                {post.audioName || post.mediaName || "Áudio"}
              </span>
            </div>
            <audio 
              controls 
              className="w-full"
              src={post.mediaUrl}
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
        bg-black text-white rounded-full w-14 h-14
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
      />

      {/* Container principal do feed com posicionamento fixo */}
      <div className="fixed top-[60px] bottom-[15px] left-1/2 -translate-x-1/2 w-full max-w-4xl">
        <div className="h-full bg-white rounded-xl mx-auto overflow-hidden">
          {/* Gradiente de fade-out na parte inferior */}
          <div className="fixed bottom-0 left-0 right-0 h-30 bg-gradient-to-t from-white via-white to-transparent backdrop-blur-xsm pointer-events-none z-50" />
          
          {/* Área rolável com os posts */}
          <div className="h-full overflow-y-auto px-4 py-6 pb-25 space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="relative bg-white shadow-lg rounded-2xl p-4">
                {/* Cabeçalho do post com avatar e nome de usuário */}
                <div className="flex items-center mb-4">
                  <img 
                    src={post.profileImg}
                    alt={`Perfil de ${post.username}`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <span onClick={handleProfileClick}  className="font-semibold text-gray-800 cursor-pointer">@{post.username}</span>
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
                {renderMedia(post)}

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