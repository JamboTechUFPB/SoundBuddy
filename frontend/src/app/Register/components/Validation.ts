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
  profileImage: File | null; // Para o upload de imagem de perfil
  // outros campos que possam existir no formulário completo
}

// Regras de validação
const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 6;
const ABOUT_MAX_LENGTH = 200;
const TAGS_MIN_COUNT = 3;
const TAGS_MAX_COUNT = 6;

// Mock de emails existentes no banco de dados para testar a validação
const MOCK_EXISTING_EMAILS = [
  'usuario@exemplo.com',
  'teste@teste.com',
  'admin@admin.com',
  'contato@servico.com',
];

/**
 * Verifica se um email já existe no banco de dados (versão mock)
 * @param email Email a ser verificado
 * @returns Promise que resolve para true se o email existir, false caso contrário
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  // Esta é uma implementação mock que simula uma verificação no banco de dados
  return MOCK_EXISTING_EMAILS.includes(email.toLowerCase());
  
  /* IMPLEMENTAÇÃO REAL (comentada)
  try {
    // Exemplo de como seria com uma API RESTful
    const response = await fetch('/api/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    return data.exists;
    
    // OU com um cliente de banco de dados direto (backend)
    // const user = await prisma.user.findUnique({ where: { email } });
    // return !!user;
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    // Em caso de erro de conexão, permitimos prosseguir
    // mas na produção seria melhor lidar com isso adequadamente
    return false;
  }
  */
};

/**
 * Valida os dados do primeiro passo do formulário
 * @param data Dados do formulário a serem validados
 * @param validateEmail Flag que indica se deve verificar a existência do email
 */
export const validateStep1 = async (
  data: FormData, 
  validateEmail: boolean = true
): Promise<FormValidationResult> => {
  // Primeiro fazemos a validação síncrona básica
  const syncResult = validateStep1Sync(data);
  let errors = [...syncResult.errors];
  
  // Se não houver erro no formato do email e a flag de validação estiver ativa
  if (validateEmail && data.email && errors.every(err => err.field !== 'email')) {
    // Verificamos se o email já existe
    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      errors.push({ field: 'email', message: 'Este email já está cadastrado' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Versão sincronizada da validação do primeiro passo
 * Útil para validações em tempo real de campos individuais
 * Não verifica a existência do email no banco
 */
export const validateStep1Sync = (data: FormData): FormValidationResult => {
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