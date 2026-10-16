import { useState, useEffect, useRef } from 'react'; 
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid'; 

/**
 * Componente ChatModal - Modal de chat para comunicação em tempo real
 * @param {Object} user - Objeto contendo dados do usuário com quem se está conversando
 * @param {Function} onClose - Função para fechar o modal
 */
const ChatModal = ({ user, onClose }) => {
 
  // Estado para armazenar o texto da mensagem atual sendo digitada
  const [message, setMessage] = useState('');
  
  // Estado para armazenar todas as mensagens da conversa
  const [messages, setMessages] = useState([]);
  
  // Estado para controlar a animação de "digitando..."
  const [isTyping, setIsTyping] = useState(false);
  
  // Referência para o elemento do final das mensagens (usado para auto-scroll)
  const messagesEndRef = useRef(null);
  
  // Referência para o textarea (usado para auto-resize)
  const textareaRef = useRef(null);
  
  /**
   * Função para rolar automaticamente para a mensagem mais recente
   * Chamada sempre que uma nova mensagem é adicionada
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Efeito para rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  /**
   * Efeito para ajustar automaticamente a altura do textarea conforme o conteúdo
   * Limita a altura máxima a 100px
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [message]);

  /**
   * Função para enviar uma mensagem
   * - Adiciona a mensagem ao estado
   * - Limpa o campo de input
   * - Simula resposta do destinatário
   * - Atualiza o status da mensagem para "lida"
   */
  const handleSendMessage = () => {
    if (message.trim()) {
      // Obtém o horário atual formatado para exibição
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Adiciona a nova mensagem ao estado de mensagens - preservando quebras de linha
      // Garantimos que o texto da mensagem mantenha suas quebras de linha originais
      setMessages([...messages, { 
        text: message, // Não precisa de replace pois o textarea já preserva as quebras
        sender: 'me', 
        time: timestamp, 
        status: 'sent' 
      }]);
      
      // Limpa o campo de input
      setMessage('');
      
      // Simulação de "digitando..." para o outro usuário
      setIsTyping(true);
      
      /* 
       * IMPLEMENTAÇÃO REAL DE ENVIO DE MENSAGEM
       * =================================
       * 
       * // 1. Criar um identificador único para a mensagem
       * const messageId = uuidv4(); // Usando biblioteca como uuid para gerar IDs únicos
       * 
       * // 2. Criar objeto de mensagem com dados completos
       * const newMessage = {
       *   id: messageId,
       *   text: message,
       *   sender: currentUserId, // ID do usuário atual obtido do contexto de autenticação
       *   receiver: user.id, // ID do destinatário
       *   timestamp: new Date().toISOString(),
       *   status: 'sending', // Status inicial: enviando
       * };
       * 
       * // 3. Adicionar mensagem ao estado local com status "enviando"
       * setMessages(prev => [...prev, { 
       *   ...newMessage, 
       *   sender: 'me', 
       *   time: timestamp, 
       *   status: 'sending',
       *   pending: true 
       * }]);
       * 
       * // 4. Enviar mensagem para o backend
       * sendMessageToAPI(newMessage)
       *   .then(response => {
       *     // 5. Atualizar o status da mensagem para "enviada" após confirmação do servidor
       *     setMessages(prev => prev.map(msg => 
       *       msg.id === messageId 
       *         ? { ...msg, status: 'sent', pending: false, serverTimestamp: response.timestamp } 
       *         : msg
       *     ));
       *   })
       *   .catch(error => {
       *     // 6. Lidar com falha no envio
       *     console.error('Falha ao enviar mensagem:', error);
       *     setMessages(prev => prev.map(msg => 
       *       msg.id === messageId ? { ...msg, status: 'failed', error: error.message } : msg
       *     ));
       *     
       *     // 7. Exibir notificação de erro
       *     setErrorMessage('Falha ao enviar. Toque para tentar novamente.');
       *   });
       * 
       * // 8. Implementação com websockets (Socket.io, por exemplo)
       * // Além do envio via API REST, a conexão websocket notificará em tempo real
       * // quando a mensagem for entregue e lida pelo destinatário
       * 
       * // 9. Configurar listeners para atualizações de status
       * socket.on('message-delivered', (data) => {
       *   if (data.messageId === messageId) {
       *     setMessages(prev => prev.map(msg => 
       *       msg.id === messageId ? { ...msg, status: 'delivered' } : msg
       *     ));
       *   }
       * });
       * 
       * socket.on('message-read', (data) => {
       *   if (data.messageId === messageId) {
       *     setMessages(prev => prev.map(msg => 
       *       msg.id === messageId ? { ...msg, status: 'read' } : msg
       *     ));
       *   }
       * });
       */
      
      // Para fins de demonstração, simulamos uma resposta
      setTimeout(() => {
        setIsTyping(false);
        // Obter o horário atual novamente para a resposta
        const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setMessages(prev => {
          const updatedMessages = [...prev];
          // Atualizar status da última mensagem para "lida"
          if (updatedMessages.length > 0) {
            const lastMsg = updatedMessages[updatedMessages.length - 1];
            if (lastMsg.sender === 'me') {
              updatedMessages[updatedMessages.length - 1] = {...lastMsg, status: 'read'};
            }
          }
          // Adicionar mensagem de resposta simulada com quebras de linha para teste
          return [...updatedMessages, { 
            text: "Resposta à mensagem.\nEsta é uma segunda linha.\nE esta é uma terceira linha para testar quebra de linhas.", 
            sender: 'them',
            time: responseTime
          }];
        });
      }, 2000);
      
    }
  };

  /**
   * Função para lidar com pressionamento de teclas no textarea
   * Permite enviar mensagem ao pressionar Enter (sem Shift)
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Formatar data para o agrupamento de mensagens por dia
   * @param {Date} date - Data a ser formatada
   * @return {String} - String formatada (Hoje, Ontem ou data)
   */
  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (today.toDateString() === messageDate.toDateString()) {
      return 'Hoje';
    } else if (new Date(today.setDate(today.getDate() - 1)).toDateString() === messageDate.toDateString()) {
      return 'Ontem';
    } else {
      return messageDate.toLocaleDateString();
    }
    
    // TODO: Adicionar suporte para mais formatos de data (esta semana, mês passado, etc)
  };

  // Efeito para carregar mensagens iniciais (apenas para demonstração)
  useEffect(() => {
    // Mensagens de demonstração - remover em implementação real
    const demoMessages = [
      { text: "bla bla bla", sender: 'them', time: '09:45', date: new Date() },
    ];
    setMessages(demoMessages);
    
    /* 
     * IMPLEMENTAÇÃO REAL DE CARREGAMENTO DE MENSAGENS
     * ==============================================
     * 
     * // 1. Definir estado para controlar paginação e carregamento
     * const [isLoading, setIsLoading] = useState(true);
     * const [page, setPage] = useState(1);
     * const [hasMore, setHasMore] = useState(true);
     * 
     * // 2. Função para carregar mensagens do backend
     * const loadMessages = async () => {
     *   try {
     *     setIsLoading(true);
     *     
     *     // 3. Fazer requisição à API para obter mensagens
     *     const response = await api.get(`/messages`, {
     *       params: {
     *         conversationId: user.conversationId, // ID da conversa ou do usuário
     *         page: page,
     *         limit: 20, // Número de mensagens por página
     *         sort: 'desc' // Mais recentes primeiro
     *       }
     *     });
     *     
     *     // 4. Processar resultado
     *     const { data, pagination } = response.data;
     *     
     *     // 5. Transformar dados para o formato esperado pelo componente
     *     const formattedMessages = data.map(msg => ({
     *       id: msg.id,
     *       text: msg.content,
     *       sender: msg.senderId === currentUserId ? 'me' : 'them',
     *       time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
     *       date: new Date(msg.createdAt),
     *       status: msg.status // 'sent', 'delivered', 'read'
     *     }));
     *     
     *     // 6. Atualizar estado com as mensagens obtidas
     *     if (page === 1) {
     *       // Primeira página: substituir mensagens
     *       setMessages(formattedMessages.reverse()); // Inverter para mostrar mais antigas primeiro
     *     } else {
     *       // Páginas subsequentes: adicionar ao início (mensagens mais antigas)
     *       setMessages(prev => [...formattedMessages.reverse(), ...prev]);
     *     }
     *     
     *     // 7. Atualizar controle de paginação
     *     setHasMore(pagination.currentPage < pagination.totalPages);
     *     
     *     // 8. Marcar mensagens não lidas como lidas (somente as recebidas)
     *     const unreadIds = data
     *       .filter(msg => msg.senderId !== currentUserId && msg.status !== 'read')
     *       .map(msg => msg.id);
     *       
     *     if (unreadIds.length > 0) {
     *       api.post('/messages/mark-as-read', { messageIds: unreadIds });
     *     }
     *   } catch (error) {
     *     console.error('Erro ao carregar mensagens:', error);
     *     // Exibir notificação de erro
     *   } finally {
     *     setIsLoading(false);
     *   }
     * };
     * 
     * // 9. Carregar mensagens iniciais
     * useEffect(() => {
     *   loadMessages();
     *   
     *   // 10. Configurar listener de websocket para novas mensagens
     *   socket.on('new-message', (newMessage) => {
     *     if (newMessage.conversationId === user.conversationId) {
     *       const formattedMsg = {
     *         id: newMessage.id,
     *         text: newMessage.content,
     *         sender: newMessage.senderId === currentUserId ? 'me' : 'them',
     *         time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
     *         date: new Date(newMessage.createdAt),
     *         status: newMessage.status
     *       };
     *       
     *       setMessages(prev => [...prev, formattedMsg]);
     *       
     *       // Marcar como lida automaticamente se a conversa estiver aberta
     *       if (newMessage.senderId !== currentUserId) {
     *         api.post('/messages/mark-as-read', { messageIds: [newMessage.id] });
     *       }
     *     }
     *   });
     *   
     *   // 11. Configurar listeners para atualizações de status
     *   socket.on('message-status-update', (data) => {
     *     setMessages(prev => 
     *       prev.map(msg => 
     *         msg.id === data.messageId ? { ...msg, status: data.status } : msg
     *       )
     *     );
     *   });
     *   
     *   // 12. Limpar listeners ao desmontar componente
     *   return () => {
     *     socket.off('new-message');
     *     socket.off('message-status-update');
     *   };
     * }, [user.conversationId]);
     * 
     * // 13. Função para carregar mais mensagens (mensagens mais antigas)
     * const loadMoreMessages = () => {
     *   if (!isLoading && hasMore) {
     *     setPage(prev => prev + 1);
     *   }
     * };
     * 
     * // 14. Detectar quando o usuário rola para o topo e carregar mais mensagens
     * const handleScroll = (e) => {
     *   const { scrollTop } = e.currentTarget;
     *   if (scrollTop < 50 && !isLoading && hasMore) {
     *     loadMoreMessages();
     *   }
     * };
     */
  }, []);


  return (
    <div className="fixed inset-0 md:inset-auto md:right-0 md:top-[60px] md:bottom-[15px] md:w-64 md:rounded-l-xl bg-black bg-opacity-95 flex justify-center items-center z-100 shadow-2xl scrollbar-right">
      {/* Container principal do chat */}
      <div className="bg-gray-900 w-full h-full md:rounded-l-xl flex flex-col shadow-xl border-l border-gray-800">
        {/* Cabeçalho do chat com informações do usuário */}
        <div className="bg-black px-4 py-3 flex justify-between items-center md:rounded-tl-xl border-b border-gray-800">
          <div className="flex items-center space-x-3">
            {/* Avatar do usuário com status online */}
            <div className="relative">
              <div className="w-9 h-9 bg-gray-800 rounded-full overflow-hidden ring-2 ring-gray-700">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            {/* Nome de usuário e status */}
            <div className="flex flex-col">
              <span className="font-medium text-gray-200 text-sm">@{user.username}</span>
            </div>
          </div>
          {/* Botões de ação no cabeçalho */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Área de mensagens com scroll */}
        <div className="flex-1 overflow-y-auto p-4 bg-black space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {/* Cabeçalho da data (hoje, ontem, etc) */}
          {messages.length > 0 && (
            <div className="flex justify-center">
              <span className="text-xs py-1 px-3 bg-gray-800 text-gray-400 rounded-full">
                {formatDate(new Date())}
              </span>
            </div>
          )}
          
          {/* Lista de mensagens */}
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] space-y-1 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                {/* Balão da mensagem - Usando white-space-pre-wrap para preservar quebras de linha */}
                <div 
                  className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words max-w-full ${
                    msg.sender === 'me' 
                      ? 'bg-gray-800 text-gray-200 rounded-br-none' 
                      : 'bg-gray-700 text-gray-300 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {/* Horário e status da mensagem */}
                <div className={`flex items-center space-x-1 px-1 ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  {/* Ícones de status (enviado/lido) apenas para mensagens enviadas por mim */}
                  {msg.sender === 'me' && (
                    <span>
                      {msg.status === 'sent' ? (
                        <CheckIcon className="w-3 h-3 text-gray-500" />
                      ) : (
                        <div className="flex">
                          <CheckIcon className="w-3 h-3 text-green-500" />
                          <CheckIcon className="w-3 h-3 text-green-500 -ml-1" />
                        </div>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Indicador de "digitando..." */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700 px-3 py-2 rounded-2xl text-gray-300 rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Elemento invisível para o auto-scroll */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Área de input para enviar mensagens */}
        <div className="bg-black px-3 py-3 md:rounded-bl-xl border-t border-gray-800">
          <div className="flex items-center bg-gray-800 rounded-xl px-3 py-1">
            {/* Textarea com auto-resize */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Mensagem...`}
              className="flex-1 mx-2 bg-transparent outline-none resize-none text-gray-300 placeholder-gray-500 text-sm py-2 max-h-24"
              rows="1"
            />
            {/* Botão de enviar mensagem */}
            <button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`p-1.5 rounded-full transition-colors ${
                message.trim() 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-900 text-gray-600 cursor-not-allowed'
              }`}
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
         
          {/* 
           * IMPLEMENTAÇÃO REAL DE FEEDBACK DE ERRO
           * =======================================
           * 
           * // Componente para notificação de erro
           * {errorMessage && (
           *   <div className="mt-2 px-3 py-1.5 bg-red-500 bg-opacity-20 rounded-lg flex justify-between items-center">
           *     <p className="text-xs text-red-400">{errorMessage}</p>
           *     <button 
           *       onClick={() => setErrorMessage('')}
           *       className="text-red-400 hover:text-red-300"
           *     >
           *       <XMarkIcon className="w-4 h-4" />
           *     </button>
           *   </div>
           * )}
           * 
           * // Componente para notificação de reconexão
           * {isReconnecting && (
           *   <div className="mt-2 px-3 py-1.5 bg-yellow-500 bg-opacity-20 rounded-lg flex justify-between items-center">
           *     <p className="text-xs text-yellow-400">Reconectando...</p>
           *   </div>
           * )}
           */}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;