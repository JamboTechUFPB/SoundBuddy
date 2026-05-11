'use client';
import { useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { 
  FormData, 
  validateStep1, 
  validateStep1Sync, 
  ValidationError 
} from './Validation';

interface StepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleNextStep: () => void;
}

/**
 * Componente Step1
 * 
 * Primeiro passo do formulário de cadastro multi-etapas que permite ao usuário
 * inserir informações básicas e escolher o tipo de conta desejado.
 */
const Step1 = ({ formData, setFormData, handleNextStep }: StepProps) => {
  // Estado para controlar erros e validação
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  // Array com os tipos de usuário disponíveis e suas descrições
  const userTypes = [
    {
      type: 'Artista',
      description: 'Músicos, produtores ou técnicos de som que oferecem seus serviços, exibem suas habilidades e se candidatam a oportunidades de trabalho.',
      modelName: 'musician'
    },
    {
      type: 'Both',
      description: 'Contrate músicos enquanto oferece seus próprios serviços, acessando todos os recursos de ambos os tipos de conta.',
      modelName: 'both'
    },
    {
      type: 'Contratante',
      description: 'Indivíduos ou organizações que buscam contratar músicos ou profissionais da área musical para eventos e produções.',
      modelName: 'contractor'
    }
  ];

  // Função para lidar com mudanças nos campos
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({...formData, [field]: value});
    
    // Para userType, não marcamos como tocado ao selecionar, apenas atualizamos o valor
    if (field !== 'userType') {
      // Marca o campo como tocado
      setTouched({...touched, [field]: true});
      
      // Executa validação em tempo real se o campo já foi tocado
      if (touched[field]) {
        // Validação síncrona apenas para campos locais
        const result = validateStep1Sync({...formData, [field]: value});
        
        // Filtra erros relacionados ao campo atual
        const relevantErrors = result.errors.filter(err => 
          // Para o campo atual ou campos relacionados (como confirmPassword)
          err.field === field || 
          (field === 'password' && err.field === 'confirmPassword')
        );
        
        // Atualiza os erros, mantendo os que não são relacionados ao campo atual
        const otherErrors = errors.filter(err => 
          err.field !== field && 
          !(field === 'password' && err.field === 'confirmPassword')
        );
        
        setErrors([...otherErrors, ...relevantErrors]);
      }
    }
  };

  // Função para lidar com o blur dos campos
  const handleBlur = (field: string) => {
    setTouched({...touched, [field]: true});
    
    // Validação síncrona para todos os campos
    const result = validateStep1Sync(formData);
    
    // Filtra erros relacionados ao campo que perdeu o foco
    const relevantErrors = result.errors.filter(err => 
      err.field === field || 
      (field === 'password' && err.field === 'confirmPassword')
    );
    
    // Atualiza os erros, mantendo os que não são relacionados ao campo atual
    const otherErrors = errors.filter(err => 
      err.field !== field && 
      !(field === 'password' && err.field === 'confirmPassword')
    );
    
    setErrors([...otherErrors, ...relevantErrors]);
  };

  // Função para verificar se um campo tem erro
  const getFieldError = (field: string): string | null => {
    if (!touched[field]) return null;
    const error = errors.find(err => err.field === field);
    return error ? error.message : null;
  };

  // Função para tratar a submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marca todos os campos como tocados
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Desativa o botão e mostra indicador de carregamento durante a validação
    setIsValidating(true);
    
    try {
      // Primeiro, validação síncrona básica
      const syncResult = validateStep1Sync(formData);
      
      // Se a validação básica passar, verificamos o email
      if (syncResult.isValid) {
        // Agora validamos incluindo verificação de email no backend
        const result = await validateStep1(formData, true);
        setErrors(result.errors);
        
        // Só avança se for válido
        if (result.isValid) {
          handleNextStep();
        }
      } else {
        // Se falhar na validação básica, mostramos esses erros
        setErrors(syncResult.errors);
      }
    } catch (error) {
      console.error('Erro na validação do formulário:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Lado Esquerdo - Formulário de Cadastro */}
      <div className="w-full md:w-1/2 bg-black p-12 flex flex-col md:justify-between justify-center items-center">
        <form onSubmit={handleSubmit} className="space-y-8 w-full">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Criar Conta</h1>
          
          {/* Campos de entrada para informações do usuário */}
          <div className="space-y-4 text-center">
            {/* Campo Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                className={`input_register w-full ${getFieldError('username') ? 'border-red-500' : ''}`}
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
              />
              {getFieldError('username') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('username')}</p>
              )}
            </div>

            {/* Campo Email com validação nativa + verificação de existência no submit */}
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                className={`input_register w-full ${getFieldError('email') ? 'border-red-500' : ''}`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
              {getFieldError('email') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('email')}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <input
                type="password"
                placeholder="Senha"
                className={`input_register w-full ${getFieldError('password') ? 'border-red-500' : ''}`}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
              />
              {getFieldError('password') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('password')}</p>
              )}
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <input
                type="password"
                placeholder="Confirme a Senha"
                className={`input_register w-full ${getFieldError('confirmPassword') ? 'border-red-500' : ''}`}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
              />
              {getFieldError('confirmPassword') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('confirmPassword')}</p>
              )}
            </div>
          </div>

          {/* Seleção de Tipo de Usuário */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-center text-white mb-4">Tipo de Usuário</h3>
            <div className="grid grid-cols-3 gap-2">
              {/* Mapeamento dos tipos de usuário para opções de escolha */}
              {userTypes.map((type) => (
                <label 
                  key={type.type}
                  className="flex flex-col items-center cursor-pointer"
                >
                  {/* botão em si */}
                  <div className="relative mb-2">
                    <input
                      type="radio"
                      name="userType"
                      className="hidden"
                      checked={formData.userType === type.modelName}
                      onChange={() => handleChange('userType', type.modelName)}
                    />
                    {/* Aparência visual do button */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${formData.userType === type.modelName 
                        ? 'border-white bg-white' 
                        : 'border-gray-400 hover:border-white'}`}>
                      {formData.userType === type.modelName && (
                        <div className="w-3 h-3 rounded-full bg-black"/>
                      )}
                    </div>
                  </div>
                  {/* Rótulo do tipo de usuário */}
                  <span className="text-white text-sm font-medium">{type.type}</span>
                </label>
              ))}
            </div>
            {getFieldError('userType') && (
              <p className="text-red-500 text-xs mt-2 text-center">{getFieldError('userType')}</p>
            )}
          </div>

          {/* Botão para avançar para o próximo passo */}
          <button
            type="submit"
            disabled={isValidating}
            className={`mt-6 w-full border-2 border-white rounded-full py-3 text-white 
                      hover:bg-white hover:text-black transition-colors flex items-center 
                      justify-center gap-2 text-sm ${isValidating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isValidating ? (
              <>
                Verificando...
                {/* Você pode adicionar um spinner/loader aqui */}
              </>
            ) : (
              <>
                Continuar
                <ArrowRightIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
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

export default Step1;