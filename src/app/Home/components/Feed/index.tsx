import { useState } from 'react';
import { BookmarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import NewPostModal from './NewPostModal';
import ChatModal from '@/app/components/ChatModal';

/**
 * Componente Feed
 * 
 * Exibe um feed de posts de vários usuários em formato de timeline,
 * permitindo interações como salvar posts e iniciar conversas.
 */
const Feed = () => {
  // Estado para rastrear quais posts foram salvos pelo usuário
  const [savedPosts, setSavedPosts] = useState(new Set());
  // Estado para controlar a visibilidade do modal de novo post
  const [showModal, setShowModal] = useState(false);
  // Estado para armazenar o usuário selecionado para chat
  const [selectedUser, setSelectedUser] = useState(null);
  
  // TODO: Integrar com API de posts/feed
  // Dados mockados de posts - devem ser carregados do backend
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'tech_enthusiast',
      profileImg: 'https://i.pravatar.cc/150?img=1',
      content: 'Acabei de atualizar meu setup! Novo monitor ultrawide e teclado mecânico 🚀 #setupgoals'
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
      username: 'book_lover',
      profileImg: 'https://i.pravatar.cc/150?img=5',
      content: 'Terminei de ler um livro incrível sobre ciência de dados 📚 Recomendo demais!'
    },
    {
      id: 6,
      username: 'music_junkie',
      profileImg: 'https://i.pravatar.cc/150?img=6',
      content: 'Descobri uma banda nova que tá dominando minha playlist 🎧 #música #descobertas'
    },
    {
      id: 7,
      username: 'vinyl_collector',
      profileImg: 'https://i.pravatar.cc/150?img=11',
      content: 'Acabei de encontrar um vinil raro dos anos 70 🕺 Alguém mais coleciona?'
    },
    {
      id: 8,
      username: 'guitar_player',
      profileImg: 'https://i.pravatar.cc/150?img=12',
      content: 'Gravei uma nova música autoral com minha guitarra 🎸 O que acharam do solo?'
    },
    {
      id: 9,
      username: 'concert_lover',
      profileImg: 'https://i.pravatar.cc/150?img=13',
      content: 'Fui a um show inesquecível ontem à noite 🎤 Ainda estou sem voz de tanto cantar!'
    },
    {
      id: 10,
      username: 'playlist_curator',
      profileImg: 'https://i.pravatar.cc/150?img=14',
      content: 'Criei uma playlist de indie rock para relaxar 🌊 Quem quer o link?'
    }
  ]);

  /**
   * Alterna o estado de salvamento de um post
   * TODO: Integrar com API para persistir posts salvos no backend
   * @param {number} postId - ID do post a ser alternado
   */
  const toggleSave = (postId) => {
    const newSaved = new Set(savedPosts);
    newSaved.has(postId) ? newSaved.delete(postId) : newSaved.add(postId);
    setSavedPosts(newSaved);
  };

  /**
   * Adiciona um novo post ao feed
   * TODO: Integrar com API para criar posts no backend
   * @param {string} content - Conteúdo do novo post
   */
  const handleNewPost = (content) => {
    // TODO: Substituir por dados reais do usuário logado
    const newPost = {
      id: posts.length + 1, // No backend, seria um ID gerado automaticamente
      username: 'current_user', // Deve vir do contexto de autenticação
      profileImg: 'https://i.pravatar.cc/150?img=5', // Deve vir do perfil do usuário atual
      content: content
    };
    setPosts([newPost, ...posts]); // Add o novo post no topo do feed
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

  return (
    <div className="top-[50px] flex-1 overflow-hidden">
      {/* Botão flutuante para criar novo post */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed z-40 bottom-5 left-1/2 -translate-x-1/2
        bg-black text-white rounded-full w-14 h-14
        flex items-center backdrop-blur justify-center text-3xl
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
          <div className="fixed bottom-0 left-0 right-0 h-35 bg-gradient-to-t from-white via-white to-transparent backdrop-blur-xsm pointer-events-none z-30" />
          
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
                    <span className="font-semibold text-gray-800">@{post.username}</span>
                  </div>

                  {/* Botão de salvar post */}
                  <button 
                    onClick={() => toggleSave(post.id)}
                    className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <BookmarkIcon 
                      className={`w-5 h-5 ${savedPosts.has(post.id) ? 'text-blue-500 fill-current' : 'text-gray-400'}`}
                    />
                  </button>

                  {/* Conteúdo do post */}
                  <p className="text-gray-800 pr-8 mb-8">{post.content}</p>

                  {/* Botão para iniciar chat com o autor do post */}
                  <button 
                    onClick={() => handleOpenChat(post)}
                    className="absolute bottom-2 right-2 p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <PaperAirplaneIcon className="w-5 h-5 text-gray-600 -rotate-45" />
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
          // TODO: Integrar com API de mensagens para carregar histórico de conversas
        />
      )}
    </div>
  );
};

export default Feed;