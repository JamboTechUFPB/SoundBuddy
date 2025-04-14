
import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';   // Ícone de estrela preenchida
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';  // Ícone de estrela contorno

/**
 * Componente de Modal para gerenciamento de contratações de shows/eventos
 * Permite visualizar contratações existentes e adicionar novas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.show - Controla se o modal está visível
 * @param {function} props.onClose - Função para fechar o modal
 */
const ContratacoesModal = ({ show, onClose }) => {
  // Estado para controlar qual aba está ativa (minhas contratações ou nova contratação)
  const [activeTab, setActiveTab] = useState('minhas');
  
  // Estado para armazenar os dados do formulário de nova contratação
  const [formData, setFormData] = useState({
    nome: '',    // Nome do evento/show
    data: '',    // Data do evento
    cliente: '', // Nome do cliente/contratante
    valor: ''    // Valor da contratação
  });
  
  // Estado para armazenar a avaliação (1-5 estrelas)
  const [rating, setRating] = useState(5);
  
  // Estado para controlar o efeito visual ao passar o mouse nas estrelas
  const [hoverRating, setHoverRating] = useState(0);

  // Dados de exemplo para contratações anteriores
  // TODO: Na implementação real a gente coloca para pegar do bd ou API
  const contratacoesAnteriores = [
    {
      id: 1,
      nome: 'Show no Bar do João',
      data: '10/03/2025',
      cliente: 'Bar do João',
      clienteImg: 'https://i.pravatar.cc/150?img=1', 
      nota: 4.7,
      valor: 'R$ 1.500,00'
    },
    {
      id: 2,
      nome: 'Casamento Silva',
      data: '15/02/2025',
      cliente: 'Maria Silva',
      clienteImg: 'https://i.pravatar.cc/150?img=5',
      nota: 5.0,
      valor: 'R$ 3.000,00'
    },
    {
      id: 3,
      nome: 'Festival de Verão',
      data: '22/01/2025',
      cliente: 'Organizadores Festival',
      clienteImg: 'https://i.pravatar.cc/150?img=3',
      nota: 4.2,
      valor: 'R$ 5.000,00'
    },
    {
      id: 4,
      nome: 'Festival de Verão',
      data: '22/01/2025',
      cliente: 'Organizadores Festival',
      clienteImg: 'https://i.pravatar.cc/150?img=3',
      nota: 4.2,
      valor: 'R$ 5.000,00'
    }
  ];

  /**
   * Função que atualiza o estado do formulário quando o usuário digita em um campo
   * @param {Object} e - Evento do DOM
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // TODO: Adicionar validação em tempo real para os campos (especialmente para valor)
  };

  /**
   * Função que lida com o envio do formulário de nova contratação
   * @param {Object} e - Evento do DOM
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Implementar a lógica para salvar a nova contratação no backend
    console.log('Nova contratação:', { ...formData, nota: rating });
    
    // Resetando o formulário após envio 
    setFormData({
      nome: '',
      data: '',
      cliente: '',
      valor: ''
    });
    setRating(5);
    
    // Voltando para a lista de contratações
    setActiveTab('minhas');
    
   
  };

  // se não deve ser exibido, não renderiza nada
  if (!show) return null;

  return (
    // Container principal do modal - cobre toda a tela com fundo escuro e desfoque
    <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center">
      {/* Box do modal em si */}
      <div className="bg-black rounded-xl pt-6 pb-6 pl-6 pr-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Cabeçalho do modal com título e botão de fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Contratações</h2>
          <button 
            onClick={onClose}
            className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 shadow-lg border border-gray-600"
          >
            x
          </button>
        </div>

        {/* Navegação por abas -  alterna entre visualizar e adicionar contratações */}
        <div className="flex border-b border-gray-700 mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'minhas' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('minhas')}
          >
            Minhas Contratações
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'nova' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('nova')}
          >
            Nova Contratação
          </button>
        </div>

        {/* Conteúdo da Tab ativa */}
        {activeTab === 'minhas' ? (
          // Conteúdo da aba "Minhas Contratações" - Lista scrollável de contratações
          <div className="space-y-3 max-h-80 overflow-y-auto pb-5 scrollbar-right">
            {/* Mapeia cada contratação para um card */}
            {contratacoesAnteriores.map(contratacao => (
              <div 
                key={contratacao.id} 
                className="border-2 border-white rounded-lg p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                // TODO: Adicionar função onClick para editar 
              >
                {/* Linha superior: data e valor */}
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{contratacao.data}</span>
                  <span className="text-green-400 text-sm">{contratacao.valor}</span>
                </div>
                
                {/* Nome/título da contratação */}
                <p className="text-white">{contratacao.nome}</p>
                
                {/* Linha inferior: avatar + nome do cliente e nota de avaliação */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={contratacao.clienteImg} 
                      alt={contratacao.cliente} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-gray-300 text-sm">{contratacao.cliente}</span>
                  </div>
                  {/* Badge com avaliação numérica e ícone de estrela */}
                  <div className="bg-white rounded-full px-2 py-1 flex items-center">
                    <span className="font-medium text-xs mr-1">{contratacao.nota}</span>
                    <StarIcon className="w-3 h-3 text-black" />
                  </div>
                </div>
              </div>
            ))}

            {/* Mensagem exibida quando não há contratações cadastradas */}
            {contratacoesAnteriores.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Você ainda não tem contratações cadastradas.
              </div>
            )}
            
            {/* Botão para adicionar nova contratação - redireciona para a aba de nova contratação */}
            <div className="mt-5 flex justify-center items-center">
              <button
                onClick={() => setActiveTab('nova')}
                className="px-4 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-colors flex items-center"
              >
                <span className="mr-1">+</span> Adicionar Contratação
              </button>
            </div>
          </div>
        ) : (
          // Conteúdo da aba "Nova Contratação" - Formulário para adicionar contratação
          <div className="pb-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome da Contratação */}
              <div>
                <label className="block text-white mb-1">Nome da Contratação</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="Ex: Show no Bar do João"
                  required
                />
              </div>
              
              {/* Cliente */}
              <div>
                <label className="block text-white mb-1">Cliente</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="Nome do cliente/contratante"
                  required
                />
              </div>
              
              {/* Data */}
              <div>
                <label className="block text-white mb-1">Data</label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                  required
                />
              </div>
              
              {/* Valor */}
              <div>
                <label className="block text-white mb-1">Valor (R$)</label>
                <input
                  type="text"
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="Ex: 1500,00"
                  required
                />
              </div>
              
              {/* Avaliação */}
              <div>
                <label className="block text-white mb-3">Avaliação</label>
                  <div className="flex items-center space-x-1 mb-2">
                    {/* Renderiza 5 estrelas, cada uma clicável para definir a nota */}
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        type="button"
                        className="focus:outline-none transition-all duration-200 transform hover:scale-110"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {/* Lógica para mostrar estrela preenchida ou contorno baseado no rating atual ou hover */}
                        {(hoverRating || rating) >= star ? (
                          <StarIcon className="w-8 h-8 text-gray-400" />
                        ) : (
                          <StarOutline className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    ))}
                  </div>
              </div>
              
              {/* Botões de ação do formulário */}
              <div className="flex justify-center space-x-3 mt-6">
                {/* Botão cancelar - volta para a aba de listagem sem salvar */}
                <button 
                  type="button"
                  onClick={() => setActiveTab('minhas')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                {/* Botão salvar - envia o formulário */}
                <button 
                  type="submit"
                  className="px-4 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  Salvar Contratação
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContratacoesModal;