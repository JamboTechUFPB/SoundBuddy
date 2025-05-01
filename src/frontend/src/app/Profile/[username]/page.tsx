"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import ProfileMain from '../components/perfil';
import { userService } from '@/app/services/api';
import type { ProfileData } from '../components/types';
import { HomeIcon } from '@heroicons/react/24/solid';

const ProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;
  const [windowWidth, setWindowWidth] = useState(0);
  
  // SOLUÇÃO PARA TESTE - Toggle manual
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    image: '',
    about: '',
    followers: 0,
    following: 0,
    tags: [],
    rating: 0,
    posts: [],
    events: [],
    hires: [],
    savedItems: []
  } as ProfileData);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Executar no carregamento inicial
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getPublicProfile(username as string);
        setProfileData({
          username: data.name || username,
          image: data.profileImage || 'https://i.pravatar.cc/150?img=1',
          about: data.about || 'Artista e compositor apaixonado por música.',
          followers: data.followers || '12345',
          following: data.following || '6789',
          tags: data.tags || [],
          rating: data.rating || '4.7',
          posts: data.posts || [],
          events: data.events || [],
          hires: data.hires || [],
          savedItems: data.savedItems || []
        });
        
        // Verificar se é o próprio perfil
        const basicInfo = await userService.getBasicInfo();
        setIsOwnProfile(basicInfo.username === username);
        console.log('Basic Info:', basicInfo);
        console.log('Profile Data:', data);
        console.log('Is Own Profile:', isOwnProfile);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadProfile();
    }
  }, [username]);

  // Dados mockados - tem que vir de uma API 
  const mockData = {
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
    followers: 2345,
    following: 1234,
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

  // seta os dados mockados restantes caso os dados da API ainda estejam []
  //if (profileData.events.length === 0) {
  //  setProfileData(prev => ({
  //    ...prev,
  //    events: mockData.events,
  //    hires: mockData.hires,
  //    savedItems: mockData.savedItems
  //  }));
  //}

  // Classe para ajustar o conteúdo principal quando a sidebar está presente
  const mainClass = isOwnProfile ? 
    'w-full transition-all duration-300 lg:pr-96' : 
    'w-full transition-all duration-300';

  return (
    <div className="min-h-screen bg-[#424242] md:bg-[linear-gradient(to_left,_black_10%,_#1a1a1a_20%,_#424242_100%)]">
      
      <button
        onClick={() => router.push('/Home')}
        className="fixed top-4 left-4 z-50 bg-black hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-colors"
        aria-label="Voltar para a página inicial"
      >
        <HomeIcon className="w-5 h-5" />
      </button>

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
            {
              loading ? (
                <div className="flex items-center justify-center h-screen">
                  <div className="loader"></div>
                </div>
              ) : (
                <ProfileMain
                userData={profileData}
                isOwnProfile={isOwnProfile}
                />
              )
            }
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;