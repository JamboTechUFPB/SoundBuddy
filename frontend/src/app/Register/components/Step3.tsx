'use client';
import { FormData, StepProps } from './types';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * Componente Step3
 * 
 * Terceiro e último passo do formulário de cadastro multi-etapas que permite ao usuário
 * fazer upload de uma foto de perfil e finalizar o processo de registro.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {FormData} props.formData - Estado atual do formulário
 * @param {Function} props.setFormData - Função para atualizar o estado do formulário
 * @param {Function} props.handleSubmit - Função para enviar o formulário completo
 * @param {Function} props.handlePreviousStep - Função para retornar ao passo anterior
 */
const Step3 = ({ formData, setFormData, handleSubmit, handlePreviousStep }: StepProps) => {
  /**
   * Manipula o upload de arquivo de imagem para a foto de perfil
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança do input de arquivo
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({...formData, profileImage: e.target.files[0]});
      // TODO: Adicionar validação de tamanho e formato de arquivo
      
    }
  };
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
      {/* Lado Esquerdo - Seção de Upload de Foto */}
      <div className="w-full md:w-1/2 bg-black p-12 flex flex-col justify-between min-h-screen md:min-h-0">
        <h2 className="text-3xl font-bold text-white mb-5 mt-10 text-center">Adicione uma Foto de Perfil</h2>
        <div className="flex-1 flex flex-col justify-center items-center">
          
          <div className="flex flex-col items-center gap-6">
            {/* Área da Foto de Perfil */}
            <div className="relative w-40 h-40 md:w-64 md:h-64 rounded-full bg-[#D9D9D9] border-2 border-gray-400">
                
                {formData.profileImage && (
                  <img 
                    src={URL.createObjectURL(formData.profileImage)} 
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full" 
                  />
                )}
              
            </div>
            
            {/* Botão de Upload que aciona o input file oculto */}
            <button
              onClick={() => document.getElementById('profileUpload')?.click()}
              className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors text-sm"
              aria-label="Selecionar foto de perfil"
            >
              Selecionar arquivo
            </button>
            
            {/* Input file oculto (acionado pelo botão acima) */}
            <input
              type="file"
              id="profileUpload"
              hidden
              onChange={handleFileUpload}
              accept="image/jpeg, image/png"
              aria-hidden="true"
            />
            
            {/* Informações sobre formatos suportados */}
            <p className="text-gray-400 text-center text-sm">
              Formatos suportados: JPG, PNG (máx. 5MB)
            </p>
          </div>
        </div>
      </div>
      
      {/* Lado Direito - Mensagem de Finalização */}
      <div className="w-full md:w-1/2 bg-white p-12 flex flex-col justify-between relative min-h-screen md:min-h-0">
        
        {/* Faixa SOUNDBUDDY para Mobile (fixa no topo) */}
        <div className="overflow-x-hidden block md:hidden absolute top-0 left-0 w-full bg-black py-2 text-white text-center text-lg font-bold whitespace-nowrap">
          SOUNDBUDDY • SOUNDBUDDY • SOUNDBUDDY
        </div>
        
        {/* Faixa SOUNDBUDDY para Desktop (diagonal) */}
        <div className="hidden md:block absolute top-20 -right-40 w-[500px] bg-black py-1 text-white text-xl font-bold rotate-45 overflow-hidden">
          SOUNDBUDDY • SOUNDBUDDY • SOUNDBUDDY 
        </div>
        
        {/* Mensagem de confirmação */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Parabéns!</h2>
          <p className="text-lg md:text-xl text-gray-600">
            Cadastro finalizado com sucesso
          </p>
        </div>
        
        {/* Botões de Navegação */}
        <div className="flex flex-row md:flex-row justify-between items-center md:mt-0">
          {/* Botão Voltar */}
          <button
            onClick={handlePreviousStep}
            className="md:w-auto text-black rounded-full p-3 md:p-3 hover:bg-gray-800 transition-colors mt-4 md:mt-0"
            aria-label="Voltar para o passo anterior"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          
          {/* Botão Finalizar (Submit) */}
          <button
            onClick={handleSubmit}
            className="md:w-auto bg-black text-white rounded-full p-3 md:p-3 hover:bg-gray-300 transition-colors mt-4 md:mt-0"
            aria-label="Finalizar cadastro"
            // TODO: Adicionar confirmação de envio ou feedback de carregamento
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

// TODO: Adicionar feedback visual quando o formulário for enviado com sucesso
// TODO: Implementar validação para garantir que todos os passos anteriores estejam completos
// TODO: Considerar adicionar opção para pular o upload de foto de perfil (opcional)

export default Step3;