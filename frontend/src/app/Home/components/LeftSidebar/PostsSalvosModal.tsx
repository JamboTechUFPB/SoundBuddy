import { useState, useEffect } from 'react';
import { XMarkIcon, BookmarkIcon, PaperAirplaneIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

/**
 * Componente PostsSalvosModal
 * 
 * Modal para exibir posts salvos pelo usuário com opções de interação
 * Mantém o design consistente com outros modais da aplicação
 * 
 * @param {boolean} show - Controla a visibilidade do modal
 * @param {function} onClose - Função para fechar o modal
 */
const PostsSalvosModal = ({ show, onClose }) => {
  // Estado para armazenar os posts salvos
  const [postsSalvos, setPostsSalvos] = useState([]);
  // Estado para controlar carregamento
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para carregar posts salvos do backend
    const carregarPostsSalvos = async () => {
      // TODO: Integrar com API para buscar posts salvos
      // Simulando carregamento de dados
      setLoading(true);
      
      // Dados mockados para demonstração - usando o mesmo formato do Feed
      setTimeout(() => {
        const mockPosts = [
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
            mediaUrl: 'https://i.pravatar.cc/600?img=11'
          },
        ];
        
        setPostsSalvos(mockPosts);
        setLoading(false);
      }, 800);
    };

    // Carrega os posts apenas quando o modal estiver visível
    if (show) {
      carregarPostsSalvos();
    }
  }, [show]);

  /**
   * Função para remover um post da lista de salvos
   * @param {number} postId - ID do post a ser removido
   */
  const removerPostSalvo = (postId) => {
    // Filtrar a lista de posts removendo o post com o ID correspondente
    const postsAtualizados = postsSalvos.filter(post => post.id !== postId);
    
    // Atualizar o estado com a nova lista de posts
    setPostsSalvos(postsAtualizados);
    
    // TODO: Integrar com API para remover o post salvo no backend
    console.log(`Post ${postId} removido dos salvos`);
    
    // Mostrar feedback visual temporário (opcional)
    // Poderia implementar um toast/snackbar aqui
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
          <div className="mt-3 mb-3 flex justify-center">
            <div className="relative rounded-lg overflow-hidden cursor-pointer max-w-full">
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
          <div className="mt-3 mb-3 flex justify-center">
            <div className="relative rounded-lg overflow-hidden max-w-full">
              <video 
                src={post.mediaUrl}
                className="w-full h-full rounded-lg"
                controls
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="mt-3 mb-3 bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <MusicalNoteIcon className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {post.audioName || "Áudio"}
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

  // Se o modal não deve ser exibido, não renderiza nada
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur z-55 flex items-center justify-center">
      <div className="bg-black rounded-xl w-full max-w-xl h-full md:h-3/4 flex flex-col scrollbar-right">
        {/* Cabeçalho do modal */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-white">Posts Salvos</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Conteúdo com rolagem */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : postsSalvos.length > 0 ? (
            <div className="space-y-6">
              {postsSalvos.map((post) => (
                <div key={post.id} className="bg-white border border-blue-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={post.profileImg} 
                      alt={`Foto de ${post.username}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold text-gray-800">@{post.username}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{post.content}</p>
                      
                      {/* Renderiza mídia do post se existir */}
                      {renderMedia(post)}
                      
                      {/* Botões de interação */}
                      <div className="flex items-center justify-end mt-2 space-x-2">
                        <button 
                          className="p-1 text-gray-500 rounded-full hover:bg-gray-300 transition-all duration-200 ease-in-out"
                          onClick={() => removerPostSalvo(post.id)}
                          title="Remover dos salvos"
                        >
                          <BookmarkIcon className="w-5 h-5 text-blue-500 fill-current" />
                        </button>
        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Você ainda não tem posts salvos.</p>
              <p className="text-sm text-gray-400 mt-2">Salve posts interessantes para visualizar mais tarde!</p>
            </div>
          )}
        </div>
        
        {/* Rodapé do modal */}
        <div className="border-t p-4">
          <button 
            onClick={onClose}
            className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostsSalvosModal;