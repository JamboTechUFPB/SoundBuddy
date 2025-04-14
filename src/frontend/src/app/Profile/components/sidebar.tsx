import { useState, useEffect } from 'react';
import { CalendarIcon, UserGroupIcon, BookmarkIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

/**
 * Componente Sidebar
 * 
 * Renderiza uma barra lateral responsiva com três seções de conteúdo:
 * - Próximos eventos
 * - Últimas contratações
 * - Itens salvos
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.events - Lista de eventos próximos
 * @param {Array} props.hires - Lista de contratações recentes
 * @param {Array} props.savedItems - Lista de itens salvos pelo usuário
 */
const Sidebar = ({ events, hires, savedItems }) => {
  // Estado para controlar se a sidebar está aberta ou fechada
  const [isOpen, setIsOpen] = useState(false);
  
  // Estado para verificar se a sidebar deve estar no modo colapsável (mobile)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Efeito para gerenciar o comportamento responsivo da sidebar
  useEffect(() => {
    // Função que determina como a sidebar deve se comportar baseado no tamanho da tela
    const handleResize = () => {
      const breakpoint = 1024; // Corresponde ao breakpoint 'lg' do Tailwind
      const shouldCollapse = window.innerWidth <= breakpoint;

      // Atualiza o estado de colapso
      setIsCollapsed(shouldCollapse);
      
      // Se estiver em modo mobile, a sidebar começa fechada
      // Se estiver em desktop, a sidebar fica sempre aberta
      if (shouldCollapse) setIsOpen(false);
      else setIsOpen(true);
    };

    // Chama a função uma vez no carregamento inicial
    handleResize();
    
    // Adiciona um listener para reagir a mudanças de tamanho da janela
    window.addEventListener('resize', handleResize);
    
    // Limpa o listener quando o componente é desmontado
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para alternar a visibilidade da sidebar no modo mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar Principal */}
      <div 
        className={`bg-black fixed text-white space-y-5 right-0 top-0 bottom-0 w-full md:bg-transparent md:w-96 transition-transform duration-300 z-40 scrollbar-right
          ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0
        `}
      >
        {/* Conteúdo da Sidebar */}
        <div className="pb-4 pr-4 pl-4 space-y-5 h-full overflow-y-auto">
          {/* Botão para fechar a sidebar no modo mobile */}
          {isCollapsed && isOpen && (
            <button
              onClick={toggleSidebar}
              className="absolute right-4 top-4 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 shadow-lg border border-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}

          <div className="pt-6">
            {/* Seção: Próximos Eventos */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Próximos Eventos</h3>
              </div>
              <div className="space-y-3">
                {/* Renderiza até 3 eventos se existirem, ou uma mensagem */}
                {events && events.length > 0 ? (
                  events.slice(0, 3).map((event, index) => (
                    <div 
                      key={index} 
                      className="border-2 border-white rounded-full px-4 py-1 flex justify-between items-center hover:bg-gray-800 transition-colors"
                    >
                      <span className="truncate">{event.name}</span>
                      <span className="text-gray-400 text-sm whitespace-nowrap">
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Nenhum evento próximo</p>
                )}
              </div>
            </div>

            {/* Seção: Últimas Contratações */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-4">
                <UserGroupIcon className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Últimas Contratações</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 place-items-center">
                {/* Renderiza até 6 fotos de contratos em um grid, ou uma mensagem */}
                {hires && hires.length > 0 ? (
                  hires.slice(0, 6).map((hire, index) => (
                    <img
                      key={index}
                      src={hire.profileImage || 'https://i.pravatar.cc/150?img=3'} // Imagem de fallback se não existir
                      alt={`Foto de ${hire.name || 'Contratante'}`}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white hover:border-blue-400 transition-colors"
   
               
                    />
                  ))
                ) : (
                  <p className="text-gray-400 col-span-3">Nenhuma contratação recente</p>
                )}
              </div>
            </div>

            {/* Seção: Itens Salvos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookmarkIcon className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Itens Salvos</h3>
              </div>
              <div className="space-y-3">
                {/* Renderiza os 3 últimos itens salvos (em ordem inversa), ou uma mensagem */}
                {savedItems && savedItems.length > 0 ? (
                  savedItems.slice(-3).reverse().map((item, index) => (
                    <div 
                      key={index} 
                      className="border-2 border-white rounded-lg p-3 hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="font-medium truncate">{item.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{item.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Nenhum item salvo</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão flutuante para abrir a sidebar no modo mobile */}
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          className={`
            fixed z-50 bg-black text-white rounded-full cursor-pointer
            w-12 h-12 flex items-center justify-center transition-all duration-300
            ${isOpen ? 'right-64 opacity-0' : 'right-6 opacity-100'}
            top-6 hover:bg-gray-800 shadow-xl
          `}
          aria-label="Toggle Sidebar"
          
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}
    </>
  );
};



export default Sidebar;