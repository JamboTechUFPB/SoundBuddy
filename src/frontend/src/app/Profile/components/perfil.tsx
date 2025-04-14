/**
 * Componente principal do perfil de usuário
 * Exibe informações do perfil, botões de interação e publicações do usuário
 * 
 * @param {Object} userData - Dados do usuário a ser exibido
 * @param {boolean} isOwnProfile - Indica se é o perfil do usuário logado
 */
const ProfileMain = ({ userData, isOwnProfile }) => {
  
  if (!userData) {
    return <div className="p-4 text-center">Carregando perfil...</div>;
  }

  // TODO: Implementar função de edição de perfil quando botão for clicado
  // TODO: Implementar função de seguir/deixar de seguir quando botão for clicado

  return (
    <div className="overflow-y-auto space-y-6 max-w-4xl mx-auto pb-16">
      {/* Seção Superior - Perfil */}
      <div className="bg-black text-white rounded-b-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Foto de Perfil */}
          <div className="relative">
   
            <img
              src={userData.image}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />

          </div>

          {/* Informações do Usuário */}
          <div className="text-center lg:text-left flex-1 relative">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start w-full">
              <div>
                <h1 className="text-3xl font-bold mb-2">@{userData.username}</h1>
                
                <div className="flex justify-center lg:justify-start gap-8">
                  {/* TODO: Adicionar modal para mostrar lista de seguidores quando clicado */}
                  <div className="text-center">
                    <span className="block text-xl font-bold">{userData.followers}</span>
                    <span className="text-gray-400">Seguidores</span>
                  </div>
                  {/* TODO: Adicionar modal para mostrar lista de seguindo quando clicado */}
                  <div className="text-center">
                    <span className="block text-xl font-bold">{userData.following}</span>
                    <span className="text-gray-400">Seguindo</span>
                  </div>
                </div>
              </div>
              
              {/* Botões posicionados à direita */}
              <div className="mt-4 lg:mt-12 lg:ml-auto">
                {isOwnProfile ? (
                  // TODO: Implementar modal ou página de edição de perfil
                  <button className="px-4 py-2 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors">
                    Editar perfil
                  </button>
                ) : (
                  // TODO: Adicionar estado de loading ao botão durante a requisição
                  // TODO: Implementar lógica de seguir/deixar de seguir com chamada à API
                  <button className="px-4 py-2 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors">
                    {userData.isFollowing ? 'Deixar de seguir' : 'Seguir'}
                  </button>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Sobre */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sobre</h2>
        {/* TODO: Adicionar edição inline da bio para o próprio perfil */}
        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
          {userData.bio || 'Nenhuma informação disponível.'}
          
        </p>
      </div>

      {/* Seção de Posts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Publicações</h3>
        {/* TODO: Adicionar sistema de filtro/categorização de publicações */}
       
        <div className="space-y-6">
          {userData.posts && userData.posts.length > 0 ? (
            userData.posts.map((post) => (
              <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <img 
                    src={post.authorImage || userData.image} 
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Autor"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-800">{post.author}</span>
                      <span className="text-gray-400 text-sm">{post.date}</span>
                      {/* TODO: Adicionar menu de opções para editar/excluir post se for o autor */}
                    </div>
                    <p className="text-gray-600 mb-3">{post.content}</p>
                    {post.media && (
                      <div className="bg-gray-100 rounded-lg p-2">
                        {/* TODO: Implementar exibição real da mídia (imagem, vídeo, áudio) */}
                        <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-500">Mídia</span>
                        </div>
                      </div>
                    )}
                    {/* TODO: Adicionar botões de interação  */}
                   
              
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Nenhuma publicação encontrada</p>
          )}
        </div>
      </div>
   
    </div>
  );
};

export default ProfileMain;