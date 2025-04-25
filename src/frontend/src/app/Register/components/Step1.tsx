'use client';
import { FormData, StepProps } from './types';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

/**
 * Componente Step1
 * 
 * Primeiro passo do formulário de cadastro multi-etapas que permite ao usuário
 * inserir informações básicas e escolher o tipo de conta desejado.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {FormData} props.formData - Estado atual do formulário
 * @param {Function} props.setFormData - Função para atualizar o estado do formulário
 * @param {Function} props.handleNextStep - Função para avançar para o próximo passo
 */
const Step1 = ({ formData, setFormData, handleNextStep }: StepProps) => {
  // Array com os tipos de usuário disponíveis e suas descrições
  const userTypes = [
    {
      type: 'Artista',
      description: 'Músicos, produtores ou técnicos de som que oferecem seus serviços, exibem suas habilidades e se candidatam a oportunidades de trabalho.'
    },
    {
      type: 'Both',
      description: 'Contrate músicos enquanto oferece seus próprios serviços, acessando todos os recursos de ambos os tipos de conta.'
    },
    {
      type: 'Contratante',
      description: 'Indivíduos ou organizações que buscam contratar músicos ou profissionais da área musical para eventos e produções.',
      modelName: 'contractor'
    }
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Lado Esquerdo - Formulário de Cadastro */}
      <div className="w-full md:w-1/2 bg-black p-12 flex flex-col justify-between items-center">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Criar Conta</h1>
          
          {/* Campos de entrada para informações do usuário */}
          <div className="space-y-4">
            {/* Campo Username */}
            <input
              type="text"
              placeholder="Username"
              className="input_register"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              // TODO: Adicionar validação para username único
            />

            {/* Campo Email */}
            <input
              type="email"
              placeholder="Email"
              className="input_register"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              // TODO: Adicionar validação de formato de email
            />

            {/* Campo Senha */}
            <input
              type="password"
              placeholder="Senha"
              className="input_register"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              // TODO: Adicionar indicador de força de senha
            />

            {/* Campo Confirmar Senha */}
            <input
              type="password"
              placeholder="Confirme a Senha"
              className="input_register"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              // TODO: Adicionar validação para comparar com o campo de senha
            />
          </div>

          {/* Seleção de Tipo de Usuário */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-center text-white mb-4">Tipo de Usuário</h3>
            <div className="grid grid-cols-3 gap-2">
              {/* Mapeamento dos tipos de usuário para opções de radio button */}
              {userTypes.map((type) => (
                <label 
                  key={type.type}
                  className="flex flex-col items-center cursor-pointer"
                >
                  {/* Radio Button customizado */}
                  <div className="relative mb-2">
                    <input
                      type="radio"
                      name="userType"
                      className="hidden"
                      checked={formData.userType === type.type}
                      onChange={() => setFormData({...formData, userType: type.type})}
                    />
                    {/* Aparência visual do radio button */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${formData.userType === type.type 
                        ? 'border-white bg-white' 
                        : 'border-gray-400 hover:border-white'}`}>
                      {formData.userType === type.type && (
                        <div className="w-3 h-3 rounded-full bg-black"/>
                      )}
                    </div>
                  </div>
                  {/* Rótulo do tipo de usuário */}
                  <span className="text-white text-sm font-medium">{type.type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botão para avançar para o próximo passo */}
        <button
          onClick={handleNextStep}
          className="mt-6 w-full border-2 border-white rounded-full py-3 text-white 
                   hover:bg-white hover:text-black transition-colors flex items-center 
                   justify-center gap-2 text-sm"
          // TODO: Desabilitar o botão se campos obrigatórios não estiverem preenchidos
        >
          Continuar
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Lado Direito - Painel Informativo (visível apenas em telas médias e maiores) */}
      <div className="hidden md:flex w-1/2 bg-white p-12 flex-col justify-center items-center">
        <div className="max-w-md space-y-8 w-full"> 
          <h2 className="text-2xl font-bold text-black mb-6">Escolha seu Perfil</h2>
          
          {/* Descrições detalhadas de cada tipo de usuário */}
          {userTypes.map((type) => (
            <div key={type.type} className="space-y-1 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{type.type}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {type.description}
              </p>
            </div>
          ))}

          {/* Nota informativa */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              * Configurações podem ser alteradas posteriormente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// TODO: Implementar validação de formulário antes de permitir avançar
// TODO: Adicionar indicadores visuais para campos obrigatórios
// TODO: Considerar adicionar suporte para autenticação social (Google, Facebook, etc.)

export default Step1;