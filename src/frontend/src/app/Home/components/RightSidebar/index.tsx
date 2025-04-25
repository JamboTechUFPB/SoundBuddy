import { useState, useEffect } from 'react';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';
import ChatModal from '@/app/components/ChatModal';

/**
 * Tipo para definir a estrutura de dados dos chats
 * Cada chat contém um id único, nome do contato, 
 * última mensagem e horário da mensagem
 */
type ChatType = {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
};

/**
 * Componente RightSidebar
 * 
 * Barra lateral direita responsiva que exibe conversas/chats recentes
 * do usuário e permite iniciar novas conversas.
 */
const RightSidebar = () => {
  // Estado para controlar a visibilidade da sidebar
  const [isOpen, setIsOpen] = useState(true);
  // Estado para rastrear se a sidebar deve estar no modo colapsado (em telas menores)
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Estado para armazenar o chat selecionado atualmente
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

  // TODO: Integrar com API de mensagens/chat
  // Dados de exemplo para chats - devem ser carregados do backend
  const chats = [
    { id: 1, name: 'Ana Silva', lastMessage: 'Vamos ensaiar hoje?', time: '15:30' },
    { id: 2, name: 'Carlos Santos', lastMessage: 'Enviei a nova mixagem...', time: '14:45' },
    { id: 3, name: 'Banda RockWave', lastMessage: 'Próximo show confirmado!', time: '10:15' },
  ];

  /**
   * Efeito para controlar o comportamento responsivo da sidebar
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

  return (
    <>
      {/* Sidebar de chat (lado direito) */}
      <nav 
        className={`bg-black fixed right-0 top-[60px] bottom-[15px] w-64 rounded-l-xl transition-transform duration-300 z-50 flex flex-col
          ${isOpen ? '-translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Área com rolagem para lista de chats */}
        <div className="flex-1 text-center overflow-y-auto scrollbar-right p-5">
          <h2 className="text-xl font-bold text-white pb-4 border-b border-gray-700">Chats</h2>
          
          {/* Lista de Chats */}
          <div className="space-y-3 mt-4 pr-2">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors relative"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar com a inicial do nome (placeholder) */}
                  {/* TODO: Integrar com API de usuários para mostrar img real */}
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                    {/* Pra exibir previa da ultima mensagem, tem funcionado no mock pelo menos */}
                    <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* Botão flutuante para abrir sidebar quando ela estiver fechada (em modo responsivo) */}
      {isCollapsed && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            fixed z-50 bg-black text-white rounded-full cursor-pointer text-2xl
            w-10 h-10 flex items-center justify-center transition-all duration-300
            ${isOpen ? 'right-64 opacity-0' : 'right-3 opacity-100'}
            bottom-5 hover:bg-gray-800
          `}
        >
         <ChatBubbleOvalLeftIcon className="w-6 h-6" />
        </button>
      )}

      {/* Modal de Chat - exibido quando um chat é selecionado */}
      {selectedChat && (
        <ChatModal
          user={{ username: selectedChat.name }}
          onClose={() => setSelectedChat(null)}
          // TODO: Integrar com API de mensagens para carregar histórico de conversas
          // TODO: Implementar funcionalidade de envio de mensagens em tempo real (WebSockets)
        />
      )}
    </>
  );
};

export default RightSidebar;