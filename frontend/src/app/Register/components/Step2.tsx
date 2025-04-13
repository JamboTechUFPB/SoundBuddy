'use client';
import { FormData, StepProps } from './types';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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
  // Array com as tags de gêneros musicais disponíveis para seleção 
  // TODO:  API para carregar tags dinâmicamente
  const tags = ['Jazz', 'Rock', 'Pop', 'Eletrônica', 'Clássica', 'MPB'];
  
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
  };
  
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
          <textarea
            placeholder="Escreva Aqui..."
            className="w-full h-60 md:h-96 p-4 md:p-6 bg-gray-100 rounded-xl text-black placeholder-gray-500 focus:outline-none resize-none"
            value={formData.about}
            onChange={(e) => setFormData({...formData, about: e.target.value})}
            // TODO: Adicionar contador de caracteres ou indicador de tamanho ideal
          />
        </div>
      </div>
      
      {/* Seção Tags (Mobile: Abaixo do Sobre Você, Desktop: Lado Direito) */}
      <div className="md:w-1/2 w-full bg-black p-6 md:p-12 flex flex-col justify-between">
        <div className="space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Escolha suas Tags</h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8">
            As tags são seis palavras-chave que descrevem cada perfil, facilitando para músicos e profissionais serem encontrados por contratantes.
          </p>
          
          {/* Grid de Tags Responsiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {/* Mapeamento das tags disponíveis para botões selecionáveis */}
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`p-2 md:p-3 rounded-full border-2 transition-all text-sm md:text-base
                  ${formData.tags.includes(tag)
                    ? 'bg-white text-black border-white'
                    : 'border-gray-500 text-white hover:border-white'}`}
                aria-pressed={formData.tags.includes(tag)}
                // TODO: Adicionar limite máximo de tags selecionáveis (6)
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Botões de Navegação */}
        <div className="flex flex-row md:flex-row justify-between items-center md:mt-0">
          {/* Botão Voltar */}
          <button
            onClick={handlePreviousStep}
            className="md:w-auto bg-black text-white rounded-full p-3 md:p-3 hover:bg-gray-800 transition-colors mt-4 md:mt-0"
            aria-label="Voltar para o passo anterior"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          
          {/* Botão Avançar */}
          <button
            onClick={handleNextStep}
            className="md:w-auto bg-white text-black rounded-full p-3 md:p-3 hover:bg-gray-300 transition-colors mt-4 md:mt-0"
            aria-label="Avançar para o próximo passo"
            // TODO: Desabilitar se nenhuma tag for selecionada
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

// TODO: Implementar validação para garantir que o usuário selecione pelo menos uma tag
// TODO: Adicionar animação de transição entre os passos do formulário
// TODO: Considerar adicionar campo para tags personalizadas além das pré-definidas

export default Step2;