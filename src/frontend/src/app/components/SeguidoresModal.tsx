import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

/**
 * Componente SeguidoresModal
 * 
 * Modal responsivo para exibição e gerenciamento de seguidores/seguindo
 * Permite visualizar listas de usuários e remover conexões
 * 
 * @param {boolean} show - Controla a visibilidade do modal
 * @param {function} onClose - Função para fechar o modal
 * @param {string} type - Tipo de lista a ser exibida ('seguidores' ou 'seguindo')
 */
const SeguidoresModal = ({ show, onClose, type = 'seguidores' }) => {
  // Estado para armazenar a lista de usuários (seguidores ou seguindo)
  const [usuarios, setUsuarios] = useState([]);
  // Estado para controlar o modal de confirmação
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Estado para armazenar o usuário selecionado para remoção
  const [selectedUser, setSelectedUser] = useState(null);

  // Título do modal baseado no tipo
  const titulo = type === 'seguidores' ? 'Seguidores' : 'Seguindo';

  // TODO: Integrar com API para buscar seguidores/seguindo
  useEffect(() => {
    if (show) {
      // Carregar os dados quando o modal é aberto
      fetchUsuarios();
    }
  }, [show, type]);

  /**
   * Busca os usuários da API (mock por enquanto)
   * TODO: Implementar integração com backend
   */
  const fetchUsuarios = () => {
    // Simula dados que viriam do backend
    const mockUsuarios = [
      { id: 1, username: 'mariasilva', name: 'Maria Silva', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: 2, username: 'carlosoliveira', name: 'Carlos Oliveira', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: 3, username: 'analucia', name: 'Ana Lúcia', avatar: 'https://i.pravatar.cc/150?img=9' },
      { id: 4, username: 'pedromartins', name: 'Pedro Martins', avatar: 'https://i.pravatar.cc/150?img=12' },
      { id: 5, username: 'lucassantos', name: 'Lucas Santos', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: 6, username: 'beatrizlima', name: 'Beatriz Lima', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 7, username: 'felipegomes', name: 'Felipe Gomes', avatar: 'https://i.pravatar.cc/150?img=7' },
    ];
    
    setUsuarios(mockUsuarios);
  };

  /**
   * Inicia o processo de remoção de um usuário
   * @param {Object} usuario - O usuário a ser removido
   */
  const handleRemoveUsuario = (usuario) => {
    setSelectedUser(usuario);
    setShowConfirmModal(true);
  };

  /**
   * Confirma a remoção de um usuário da lista
   */
  const confirmRemoveUsuario = () => {
    // TODO: Implementar chamada para API para remover seguidor/seguindo
    setUsuarios(usuarios.filter(u => u.id !== selectedUser.id));
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  /**
   * Cancela a remoção e fecha o modal de confirmação
   */
  const cancelRemoveUsuario = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  /**
   * Navega para o perfil do usuário
   * TODO: Implementar integração com router
   * @param {Object} usuario - O usuário cujo perfil será visitado
   */
  const handleProfileClick = (usuario) => {
    // TODO: Implementar navegação para o perfil do usuário
    console.log(`Navegando para perfil de ${usuario.username}`);
    // router.push(`/profile/${usuario.username}`);
  };

  // Se o modal não estiver visível, não renderiza nada
  if (!show) return null;

  return (
    <>
      {/* Backdrop escuro */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur z-55"
        onClick={onClose}
      />
      
      {/* Modal principal */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-black text-white border border-gray-700 rounded-xl w-full max-w-md z-55 scrollbar-right"
      >
        {/* Cabeçalho do modal */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-medium">{titulo}</h2>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Conteúdo do modal com lista de usuários */}
        <div className="max-h-96 overflow-y-auto scrollbar-left py-2">
          {usuarios.length > 0 ? (
            <ul>
              {usuarios.map(usuario => (
                <li 
                  key={usuario.id} 
                  className="px-6 py-3 hover:bg-gray-800 flex items-center justify-between"
                >
                  {/* Informações do usuário */}
                  <div 
                    className="flex items-center flex-1 cursor-pointer" 
                    onClick={() => handleProfileClick(usuario)}
                  >
                    <img 
                      src={usuario.avatar} 
                      alt={`Avatar de ${usuario.name}`}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-medium">{usuario.name}</p>
                      <p className="text-gray-400 text-sm">@{usuario.username}</p>
                    </div>
                  </div>
                  
                  {/* Botão de remover */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUsuario(usuario);
                    }}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-8 text-gray-400">
              {type === 'seguidores' ? 'Nenhum seguidor encontrado.' : 'Não está seguindo ninguém.'}
            </p>
          )}
        </div>
      </div>

      {/* Modal de confirmação para remover seguidor/seguindo */}
      {showConfirmModal && selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur z-55"
            onClick={cancelRemoveUsuario}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-black text-white border border-gray-700 rounded-xl p-6 z-55 w-80">
            <h3 className="text-lg font-medium mb-4">Confirmar remoção</h3>
            <p className="mb-6">
              {type === 'seguidores' 
                ? `Deseja realmente remover ${selectedUser.name} dos seus seguidores?` 
                : `Deseja realmente deixar de seguir ${selectedUser.name}?`}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelRemoveUsuario}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmRemoveUsuario}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
              >
                Remover
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SeguidoresModal;