// components/RegisterSteps/types.ts
export type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
  about: string;
  tags: string[];
  profileImage: File | null;
};

export type StepProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleNextStep?: () => void;
  handlePreviousStep?: () => void;
  handleSubmit?: () => void;
};