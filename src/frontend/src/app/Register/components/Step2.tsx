'use client';
import { FormData, StepProps } from './types';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { validateStep2, ValidationError } from './Validation';

/**
 * Componente Step2
 * 
 * Segundo passo do formulário de cadastro multi-etapas que permite ao usuário
 * fornecer informações sobre si mesmo e selecionar tags relacionadas aos seus interesses musicais.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {FormData} props.formData - Estado atual do formulário
 * @param {Function} props.setFormData - Função para atualizar o estado do formulário
 * @param {Function} props.handleNextStep - Função para avançar para o próximo passo
 * @param {Function} props.handlePreviousStep - Função para retornar ao passo anterior
 */
const Step2 = ({ formData, setFormData, handleNextStep, handlePreviousStep }: StepProps) => {
  // Estado local para mensagens de erro
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Array com as tags de gêneros musicais disponíveis para seleção 
  // TODO:  API para carregar tags dinâmicamente
  const tags = ['Jazz', 'Rock', 'Pop', 'Eletrônica', 'Clássica', 'MPB', 'tag'];
  
  /**
   * Função para alternar a seleção de uma tag
   * Se a tag já está selecionada, a remove
   * Se a tag não está selecionada, a adiciona ao array de tags
   * 
   * @param {string} tag - A tag a ser alternada
   */
  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
    
    // Limpar erros quando o usuário faz uma seleção
    setErrors([]);
  };
  
  /**
   * Processa a tentativa de ir para o próximo passo com validação
   */
  const processNextStep = () => {
    // Executar validação
    const validationResult = validateStep2(formData);
    
    if (validationResult.isValid) {
      // Se válido, prosseguir para o próximo passo
      handleNextStep();
    } else {
      // Se inválido, mostrar erros
      setErrors(validationResult.errors);
    }
  };

  /**
   * Função para exibir mensagem de erro de um campo específico
   */
  const getErrorMessage = (fieldName: string): string | null => {
    const error = errors.find(err => err.field === fieldName);
    return error ? error.message : null;
  };
  
  /**
   * Calcular caracteres restantes para a descrição
   */
  const remainingChars = 200 - (formData.about?.length || 0);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-auto">
      {/* Conteúdo Principal (Mobile: Scrollável, Desktop: Dividido) */}
      <div className="md:w-1/2 w-full bg-white p-6 md:p-12 flex flex-col">
        {/* Seção Sobre Você */}
        <div className="space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6">Sobre Você</h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8">
            Conte-nos um pouco sobre você! Compartilhe sua jornada artística, o que te inspira e o tipo de trabalho pelo qual você é apaixonado.
          </p>
          
          {/* Campo de texto para descrição do usuário */}
          <div className="relative">
            <textarea
              placeholder="Escreva Aqui..."
              className={`w-full h-60 md:h-96 p-4 md:p-6 bg-gray-100 rounded-xl text-black placeholder-gray-500 focus:outline-none resize-none
                ${getErrorMessage('about') ? 'border-2 border-red-500' : ''}`}
              value={formData.about || ''}
              onChange={(e) => {
                setFormData({...formData, about: e.target.value});
                setErrors(errors.filter(err => err.field !== 'about'));
              }}
            />
            
            {/* Contador de caracteres */}
            <div className={`text-sm mt-2 flex justify-end ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {remainingChars} caracteres restantes
            </div>
            
            {/* Mensagem de erro para o campo about */}
            {getErrorMessage('about') && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage('about')}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Seção Tags (Mobile: Abaixo do Sobre Você, Desktop: Lado Direito) */}
      <div className="md:w-1/2 w-full bg-black p-6 md:p-12 flex flex-col justify-between">
        <div className="space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Escolha suas Tags</h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8">
            As tags são palavras-chave que descrevem seu perfil. Selecione até 6 tags para ajudar outros usuários a encontrá-lo.
          </p>
          
          {/* Grid de Tags Responsiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {/* Mapeamento das tags disponíveis para botões selecionáveis */}
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`p-2 md:p-3 rounded-full border-2 transition-all text-sm md:text-base
                  ${formData.tags?.includes(tag)
                    ? 'bg-white text-black border-white'
                    : 'border-gray-500 text-white hover:border-white'}`}
                aria-pressed={formData.tags?.includes(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
          
          {/* Mensagem de erro para tags */}
          {getErrorMessage('tags') && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage('tags')}</p>
          )}
        </div>
        
        {/* Botões de Navegação */}
        <div className="flex flex-row md:flex-row justify-between items-center md:mt-0">
          {/* Botão Voltar */}
          <button
            onClick={handlePreviousStep}
            className="md:w-auto bg-black text-white rounded-full p-3 md:p-3 hover:bg-gray-800 transition-colors mt-4 md:mt-0 border border-white"
            aria-label="Voltar para o passo anterior"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          
          {/* Botão Avançar */}
          <button
            onClick={processNextStep}
            className="md:w-auto bg-white text-black rounded-full p-3 md:p-3 hover:bg-gray-300 transition-colors mt-4 md:mt-0"
            aria-label="Avançar para o próximo passo"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2;