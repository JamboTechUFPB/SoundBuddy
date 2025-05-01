import { useState, useRef } from 'react';
import {  XMarkIcon, MusicalNoteIcon, PhotoIcon} from '@heroicons/react/24/outline';

const NewPostModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  setPostData,
  currentUser
}) => {
  const [content, setContent] = useState('');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaName, setMediaName] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs para os inputs de arquivo
  const mediaInputRef = useRef(null);
  const musicInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !media) return;
    
    setIsLoading(true);

    try {
      // Para texto simples, apenas envia o conteúdo diretamente
      if (!media) {
        await onSubmit(content);
      } 
      // Quando há mídia, envia um objeto com os dados
      else {
        // SIMULAÇÃO DE UPLOAD DE MÍDIA - TEMOS QUE IMPLEMENTAR O UPLOAD REAL DPS
        // Em produção, upload para um servidor e receberia uma URL
        const mediaUrl = URL.createObjectURL(media); // Cria URL temporária para a mídia
          
        await onSubmit({
          content,
          mediaType: mediaType,
          mediaUrl: mediaUrl,
          mediaName: mediaName
        });
      }
      
      // Limpar o formulário
      setContent('');
      setMedia(null);
      setMediaPreview(null);
      setMediaType(null);
      setPostData(null);
      
      // Fechar o modal
      onClose();
    } catch (error) {
      console.error('Erro ao publicar post:', error);
      // Poderia adicionar um tratamento de erro aqui
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para upload de mídia (imagem ou vídeo)
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem ou um vídeo
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Por favor, selecione uma imagem ou vídeo válido.');
      return;
    }

    // Verificar o tamanho do arquivo (máx. 20MB para vídeos, 5MB para imagens)
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    
    if (file.size > maxSize) {
      alert(`O arquivo é muito grande. O tamanho máximo é ${isVideo ? '20MB' : '5MB'}.`);
      return;
    }

    setMedia(file);
    setMediaType(isVideo ? 'video' : 'image');
    
    // Criar preview da mídia
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target.result);
      setMediaName(file.name);
      setMediaUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handler para o upload de música
  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar se o arquivo é um áudio
    if (!file.type.startsWith('audio/')) {
      alert('Por favor, selecione um arquivo de áudio válido.');
      return;
    }

    // Verificar o tamanho do arquivo (máx. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo é muito grande. O tamanho máximo é 10MB.');
      return;
    }

    setMedia(file);
    setMediaType('audio');
    setMediaPreview(`Áudio: ${file.name}`);
  };

  // Resetar o modal quando for fechado
  const handleClose = () => {
    setContent('');
    setMedia(null);
    setMediaPreview(null);
    setMediaType(null);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-150 bg-black/50 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl relative">
        {/* Botão de fechar (X) no canto superior direito */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Fechar"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        {/* Área do conteúdo do post */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {/* Avatar do usuário */}
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={currentUser.profileImage || '/default-avatar.png'} 
                alt="Avatar do usuário" 
                width={40} 
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Username */}
            <span className="text-gray-500 text-sm">{currentUser.name}</span>
          </div>
          
          {/* Textarea para o conteúdo do post */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Fale um pouco do seu som..."
            className="w-full min-h-[150px] p-0 border-none outline-none resize-none text-gray-800 placeholder-gray-400"
            autoFocus
          />
          
          {/* Preview da mídia */}
          {mediaPreview && (
            <div className="mt-4 relative">
              {mediaType === 'audio' ? (
                <div className="bg-gray-100 p-3 rounded-lg flex items-center">
                  <MusicalNoteIcon className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">{mediaPreview.replace('Áudio: ', '')}</span>
                  <audio 
                    className="hidden" 
                    controls 
                    src={media ? URL.createObjectURL(media) : ''}
                  />
                  <button 
                    onClick={() => {
                      setMedia(null);
                      setMediaPreview(null);
                      setMediaType(null);
                    }}
                    className="ml-auto text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : mediaType === 'video' ? (
                <div className="relative">
                  <video 
                    src={URL.createObjectURL(media)} 
                    className="w-full h-auto rounded-lg max-h-64 object-contain"
                    controls
                  />
                  <button
                    onClick={() => {
                      setMedia(null);
                      setMediaPreview(null);
                      setMediaType(null);
                    }}
                    className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full h-auto rounded-lg max-h-48 object-contain"
                  />
                  <button
                    onClick={() => {
                      setMedia(null);
                      setMediaPreview(null);
                      setMediaType(null);
                    }}
                    className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Barra separadora */}
        <div className="border-t border-gray-200 my-2"></div>
        
        {/* Botão de publicar */}
        <div className="flex justify-center p-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isLoading || (!content.trim() && !media)}
          >
            {isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
        
        {/* Inputs ocultos para upload de arquivos */}
        <input
          type="file"
          ref={mediaInputRef}
          hidden
          accept="image/*,video/*"
          onChange={handleMediaUpload}
        />
        
        <input
          type="file"
          ref={musicInputRef}
          hidden
          accept="audio/*"
          onChange={handleMusicUpload}
        />
        
        {/* Ícones de mídia */}
        <div className="flex justify-center p-4 space-x-8 border-t border-gray-200">
          {/* Ícone Música */}
          <button 
            className="text-gray-700 hover:text-gray-900" 
            aria-label="Adicionar música"
            onClick={() => musicInputRef.current?.click()}
          >
            <MusicalNoteIcon className="w-6 h-6" />
          </button>
          
          {/* Ícone Imagem/Vídeo */}
          <button 
            className="text-gray-700 hover:text-gray-900" 
            aria-label="Adicionar imagem ou vídeo"
            onClick={() => mediaInputRef.current?.click()}
          >
            <PhotoIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPostModal;