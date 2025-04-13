import { useState, useEffect, useRef } from 'react'; // Importando hooks necessários do React
import { PaperAirplaneIcon, XMarkIcon, EllipsisHorizontalIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Importando ícones de outline
import { CheckIcon } from '@heroicons/react/24/solid'; // Importando ícone sólido para check de leitura

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
      
      // Adiciona a nova mensagem ao estado de mensagens
      setMessages([...messages, { text: message, sender: 'me', time: timestamp, status: 'sent' }]);
      
      // Limpa o campo de input
      setMessage('');
      
      // Simulação de "digitando..." para o outro usuário
      setIsTyping(true);
      
      // TODO: Implementar envio real da mensagem para API/backend
      // TODO: Implementar websockets para comunicação em tempo real
      
      // Simulação de resposta após envio (remover em produção)
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
          // Adicionar mensagem de resposta simulada
          return [...updatedMessages, { 
            text: `Resposta à mensagem`, 
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
    
    // TODO: Implementar carregamento real do histórico de mensagens da API/backend
    // TODO: Implementar paginação para carregar mensagens mais antigas sob demanda
  }, []);


  return (
    <div className="fixed inset-0 md:inset-auto md:right-0 md:top-[60px] md:bottom-[15px] md:w-64 md:rounded-l-xl bg-black bg-opacity-95 flex justify-center items-center z-100 shadow-2xl">
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
              <div className={`max-w-xs space-y-1 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                {/* Balão da mensagem */}
                <div 
                  className={`px-3 py-2 rounded-2xl text-sm ${
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
            {/* Botão para adicionar imagens/fotos */}
            <button className="text-gray-500 hover:text-gray-300">
              <PhotoIcon className="w-5 h-5" />
              {/* TODO: Implementar upload de imagens/arquivos ou tirar isso, ainda nao sei */}
            </button>
            {/* Textarea com auto-resize */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Mensagem...`}
              className="flex-1 mx-2 bg-transparent outline-none resize-none text-gray-300 placeholder-gray-500 text-sm py-2 max-h-24"
              rows="1"
              // TODO: Adicionar contador de caracteres
              // TODO: Implementar limitador de tamanho da mensagem
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
         
          {/* TODO: Adicionar feedback de erro caso envio falhe */}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;