'use client'; // Diretiva do Next.js indicando que este é um componente cliente

import { useRouter } from 'next/navigation'; // Importando o hook de roteamento do Next.js
import { useState } from 'react'; // Importação do useState para gerenciar o estado do formulário

/**
 * Componente de Login da aplicação SoundBuddy
 * Renderiza o formulário de login e lida com a navegação após autenticação
 * Inclui também funcionalidade para recuperação de senha
 */
export default function Login() {
  // Hook para navegação entre páginas
  const router = useRouter();
  
  // Estados para controlar inputs e modal de recuperação de senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecoverySubmitted, setIsRecoverySubmitted] = useState(false);
  
  // Estados para controle de erro de autenticação
  const [authError, setAuthError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Função para lidar com mudanças nos campos
  const handleChange = (field: string, value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
    
    // Marca o campo como tocado
    setTouched({...touched, [field]: true});
    
    // Limpa mensagem de erro de autenticação quando o usuário começa a digitar novamente
    if (authError) {
      setAuthError('');
    }
  };
  
  // Função para lidar com o blur dos campos
  const handleBlur = (field: string) => {
    setTouched({...touched, [field]: true});
  };
  
  /**
   * IMPLEMENTAÇÃO REAL COMENTADA
   * Lida com o envio do formulário de login fazendo uma chamada à API
   * @param {React.FormEvent} e - Evento de formulário
   */
  {/*const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Login submitted:', { email, password });
    
    // Marca todos os campos como tocados para validação
    setTouched({
      email: true,
      password: true
    });
    
    // Verifica se os campos necessários estão preenchidos
    if (!email || !password) {
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        setAuthError('Email ou senha incorretos. Por favor, tente novamente.');
        return;
      }
  
      const data = await response.json();
      
      // Salva tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
  
      // Redireciona
      router.push('/Home');
  
    } catch (error) {
      setAuthError('Erro ao fazer login. Verifique sua conexão e tente novamente.');
      console.error(error);
    }
  };*/}

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marca todos os campos como tocados
    setTouched({
      email: true,
      password: true
    });
    
    // SIMULAÇÃO DE ENTRADA COLOCAR TEST@EXAMPLE.COM 
    // substituir pela logica real de autenticação
    if (email === 'test@example.com') {
      setAuthError('Email ou senha incorretos. Por favor, tente novamente.');
      return;
    }
    
    // TODO: Implementar autenticação real com API/backend
    // TODO: Adicionar tratamento de erros de autenticação
    // TODO: Implementar armazenamento de token de sessão
    
    // Navega para a página inicial após "login" bem-sucedido
    router.push('/Home');
  };
  
  /**
   * Lida com o envio do formulário de recuperação de senha
   * @param {React.FormEvent} e - Evento de formulário
   */
  const handlePasswordRecovery = (e) => {
    e.preventDefault();
    
    // TODO: Implementar chamada API real para solicitar redefinição de senha
    // TODO: Adicionar validação de e-mail antes de enviar
    // TODO: Adicionar feedback visual durante o processo de envio (loading)
    
    // Simula o envio bem-sucedido
    setIsRecoverySubmitted(true);
    
    // TODO: Após implementação real, resetar o modal após alguns segundos
    setTimeout(() => {
      setShowForgotPassword(false);
      setIsRecoverySubmitted(false);
      setRecoveryEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black md:bg-gray-100 p-4">
      {/* Título SoundBuddy */}
      <h1 className="text-3xl md:text-5xl font-bold text-white md:text-black mb-6 md:mb-10">
        SoundBuddy
      </h1>
      
      {/* Container do Login */}
      <div className="w-full md:w-100 p-6 bg-black shadow-lg rounded-xl md:rounded-3xl">
        <h2 className="text-xl md:text-2xl text-white font-bold mb-4 text-center">
          Login
        </h2>
        
        {/* Mensagem de erro de autenticação */}
        {authError && (
          <div className="mb-4 p-3 border border-red-500 bg-red-500/10 text-red-500 rounded-lg text-sm">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              className={`input_register w-full md:w-auto ${touched.email && !email ? 'border-red-500' : ''}`}
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              required
            />
            {touched.email && !email && (
              <p className="text-center text-red-500 text-xs mt-1">Email é obrigatório</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-white mb-2">Senha</label>
            <input
              type="password"
              className={`input_register w-full md:w-auto ${touched.password && !password ? 'border-red-500' : ''}`}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              required
            />
            {touched.password && !password && (
              <p className="text-center text-red-500 text-xs mt-1">Senha é obrigatória</p>
            )}
            {/* TODO: Adicionar toggle para mostrar/esconder senha */}
          </div>
          
          {/* Link de "Esqueci minha senha" */}
          <div className="mb-6 text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 border-2 border-white text-white p-2 rounded-full
                      hover:bg-white hover:text-black transition-colors duration-300
                      font-semibold text-sm md:text-base"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
      
      {/* Texto abaixo do card */}
      <p className="mt-6 md:mt-8 text-lg md:text-xl text-white md:text-gray-700 font-medium">
        IT'S ALL ABOUT MUSIC
      </p>
      
      {/* Modal de Recuperação de Senha */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4">
          <div className="bg-black p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl text-white font-bold mb-4">
              {isRecoverySubmitted ? 'Email Enviado' : 'Recuperar Senha'}
            </h3>
            
            {isRecoverySubmitted ? (
              <div className="text-center py-4">
                <p className="text-green-400 mb-4">
                  Enviamos um email com instruções para recuperar sua senha.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setIsRecoverySubmitted(false);
                    setRecoveryEmail('');
                  }}
                  className="text-white border-2 border-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordRecovery}>
                <p className="text-gray-300 mb-4">
                  Digite seu email para receber um link de recuperação de senha.
                </p>
                <div className="mb-4">
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="input_register w-full"
                    placeholder="Seu email"
                    required
                  />
                  {/* TODO: Verificar se o email existe no sistema antes de enviar */}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 py-2 border border-white text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-white text-black rounded-full hover:bg-green-200 transition-colors"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}