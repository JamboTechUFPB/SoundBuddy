"use client"; 

import React, { useState } from 'react';

/**
 * Componente de Modal para gerenciamento de eventos no calendário
 * Permite visualizar próximos eventos e adicionar novos
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.show - Controla se o modal está visível
 * @param {function} props.onClose - Função para fechar o modal
 */
const EventosCalendarioModal = ({ show, onClose }) => {
  // Estado para controlar qual aba está ativa (eventos ou novo evento)
  const [activeTab, setActiveTab] = useState('eventos');

  // Dados de exemplo para próximos eventos
  // TODO: Na implementação real, devem vir de uma API ou banco de dados
  const eventosProximos = [
    { id: 1, data: '15/04/2025', titulo: 'Festival de Jazz', local: 'Teatro Municipal', contratante: 'Secretaria de Cultura' },
    { id: 2, data: '22/04/2025', titulo: 'Show MPB ao Vivo', local: 'Parque da Cidade', contratante: 'Produtora Musical BR' },
    { id: 3, data: '01/05/2025', titulo: 'Jam Session', local: 'Blue Note Club', contratante: 'Blue Note' },
    { id: 4, data: '10/05/2025', titulo: 'Concerto Folk', local: 'Centro Cultural', contratante: 'Associação Cultural' },
    { id: 5, data: '18/05/2025', titulo: 'Indie Music Fest', local: 'Arena Multiuso', contratante: 'Indie Productions' },
  ];

  // Estado para armazenar os dados do formulário de novo evento
  const [novoEvento, setNovoEvento] = useState({
    data: '',        
    titulo: '',     
    local: '',       
    contratante: '', 
    horario: '',     
  });

  /**
   * Função que atualiza o estado do formulário quando o usuário digita em um campo
   * @param {Object} e - Evento do DOM
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoEvento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Função que lida com o envio do formulário de novo evento
   * @param {Object} e - Evento do DOM
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: IMPLEMENTAR LÓGICA PARA SALVAR EVENTO NO BACKEND
    console.log('Novo evento:', novoEvento);
    
    // Resetar o formulário após envio bem-sucedido
    setNovoEvento({
      data: '',
      titulo: '',
      local: '',
      contratante: '',
      horario: '',
      descricao: ''
    });
    
    // Voltar para a aba de listagem de eventos após salvar
    setActiveTab('eventos');
    
    
  };

  // Se não deve ser exibido, não renderiza nada
  if (!show) return null;

  return (
    // Container principal do modal - cobre toda a tela com fundo escuro e desfoque
    <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center">
      {/* Box do modal em si */}
      <div className="bg-black rounded-xl pt-6 pb-6 pl-6 pr-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Cabeçalho do modal com título dinâmico baseado na aba ativa e botão de fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {activeTab === 'eventos' ? 'Próximos Eventos' : 'Adicionar Novo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 shadow-lg border border-gray-600"
          >
            x
          </button>
        </div>

        {/* Navegação por abas - permite alternar entre visualizar e adicionar eventos */}
        <div className="flex border-b border-gray-700 mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'eventos' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('eventos')}
          >
            Eventos
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'novoEvento' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('novoEvento')}
          >
            Novo Evento
          </button>
        </div>

        {/* Conteúdo da Tab ativa */}
        {activeTab === 'eventos' ? (
          // Conteúdo da aba "Eventos" - Lista scrollável de próximos eventos
          <>
            <div className="space-y-3 max-h-80 overflow-y-auto pb-5 scrollbar-right">
              {/* Mapeia cada evento para um card */}
              {eventosProximos.map(evento => (
                <div 
                  key={evento.id} 
                  className="border-2 border-white rounded-lg p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                  // TODO: Adicionar função onClick para editar ou visualizar detalhes do evento
                >
                  {/* Linha superior: data e local */}
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{evento.data}</span>
                    <span className="text-gray-300 text-sm">{evento.local}</span>
                  </div>
                  
                  {/* Nome/título do evento */}
                  <p className="text-white">{evento.titulo}</p>
                  
                  {/* Linha inferior: contratante */}
                  <p className="text-gray-300 text-sm mt-1">Contratante: {evento.contratante}</p>
                </div>
              ))}
              
              {/* TODO: Adicionar mensagem quando não houver eventos */}
              {eventosProximos.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Você não tem eventos agendados.
                </div>
              )} 
            </div>

            {/* Botão para adicionar novo evento - redireciona para a aba de novo evento */}
            <div className="mt-5 flex justify-center items-center">
              <button
                onClick={() => setActiveTab('novoEvento')}
                className="px-4 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-colors flex items-center"
              >
                <span className="mr-1">+</span> Adicionar Evento
              </button>
            </div>
          </>
        ) : (
          // Conteúdo da aba "Novo Evento" - form para adicionar evento
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Data */}
            <div>
              <label className="block text-white mb-1">Data</label>
              <input
                type="date"
                name="data"
                value={novoEvento.data}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                required
              />
            </div>
            
            {/* Horário */}
            <div>
              <label className="block text-white mb-1">Horário</label>
              <input
                type="time"
                name="horario"
                value={novoEvento.horario}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                required
              />
            </div>
            
            {/* Título */}
            <div>
              <label className="block text-white mb-1">Título</label>
              <input
                type="text"
                name="titulo"
                value={novoEvento.titulo}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                required
              />
            </div>
            
            {/* Local */}
            <div>
              <label className="block text-white mb-1">Local</label>
              <input
                type="text"
                name="local"
                value={novoEvento.local}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                required
              />
            </div>
            
            {/* Contratante */}
            <div>
              <label className="block text-white mb-1">Contratante</label>
              <input
                type="text"
                name="contratante"
                value={novoEvento.contratante}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                required
              />
            </div>
            
            
            
            {/* Botões de ação do formulário */}
            <div className="flex justify-center space-x-3 mt-6">
              {/* Botão cancelar - volta para a aba de listagem sem salvar */}
              <button 
                type="button"
                onClick={() => setActiveTab('eventos')}
                className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              {/* Botão salvar - envia o formulário */}
              <button 
                type="submit"
                className="px-4 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Salvar Evento
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventosCalendarioModal;