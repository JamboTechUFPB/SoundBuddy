export interface FormData {
  // Dados do Step1
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;

  // Dados do Step2
  about: string;
  tags: string[];

  // Dados do Step3
  profileImage: File | null;
}

export interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  
  // Props condicionais baseadas no passo atual
  handleNextStep?: () => void;      // Usado nos passos 1 e 2
  handlePreviousStep?: () => void;  // Usado nos passos 2 e 3
  handleSubmit?: () => void;        // Usado apenas no passo 3
}