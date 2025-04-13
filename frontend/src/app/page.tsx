'use client';
import { useRouter } from 'next/navigation';

/**
 * Componente Landing
 * 
 * Página inicial da aplicação Soundbuddy que apresenta aos usuários as opções
 * de fazer login ou criar uma nova conta. Esta é a primeira tela que os usuários
 * visualizam ao acessar a aplicação.
 * 
 * @returns {JSX.Element} O componente renderizado da página landing
 */
export default function Landing() {
  // Inicializa o hook de navegação do Next.js para permitir redirecionamentos
  const router = useRouter();

  /**
   * Redireciona o usuário para a página de login
   */
  const handleLogin = () => {
    router.push('/Login');
  };

  /**
   * Redireciona o usuário para a página de registro
   */
  const handleRegister = () => {
    router.push('/Register');
  };

  return (
    // Container principal - ocupa toda a altura da tela com fundo escuro
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Container do conteúdo - centralizado e com espaçamento vertical */}
      <div className="text-center space-y-6 md:space-y-8 max-w-4xl w-full">
        {/* Seção de título e tagline */}
        <div className="space-y-3 md:space-y-4">
          {/* Título principal da aplicação */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            Soundbuddy
          </h1>
          {/* Slogan da aplicação */}
          <p className="text-gray-400 text-base md:text-xl px-4">
            Encontre seu som
          </p>
        </div>

        {/* Seção de botões de ação */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-center items-center w-full px-4">
          {/* Botão de Login - mais destacado/principal */}
          <button
            onClick={handleLogin}
            className="bg-black text-white w-full md:w-auto px-6 py-3 md:px-8 md:py-4 rounded-full
                     hover:bg-gray-800 transition-all duration-300
                     transform hover:scale-105 shadow-xl
                     font-semibold text-base sm:text-lg"
            aria-label="Fazer login na plataforma"
          >
            Fazer Login
          </button>
          
          {/* Botão de Registro - secundário */}
          <button
            onClick={handleRegister}
            className="bg-gray-800 text-white w-full md:w-auto px-6 py-3 md:px-8 md:py-4 rounded-full
                     hover:bg-gray-700 transition-all duration-300
                     transform hover:scale-105 shadow-xl
                     font-semibold text-base sm:text-lg"
            aria-label="Criar nova conta na plataforma"
          >
            Criar Conta
          </button>
        </div>
      </div>
    </div>
  );
}

// TODO: Considerar adicionar animações de entrada 
