import { useState, useRef } from 'react';
import SeguidoresModal from '@/app/components/SeguidoresModal';
import { EllipsisHorizontalIcon, TrashIcon, XMarkIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

const ProfileMain = ({ userData, isOwnProfile }) => {
  // Lista de tags predefinidas disponíveis para seleção
  const tags = ['Jazz', 'Rock', 'Pop', 'Eletrônica', 'Clássica', 'MPB', 'tag1', 'tag2', 'tag3', 'tag4' ];

  // Estado para controlar a exibição do modal
  const [showModal, setShowModal] = useState(false);
  // Estado para definir o tipo de lista a ser exibida no modal (seguidores ou seguindo)
  const [modalType, setModalType] = useState('');
  // Estado para controlar o processo de follow/unfollow
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing);
  // Estado para indicar loading durante as requisições
  const [isLoading, setIsLoading] = useState(false);
  // Estado para edição do perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // Estado para edição da about
  const [about, setAbout] = useState(userData.about);
  // Estado para armazenar os posts localmente (para permitir exclusão local)
  const [posts, setPosts] = useState(userData.posts);
  // Estado para tags do usuário
  const [selectedTags, setSelectedTags] = useState(userData.tags);

  // Estado para mensagem de erro das tags
  const [tagError, setTagError] = useState('');
  // Ref para input de arquivo da foto de perfil
  const fileInputRef = useRef(null);
  // Estado para preview da nova foto de perfil
  const [imagePreview, setImagePreview] = useState(null);

  const [enlargedImage, setEnlargedImage] = useState(null);
  const [enlargedVideo, setEnlargedVideo] = useState(null);

  
  if (!userData) {
    return <div className="p-4 text-center">Carregando perfil...</div>;
  }

  const renderMedia = (media: Media) => {
    if (!media) return null;
    if (!media.type) return null;

    switch (media.type) {
      case 'image':
        return (
          <div className="mt-3 mb-10 flex justify-center">
            <div 
              className="relative rounded-lg overflow-hidden cursor-pointer max-w-md"
              onClick={() => setEnlargedImage(media.url)}
            >
              <img
                src={media.url}
                alt="Imagem do post"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="mt-3 mb-10 flex justify-center">
            <div className="relative rounded-lg overflow-hidden max-w-md">
              <video 
                src={media.url}
                className="w-full h-full rounded-lg"
                controls
                onClick={(e) => {
                  // Previne que o clique no vídeo abra o modal se estiver clicando nos controles
                  if (e.target === e.currentTarget) {
                    setEnlargedVideo(media.url);
                  }
                }}
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
              <div 
                className="absolute cursor-pointer"
                onClick={() => setEnlargedVideo(media.url)}
              ></div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="mt-3 mb-10 bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <MusicalNoteIcon className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {media.name || "Áudio"}
              </span>
            </div>
            <audio 
              controls 
              className="w-full"
              src={media.url}
            >
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Função para abrir o modal com o tipo especificado
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Função para iniciar edição do perfil
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setAbout(userData.about || '');
    setSelectedTags(userData.tags || ['Jazz', 'Rock', 'Pop', 'Eletrônica']);
    setImagePreview(null);
    setTagError('');
  };

  // Função para validar as tags
  const validateTags = () => {
    if (selectedTags.length < 3) {
      setTagError('Você precisa ter no mínimo 3 tags');
      return false;
    }
    if (selectedTags.length > 6) {
      setTagError('Você pode ter no máximo 6 tags');
      return false;
    }
    setTagError('');
    return true;
  };

  // Função para alternar a seleção de uma tag
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      // Se já está selecionada e não vai ficar com menos do que o mínimo, remove
      if (selectedTags.length > 3) {
        setSelectedTags(selectedTags.filter(t => t !== tag));
      } else {
        setTagError('Você precisa ter no mínimo 3 tags');
      }
    } else {
      // Se não está selecionada e não vai exceder o máximo, adiciona
      if (selectedTags.length < 6) {
        setSelectedTags([...selectedTags, tag]);
        setTagError('');
      } else {
        setTagError('Você pode ter no máximo 6 tags');
      }
    }
  };

  // Função para salvar alterações do perfil
  const handleSaveProfile = async () => {
    // Validar as tags antes de salvar
    if (!validateTags()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simular uma requisição bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Atualizar os dados localmente
      userData.about = about;
      userData.tags = selectedTags;
      
      // Se houver uma nova imagem, atualizá-la
      if (imagePreview) {
        userData.image = imagePreview;
      }
      
      // Finalizar edição
      setIsEditingProfile(false);
      
      /* 
      // Implementação real com backend
      const formData = new FormData();
      formData.append('about', about);
      formData.append('tags', JSON.stringify(selectedTags));
      
      if (fileInputRef.current.files[0]) {
        formData.append('profileImage', fileInputRef.current.files[0]);
      }
      
      const response = await fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Falha ao atualizar perfil');
      
      const updatedUser = await response.json();
      // Atualizar o estado global ou revalidar a página
      */
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      // Mostrar uma notificação de erro
    } finally {
      setIsLoading(false);
    }
  };

  // Função para cancelar edição do perfil
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setImagePreview(null);
    setTagError('');
  };

  // Função para lidar com a alteração da foto de perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para seguir/deixar de seguir usuário
  const handleFollowToggle = async () => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualizar estado localmente
      setIsFollowing(!isFollowing);
      
      // Atualizar contagem de seguidores
      userData.followers = isFollowing 
        ? Math.max(0, userData.followers - 1) 
        : userData.followers + 1;
      
      /* 
      // Implementação real
      const endpoint = `/api/users/${userData.id}/${isFollowing ? 'unfollow' : 'follow'}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Falha na operação');
      
      const data = await response.json();
      // Atualizar estado global ou revalidar
      */
    } catch (error) {
      // Reverter mudanças locais em caso de erro
      setIsFollowing(isFollowing);
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para excluir post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta publicação?')) {
      return;
    }
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remover post localmente
      setPosts(posts.filter(post => post.id !== postId));
      
      /* 
      // Implementação real
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Falha ao excluir publicação');
      
      // Atualizar estado global ou revalidar
      */
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      // Mostrar notificação de erro
    }
  };

  return (
    <div className="overflow-y-auto space-y-6 max-w-4xl mx-auto pb-16">
      {/* Seção Superior - Perfil */}
      <div className="bg-black text-white rounded-b-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Foto de Perfil */}
          <div className="relative">
            {isEditingProfile ? (
              <div className="relative">
                <img
                  src={imagePreview || userData.profileImage}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
                />
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <span className="text-white text-sm font-medium">Alterar foto</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            ) : (
              <img
                src={userData.image}
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
              />
            )}
          </div>

          {/* Informações do Usuário */}
          <div className="text-center lg:text-left flex-1 relative">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start w-full">
              <div>
                <h1 className="text-3xl font-bold mb-2">@{userData.username}</h1>
                
                <div className="flex justify-center lg:justify-start gap-8">
                  {/* Modal de seguidores será aberto ao clicar */}
                  <div 
                    className="text-center cursor-pointer hover:opacity-80"
                    onClick={() => openModal('seguidores')}
                  >
                    <span className="block text-xl font-bold">{userData.followers}</span>
                    <span className="text-gray-400">Seguidores</span>
                  </div>
                  {/* Modal de seguindo será aberto ao clicar */}
                  <div 
                    className="text-center cursor-pointer hover:opacity-80"
                    onClick={() => openModal('seguindo')}
                  >
                    <span className="block text-xl font-bold">{userData.following}</span>
                    <span className="text-gray-400">Seguindo</span>
                  </div>
                </div>
              </div>
              
              {/* Botões posicionados à direita */}
              <div className="mt-4 lg:mt-0 lg:ml-auto">
                {isOwnProfile ? (
                  isEditingProfile ? (
                    <div className="flex gap-2">
                      <button 
                        className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button 
                        className="px-4 py-2 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="px-4 py-2 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors"
                      onClick={handleEditProfile}
                    >
                      Editar perfil
                    </button>
                  )
                ) : (
                  <button 
                    className={`px-4 py-2 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors ${isLoading ? 'opacity-70' : ''}`}
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processando...' : isFollowing ? 'Deixar de seguir' : 'Seguir'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Tags */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {isEditingProfile && isOwnProfile ? (
          <>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`border-2 ${selectedTags.includes(tag) ? 'bg-white text-black' : 'border-white text-white'} 
                           px-3 py-1 rounded-full hover:opacity-80 transition-colors bg-transparent`}
              >
                #{tag}
              </button>
            ))}
            {tagError && (
              <div className="w-full text-center mt-2 text-red-500">
                {tagError}
              </div>
            )}
          </>
        ) : (
          selectedTags.map((tag) => (
            <div
              key={tag}
              className="border-2 border-white text-white px-3 py-1 rounded-full"
            >
              #{tag}
            </div>
          ))
        )}
      </div>

      {/* Seção Sobre */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sobre</h2>
        {isEditingProfile && isOwnProfile ? (
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-y-auto whitespace-pre-wrap break-words min-h-[8rem]"
            placeholder="Escreva algo sobre você..."
          />
        ) : (
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {userData.about || 'Nenhuma informação disponível.'}
          </p>
        )}
      </div>

      {/* Seção de Posts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Publicações</h3>
        
        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <img 
                    src={post.user.profileImage || userData.profileImage} 
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Autor"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800">{post.user.name}</span>
                        <span className="text-gray-400 text-sm">{post.createdAt}</span>
                      </div>
                      
                      {/* Opções de post para o próprio usuário - Apenas excluir */}
                      {isOwnProfile && (
                        <div className="relative group">
                          <button className="text-gray-500 hover:text-gray-700 p-1">
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </button>
                          
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                              <button 
                                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Excluir publicação
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{post.content}</p>
                    
                    {post.media && renderMedia(post.media)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Nenhuma publicação encontrada</p>
          )}
        </div>
      </div>
   
      {/* Modal de Seguidores/Seguindo */}
      <SeguidoresModal
        show={showModal}
        onClose={closeModal}
        type={modalType}
        userId={userData.id}
        username={userData.username}
      />

      {/* Modais de visualização de mídia */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={enlargedImage} 
              alt="Imagem ampliada" 
              className="max-w-full max-h-full object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              onClick={() => setEnlargedImage(null)}
            >
              X
            </button>
          </div>
        </div>
      )}

      {enlargedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setEnlargedVideo(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <video 
              src={enlargedVideo} 
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
            <button 
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              onClick={() => setEnlargedVideo(null)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMain;