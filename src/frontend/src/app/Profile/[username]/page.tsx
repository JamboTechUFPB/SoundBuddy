"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import ProfileMain from '../components/perfil';
import { userService } from '@/app/services/api';
import type { ProfileData } from '../components/types';
import { HomeIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const isProfileDataComplete = (data: ProfileData): boolean => {
  return !!(
    data.username &&
    data.profileImage &&
    data.about &&
    Array.isArray(data.tags) &&
    Array.isArray(data.posts) &&
    Array.isArray(data.events) &&
    Array.isArray(data.hires) &&
    Array.isArray(data.savedItems)
  );
};

const ProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;
  const [windowWidth, setWindowWidth] = useState(0);
  
  // SOLUÇÃO PARA TESTE - Toggle manual
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [ownProfileView, setOwnProfileView] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    profileImage: '',
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
        const ownBasicInfo = await userService.getBasicInfo();

        setProfileData({
          username: data.name || username,
          profileImage: data.profileImage || 'https://i.pravatar.cc/150?img=1',
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
        
        
        // treat username replace special characters encoded by uri
        const treatedUsername = username.replace(/%20/g, ' ').replace(/%40/g, '@');
        const isOwnProfile = ownBasicInfo.name === treatedUsername;
        setIsOwnProfile(isOwnProfile);
        setProfileData(prev => ({
          ...prev,
          username: treatedUsername
        }));
        
        console.log('Basic Info:', ownBasicInfo);
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
  if (profileData.events.length === 0) {
    setProfileData(prev => ({
      ...prev,
      events: mockData.events,
      hires: mockData.hires,
      savedItems: mockData.savedItems
    }));
  }

  // Classe para ajustar o conteúdo principal quando a sidebar está presente
  const mainClass = isOwnProfile ? 
    'w-full transition-all duration-300 lg:pr-96' : 
    'w-full transition-all duration-300';

  return (
    <div className="min-h-screen bg-[#424242] md:bg-[linear-gradient(to_left,_black_10%,_#1a1a1a_20%,_#424242_100%)]">
      
      <div className='flex flex-row justify-evenly items-center px-4 fixed mt-4 z-50'>
        <button
          onClick={() => router.push('/Home')}
          className="bg-slate-900 hover:bg-gray-800 text-white flex justify-center items-center w-12 h-12 rounded-full shadow-lg transition-colors"
          aria-label="Voltar para a página inicial"
        >
          <HomeIcon className="w-7 h-7" />
        </button>

        {/* Botão flutuante para abrir a sidebar no modo mobile */}
        {isOwnProfile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`
              z-50 bg-slate-900 text-white rounded-full cursor-pointer
              w-12 h-12 fixed flex items-center justify-center transition-all duration-300
              ${isSidebarOpen ? 'right-64 opacity-100' : 'right-6 opacity-100'}
               hover:bg-gray-800 shadow-xl md:hidden
            `}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-7 h-7" />
            ) : (
              // Ícone de menu hamburguer
              <Bars3Icon className="w-7 h-7" />
            )}
          </button>
        )}

        {/* Sidebar - so exibir se for o próprio perfil */}
        {isOwnProfile && (
          <div className={`
            fixed top-0 right-0 h-full w-64 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0
          `}>
            <Sidebar
              events={profileData.events}
              hires={profileData.hires}
              savedItems={profileData.savedItems}
            />
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* Conteúdo principal ajustável */}
        <main className={mainClass}>
          <div className="container mx-auto">
            {
              loading || !isProfileDataComplete(profileData) ? (
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