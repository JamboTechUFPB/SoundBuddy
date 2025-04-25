export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface FormValidationResult {
    isValid: boolean;
    errors: ValidationError[];
  }
  
  export interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    userType: string;
    about: string;
    tags: string[];
    // outros campos que possam existir no formulário completo
  }
  
  // Regras de validação
  const USERNAME_MIN_LENGTH = 3;
  const PASSWORD_MIN_LENGTH = 6;
  const ABOUT_MAX_LENGTH = 200;
  const TAGS_MIN_COUNT = 3;
  const TAGS_MAX_COUNT = 6;
  
  /**
   * Valida os dados do primeiro passo do formulário
   * Obs: A validação de email foi removida pois agora é feita pelo navegador
   */
  export const validateStep1 = (data: FormData): FormValidationResult => {
    const errors: ValidationError[] = [];
    
    // Validação de username
    if (!data.username) {
      errors.push({ field: 'username', message: 'Username é obrigatório' });
    } else if (data.username.length < USERNAME_MIN_LENGTH) {
      errors.push({ 
        field: 'username', 
        message: `Username deve ter pelo menos ${USERNAME_MIN_LENGTH} caracteres` 
      });
    }
    
    // Validação de senha
    if (!data.password) {
      errors.push({ field: 'password', message: 'Senha é obrigatória' });
    } else if (data.password.length < PASSWORD_MIN_LENGTH) {
      errors.push({ 
        field: 'password', 
        message: `Senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres` 
      });
    } 
    
    // Validação de confirmação de senha
    if (!data.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Confirmação de senha é obrigatória' });
    } else if (data.password !== data.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'As senhas não coincidem' });
    }
    
    // Validação de tipo de usuário
    if (!data.userType) {
      errors.push({ field: 'userType', message: 'Escolha um tipo de usuário' });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Valida os dados do segundo passo do formulário
   */
  export const validateStep2 = (data: FormData): FormValidationResult => {
    const errors: ValidationError[] = [];
    
    // Validação do campo "about" (descrição do usuário)
    if (!data.about || data.about.trim() === '') {
      errors.push({ field: 'about', message: 'A descrição é obrigatória' });
    } else if (data.about.length > ABOUT_MAX_LENGTH) {
      errors.push({
        field: 'about',
        message: `A descrição deve ter no máximo ${ABOUT_MAX_LENGTH} caracteres (${data.about.length} atualmente)`
      });
    }
    
    // Validação das tags selecionadas
    if (!data.tags || data.tags.length === 0) {
      errors.push({ field: 'tags', message: 'Selecione pelo menos uma tag' });
    } else if (data.tags.length < TAGS_MIN_COUNT) {
      errors.push({
        field: 'tags',
        message: `Selecione pelo menos ${TAGS_MIN_COUNT} tags (${data.tags.length} selecionadas)`
      });
    } else if (data.tags.length > TAGS_MAX_COUNT) {
      errors.push({
        field: 'tags',
        message: `Selecione no máximo ${TAGS_MAX_COUNT} tags (${data.tags.length} selecionadas)`
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };