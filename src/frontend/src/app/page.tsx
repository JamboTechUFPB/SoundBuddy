'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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


  // Se o usuário estiver autenticado, redireciona para Home
  useEffect(() => {
    // Verifica se existe um token de acesso
    const accessToken = localStorage.getItem('accessToken');

    // verifica se ainda é válido
    if (!accessToken) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        fetch('http://localhost:8000/api/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: refreshToken }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Falha ao atualizar o token');
          })
          .then((data) => {
            localStorage.setItem('accessToken', data.accessToken);
            router.push('/Home');
          })
          .catch((error) => {
            console.error('Erro ao atualizar o token:', error);
          });
      }
    }
    if (accessToken) {
      router.push('/Home');
    }
  }, [router]);
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
    <div className="min-h-screen bg-conic-180 from-zinc-900 via-gray-700 to-zinc-900 flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-zinc-900/10 backdrop-blur-2xl" />

      {/* Container do conteúdo - centralizado e com espaçamento vertical */}
      <div className="text-center space-y-6 md:space-y-8 max-w-4xl w-full z-10">
        {/* Seção de título e tagline */}
        <div className="space-y-3 md:space-y-4">
          {/* Título principal da aplicação */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-200">
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
            className="bg-zinc-700/50 border-2 border-white/50 text-white w-full md:w-auto px-6 py-3 md:px-8 md:py-4 rounded-full
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
            className="bg-zinc-700/50 border-2 border-white/50 text-white w-full md:w-auto px-6 py-3 md:px-8 md:py-4 rounded-full
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
