import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventosCalendarioModal from './EventosCalendario';
import ContratacoesModal from './ContratacoesModal';
import SeguidoresModal from '@/app/components/SeguidoresModal';
import PostsSalvosModal from './PostsSalvosModal';
import { StarIcon } from '@heroicons/react/24/solid';
import { userService } from '@/app/services/api';
/**
 * Componente LeftSidebar
 * 
 * Barra lateral responsiva com perfil do usuário, tags de gêneros musicais 
 * e funcionalidades de navegação para artistas/músicos.
 */
const LeftSidebar = () => {
  const router = useRouter();
  // Estado para controlar a visibilidade da sidebar
  const [isOpen, setIsOpen] = useState(true);
  // Estado para rastrear se a sidebar deve estar no modo colapsado (em telas menores)
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Estado unificado para controlar todos os modais
  const [modalAtivo, setModalAtivo] = useState({
    tipo: null, // 'eventos', 'contratacoes', 'seguidores', 'salvos'
    subtipo: null // usado para diferenciar 'seguidores' e 'seguindo'
  });

  const [profileData, setProfileData] = useState({
    username: '',
    image: '',
    followers: '0',
    following: '0',
    rating: '0.0',
    tags: []
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfileData({
          username: data.name,
          image: data.profileImage,
          followers: data.followers || '12345',
          following: data.following || '6789',
          rating: data.rating || '4.7',
          tags: data.tags || []
        });
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };
  
    fetchProfile();
  }, []);
  
  /**
   * controlar o comportamento responsivo da sidebar
   * - Em telas menores que 1200px, colapsa automaticamente
   * - Em telas maiores, permanece aberta
   */
  useEffect(() => {
    const handleResize = () => {
      const breakpoint = 1200;
      const shouldCollapse = window.outerWidth <= breakpoint;
      setIsCollapsed(shouldCollapse);
      if (shouldCollapse) setIsOpen(false);
      else setIsOpen(true);
    };

    handleResize(); // Executa ao montar para definir o estado inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // Limpeza
  }, []);

  /**
   * Função para realizar logout
   * TODO: Implementar integração com API de autenticação
   */
  const handleLogout = async () => {
    try {
      await userService.logout();
      router.push('/Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Navega para a página de perfil do usuário
  const handleProfileClick = () => {
    router.push('/Profile');
  };

  // Função única para abrir modais
  const abrirModal = (tipo, subtipo = null) => {
    setModalAtivo({ tipo, subtipo });
  };

  // Função única para fechar todos os modais
  const fecharModal = () => {
    setModalAtivo({ tipo: null, subtipo: null });
  };

  return (
    <>
      {/* Barra lateral principal */}
      <nav 
        className={`bg-black fixed border-2 border-gray-700 shadow-sm shadow-blue-950 left-0 top-[60px] bottom-[15px] w-64 rounded-r-xl transition-transform duration-300 z-50 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Área com rolagem para conteúdo da sidebar */}
        <div className="flex-1 overflow-y-auto scrollbar-right p-5">
          {/* Seção de perfil do usuário */}
          <div className="text-center mb-6">
            {profileData.image ? (
              <img 
                src={profileData.image} 
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full mx-auto mb-1 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto mb-1 bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-2xl">?</span>
              </div>
            )}
            <span onClick={handleProfileClick} className="text-lg font-medium mb-4 truncate text-white cursor-pointer">
              @{profileData.username}</span> 
            
            {/* Exibição da avaliação/rating do artista */}
            <div className="flex justify-center mb-3">
              <div className="border-2 border-white rounded-full px-3 flex items-center text-white">
                <span className="font-medium mr-1 ">{profileData.rating}</span>
                <StarIcon className="w-4 h-4 " />
              </div>
            </div>
            
            {/* Contadores de seguidores/seguindo com interação para abrir modais */}
            <div className="flex justify-center gap-8 text-sm">
              <div 
                onClick={() => abrirModal('seguidores', 'seguidores')}
                className="cursor-pointer hover:opacity-80 transition-opacity">
                <p className="font-bold text-white">{profileData.followers}</p>
                <p className="text-gray-400">Seguidores</p>
              </div>
              <div 
                onClick={() => abrirModal('seguidores', 'seguindo')}
                className="cursor-pointer hover:opacity-80 transition-opacity">
                <p className="font-bold text-white">{profileData.following}</p>
                <p className="text-gray-400">Seguindo</p>
              </div>
            </div>
          </div>

          {/* Tags/gêneros musicais do artista */}
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-2 text-white">
              {profileData.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800 rounded-full text-xs text-center truncate"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Menu de navegação principal */}
          <div className="flex-1 align-center border-t border-gray-700">
            <ul className="flex flex-col gap-2 mt-4 text-center text-white">
              <li 
                className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => abrirModal('eventos')}
              >
                Eventos
              </li>
              <li 
                className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => abrirModal('contratacoes')}
              >
                Contratações
              </li>
              <li 
                className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => abrirModal('salvos')}
              >
                Salvos
              </li>
            </ul>
          </div>
        </div>

        {/* Área fixa de rodapé com botões de ação */}
        <div className="border-t text-white border-gray-700 pt-4 space-y-2 p-5">
          {/*<button className="w-full rounded-full bg-gray-800 hover:bg-gray-700 p-1 text-sm transition-colors">
            Configurações
             TODO: Implementar navegação para página de configurações 
          </button>*/}
          <button 
          onClick={handleLogout}
          className="w-full rounded-full bg-red-600 hover:bg-red-400 p-1 text-sm transition-colors">
          Sair
        </button>
        </div>

        {/* Botão para fechar sidebar em modo responsivo */}
        {isCollapsed && isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 shadow-lg border border-gray-600"
          >
            ×
          </button>
        )}
      </nav>

      {/* Botão para abrir sidebar quando ela estiver fechada (em modo responsivo) */}
      {isCollapsed && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            fixed z-50 bg-black text-white rounded-full cursor-pointer text-2xl
            w-10 h-10 flex items-center justify-center transition-all duration-300
            ${isOpen ? 'left-64 opacity-0' : 'left-3 opacity-100'}
            bottom-5 hover:bg-gray-800
          `}
        >
          ☰
        </button>
      )}

      {/* Modal para exibição de eventos */}
      <EventosCalendarioModal 
        show={modalAtivo.tipo === 'eventos'} 
        onClose={fecharModal} 
        // TODO: Integrar com API de eventos para buscar eventos do usuário
      />

      {/* Modal para exibição de contratações */}
      <ContratacoesModal
        show={modalAtivo.tipo === 'contratacoes'}
        onClose={fecharModal}
        // TODO: Integrar com API de contratações para listar contratações do usuário
      />

      {/* Modal para exibição de seguidores/seguindo */}
      <SeguidoresModal
        show={modalAtivo.tipo === 'seguidores'}
        onClose={fecharModal}
        type={modalAtivo.subtipo}
      />
      
      {/* NOVO: Modal para exibição de posts salvos */}
      <PostsSalvosModal
        show={modalAtivo.tipo === 'salvos'}
        onClose={fecharModal}
      />
    </>
  );
};

export default LeftSidebar;