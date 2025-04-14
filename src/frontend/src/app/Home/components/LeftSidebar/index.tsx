import { useState, useEffect } from 'react';
import './scroll.css';
import { useRouter } from 'next/navigation';
import EventosCalendarioModal from './EventosCalendario';
import ContratacoesModal from './ContratacoesModal';
import { StarIcon } from '@heroicons/react/24/solid';

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
  // Estados para controlar a exibição dos modais
  const [showEventModal, setShowEventModal] = useState(false);
  const [showContratacoesModal, setShowContratacoesModal] = useState(false);

  // TODO: Integrar com API de perfil do usuário
  // Dados mockados do perfil - devem ser carregados do backend
  const profileData = {
    image: 'https://i.pravatar.cc/150?img=8',
    username: 'joansilva',
    followers: '2.345',
    following: '1.234',
    rating: 4.7 // Nota do perfil (de 0 a 5)
  };

  // TODO: Carregar as tags do perfil do usuário do backend
  // Tags de gêneros musicais 
  const Tags = [
    'Jazz', 'MPB', 'NeoBossa',
    'Indie', 'Folk', 'R&B'
  ];

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
   * TODO: Implementar integração com API de autenticação para:
   * - Invalidar token/sessão atual
   * - Limpar cookies/localStorage
   * - Redirecionar para página inicial
   */
  const handleLogout = () => {
    // TODO: Adicionar chamada para API de logout
    router.push('/');
  };

  // Navega para a página de perfil do usuário
  
  const handleProfileClick = () => {
    router.push('/Profile');
  };

  // Abre o modal de calendário de eventos
  
  const handleEventosClick = () => {
    setShowEventModal(true);
  };
  
  // fecha o modal de calendário de eventos
   
  const closeEventModal = () => {
    setShowEventModal(false);
  };

  // abre o modal de contratações
   
  const handleContratacoesClick = () => {
    setShowContratacoesModal(true);
  };

  //Fecha o modal de contratações
   
  const closeContratacoesModal = () => {
    setShowContratacoesModal(false);
  };

  return (
    <>
      {/* Barra lateral principal */}
      <nav 
        className={`bg-black fixed left-0 top-[60px] bottom-[15px] w-64 rounded-r-xl transition-transform duration-300 z-50 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Área com rolagem para conteúdo da sidebar */}
        <div className="flex-1 overflow-y-auto scrollbar-left p-5">
          {/* Seção de perfil do usuário */}
          <div className="text-center mb-6">
            <img 
              src={profileData.image} 
              alt="Foto de perfil"
              className="w-20 h-20 rounded-full mx-auto mb-1 object-cover"
            />
            <h2 onClick={handleProfileClick} className="text-lg font-medium mb-2 truncate text-white cursor-pointer">
              @{profileData.username}</h2> 
            
            {/* Exibição da avaliação/rating do artista */}
            <div className="flex justify-center mb-3">
              <div className="border-2 border-white rounded-full px-3 flex items-center text-white">
                <span className="font-medium mr-1 ">{profileData.rating}</span>
                <StarIcon className="w-4 h-4 " />
              </div>
            </div>
            
            {/* Contadores de seguidores/seguindo */}
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <p className="font-bold text-white">{profileData.followers}</p>
                <p className="text-gray-400">Seguidores</p>
              </div>
              <div>
                <p className="font-bold text-white">{profileData.following}</p>
                <p className="text-gray-400">Seguindo</p>
              </div>
            </div>
          </div>

          {/* Tags/gêneros musicais do artista */}
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-2 text-white">
              {Tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800 rounded-full text-xs hover:bg-gray-700 transition-colors cursor-pointer text-center truncate"
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
                onClick={handleEventosClick}
              >
                Eventos
              </li>
              <li 
                className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={handleContratacoesClick}
              >
                Contratações
              </li>
              <li className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                Salvos
                {/* TODO: Implementar funcionalidade de itens salvos e integrar com backend */}
              </li>
            </ul>
          </div>
        </div>

        {/* Área fixa de rodapé com botões de ação */}
        <div className="border-t text-white border-gray-700 pt-4 space-y-2 p-5">
          <button className="w-full rounded-full bg-gray-800 hover:bg-gray-700 p-1 text-sm transition-colors">
            Configurações
            {/* TODO: Implementar navegação para página de configurações */}
          </button>
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
        show={showEventModal} 
        onClose={closeEventModal} 
        // TODO: Integrar com API de eventos para buscar eventos do usuário
      />

      {/* Modal para exibição de contratações */}
      <ContratacoesModal
        show={showContratacoesModal}
        onClose={closeContratacoesModal}
        // TODO: Integrar com API de contratações para listar contratações do usuário
      />
    </>
  );
};

export default LeftSidebar;