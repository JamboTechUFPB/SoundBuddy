"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import ProfileMain from './components/perfil';

const ProfilePage = () => {
  const { username } = useParams();
  const [windowWidth, setWindowWidth] = useState(0);
  
  // SOLUÇÃO PARA TESTE - Toggle manual
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Executar no carregamento inicial
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dados mockados - tem que vir de uma API 
  const profileData = {
    username: username || 'usuário',
    image: 'https://i.pravatar.cc/150?img=8',
    bio: `Músico profissional com 15 anos de experiência em diversos gêneros musicais. 
    
    Especializações:
    - Jazz e Bossa Nova
    - Produção musical
    - Composição para cinema
    - Direção de bandas
    
    Prêmios:
    🏆 Melhor Álbum Independente 2022
    🥇 Festival de Música de Curitiba 2021`,
    followers: '2.345',
    following: '1.234',
    posts: [
      {
        id: 1,
        author: '@' + (username || 'usuário'),
        content: 'Gravando novo álbum em estúdio profissional esta semana! 🎧 Querem preview?',
        date: '15/04/2024',
        media: true,
      },
      {
        id: 2,
        author: '@' + (username || 'usuário'),
        content: 'Novo single disponível em todas as plataformas! Link na bio 🔗',
        date: '12/04/2024',
        media: false,
      },
      {
        id: 3,
        author: '@' + (username || 'usuário'),
        content: 'Novo single disponível em todas as plataformas! Link na bio 🔗',
        date: '12/04/2024',
        media: false,
      },
      {
        id: 4,
        author: '@' + (username || 'usuário'),
        content: 'Novo single disponível em todas as plataformas! Link na bio 🔗',
        date: '12/04/2024',
        media: false,
      },
    ],
    events: [
      {
        name: 'Festival de Jazz',
        date: '2024-05-25',
        local: 'Teatro Municipal - SP'
      },
      {
        name: 'Workshop Musical',
        date: '2024-06-02',
        local: 'Centro Cultural - RJ'
      },
      {
        name: 'Show Acústico',
        date: '2024-06-15',
        local: 'Casa de Show - BH'
      }
    ],
    hires: [
      { profileImage: 'https://i.pravatar.cc/150?img=10' },
      { profileImage: 'https://i.pravatar.cc/150?img=11' },
      { profileImage: 'https://i.pravatar.cc/150?img=12' },
      { profileImage: 'https://i.pravatar.cc/150?img=13' },
      { profileImage: 'https://i.pravatar.cc/150?img=14' },
      { profileImage: 'https://i.pravatar.cc/150?img=15' }
    ],
    savedItems: [
      {
        title: 'Dicas de Mixagem',
        content: 'Guia completo com técnicas profissionais para mixagem ao vivo...'
      },
      {
        title: 'Contrato Modelo',
        content: 'Modelo de contrato para shows e apresentações com cláusulas importantes...'
      },
      {
        title: 'Checklist Turnê',
        content: 'Lista essencial de equipamentos e documentos para turnês nacionais...'
      }
    ]
  };

  // Classe para ajustar o conteúdo principal quando a sidebar está presente
  const mainClass = isOwnProfile ? 
    'w-full transition-all duration-300 lg:pr-96' : 
    'w-full transition-all duration-300';

  return (
    <div className="min-h-screen bg-[#424242] md:bg-[linear-gradient(to_left,_black_10%,_#1a1a1a_20%,_#424242_100%)]">
      
      {/* Botão de teste para alternar entre perfil próprio e de outro usuário */}
      <button
        onClick={() => setIsOwnProfile(!isOwnProfile)}
        className="fixed top-4 left-4 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg transition-colors"
      >
        {isOwnProfile ? "Visualizar como outro usuário" : "Visualizar meu perfil"}
      </button>
      
      <div className="relative">
        {/* Sidebar - so exibir se for o próprio perfil */}
        {isOwnProfile && (
          <Sidebar
            events={profileData.events}
            hires={profileData.hires}
            savedItems={profileData.savedItems}
          />
        )}
        
        {/* Conteúdo principal ajustável */}
        <main className={mainClass}>
          <div className="container mx-auto">
            <ProfileMain userData={profileData} isOwnProfile={isOwnProfile}/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;