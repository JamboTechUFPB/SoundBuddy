import { useState, useRef, useEffect } from 'react'; 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline' ; 

/**
 * Componente Header com barra de pesquisa e sugestões dinâmicas
 * Este componente implementa uma barra de busca com sugestões que são filtradas
 * conforme o usuário digita, incluindo tags populares e perfis.
 */
const Header = () => {

  // Estado para armazenar o texto digitado na barra de pesquisa
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para controlar a visibilidade do painel de sugestões
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Estado para armazenar as sugestões filtradas baseadas no input do usuário
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
  // usado para detectar cliques fora da search bar
  const searchRef = useRef(null);

 
  // Lista de tags populares para sugestões
  // TODO: TEM QUE VIR DE UMA API
  const popularTags = [
    'rock', 'pop', 'jazz', 'blues', 'reggae', 'hiphop',
    'lofi', 'synthwave', 'metal', 'folk', 'indie', 'eletrônica',
    'acústico', 'R&B', 'trap', 'samba', 'bossa nova', 'kpop'
  ];

  // Lista de perfiss para sugestões
  // TODO: API profiles
  const suggestedProfiles = [
    'Taylor Swift', 'The Beatles', 'Billie Eilish', 'Bob Marley',
    'David Bowie', 'Dua Lipa', 'Ed Sheeran', 'Elton John',
    'Beyoncé', 'Queen', 'Michael Jackson', 'Pink Floyd'
  ];

 
  /**
   * Efeito para detectar cliques fora da barra de pesquisa e fechar as sugestões
   * É executado apenas uma vez na montagem do componente, mas o handler é atualizado
   * sempre que searchRef muda (o que não deve acontecer frequentemente)
   */
  useEffect(() => {
    // Função para detectar cliques fora do componente de pesquisa
    const handleClickOutside = (event) => {
      // Se o clique foi fora do elemento referenciado, fecha as sugestões
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    // Adiciona o listener de eventos para detectar cliques em qualquer lugar do documento
    document.addEventListener('mousedown', handleClickOutside);
    
    // Função de limpeza que remove o event listener quando o componente é desmontado
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Efeito para filtrar sugestões quando o termo de busca muda
   * Este efeito é executado toda vez que searchQuery é atualizado
   */
  useEffect(() => {
    // Se a busca estiver vazia, limpa as sugestões e não faz nada
    if (searchQuery.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }

    // Converte a consulta para minúsculas para comparação sem case-sensitivity
    const query = searchQuery.toLowerCase();
    
    // Filtra as tags que incluem o termo de busca (limita a 5 resultados)
    // TODO: Implementar algoritmo de relevância mais sofisticado talvez
    const matchingTags = popularTags
      .filter(tag => tag.toLowerCase().includes(query))
      .slice(0, 5); // Limita a 5 tags
      
    // Filtra os perfiss que incluem o termo de busca (limita a 3 resultados)
    const matchingProfiles = suggestedProfiles
      .filter(profile => profile.toLowerCase().includes(query))
      .slice(0, 3); // Limita a 3 perfis
    
    // Combina os resultados filtrados em um único array com tipo diferenciado
    // Isso permite identificar se é uma tag ou perfis ao exibir
    setFilteredSuggestions([
      ...matchingTags.map(tag => ({ type: 'tag', value: tag })),
      ...matchingProfiles.map(profile => ({ type: 'profile', value: profile }))
    ]);
    
    // TODO: Adicionar debounce para evitar muitas atualizações em digitação rápida
  }, [searchQuery]);


  /**
   * Manipula mudanças no input de pesquisa
   * Atualiza o estado do texto de busca e mostra o painel de sugestões
   */
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  /**
   * Manipula cliques em uma sugestão filtrada
   * Define o termo de busca como o valor da sugestão e fecha o painel
   */
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    // TODO: Implementar lógica para executar a busca ou navegar para os resultados
  };

  /**
   * Manipula cliques em uma tag popular
   * Define o termo de busca como a tag selecionada e fecha o painel
   */
  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setShowSuggestions(false);
    // TODO: Implementar lógica para executar a busca por tag 
  };

  // ========== RENDERIZAÇÃO ==========
  return (
    <header className="fixed top-0 w-full z-50 h-16">
      {/* Container principal do header */}
      <div className="mx-auto h-full px-4">
        {/* Container do conteúdo centralizado com referência para detecção de cliques */}
        <div className="relative flex items-center justify-center h-full" ref={searchRef}>
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 hidden md:block">
            <h1 className="text-2xl font-bold text-white/80">Soundbuddy</h1>
          </div>
          {/* Container da barra de pesquisa com largura responsiva */}
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl transition-all duration-300">
            {/* Barra de pesquisa com estilo arredondado e hover */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 transition-colors hover:bg-gray-200">
              {/* Ícone de lupa */}
              <MagnifyingGlassIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mr-2" />
              
              {/* Input da pesquisa */}
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)} // Mostra sugestões ao focar no input
                placeholder="Pesquisar..."
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm md:text-base"
               
              />
            </div>

            {/* Container de Sugestões - Aparece apenas quando showSuggestions é true */}
            {showSuggestions && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-md md:max-w-lg lg:max-w-xl mt-1 bg-white rounded-xl shadow-lg p-3">
                {/* Seção de Tags Populares - Sempre visível quando o painel abre */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Tags Populares</p>
                  
                  {/* Lista de tags com scroll horizontal */}
                  <div className="flex space-x-1 overflow-x-auto pb-2">
                    {/* Renderiza apenas as primeiras 8 tags para não sobrecarregar a interface */}
                    {popularTags.slice(0, 8).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs md:text-sm transition-colors whitespace-nowrap flex-shrink-0"
                      >
                        #{tag} {/* Prefixo # para indicar que é uma tag */}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seção de Sugestões de Busca - Aparece apenas se houver sugestões filtradas */}
                {filteredSuggestions.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Sugestões de Busca</p>
                    
                    {/* Lista de sugestões em formato vertical */}
                    <div className="flex flex-col space-y-2">
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                          {/* Ícone de lupa para indicar que é uma sugestão de busca */}
                          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-2" />
                          
                          {/* Texto da sugestão com # para tags */}
                          <span className="text-sm">
                            {suggestion.type === 'tag' ? '#' : ''}{suggestion.value}
                            {/* TODO: Destacar a parte do texto que corresponde à busca */}
                          </span>
                          
                          {/* Indicador do tipo de sugestão (Tag ou perfis) */}
                          <span className="ml-auto text-xs text-gray-400">
                            {suggestion.type === 'tag' ? 'Tag' : 'Profile'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* TODO: Adicionar seção para histórico de buscas recentes do usuário */}
                {/* TODO: Adicionar mensagem quando não há resultados */}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;