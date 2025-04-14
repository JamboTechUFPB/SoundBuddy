'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import { FormData } from './components/types';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    about: '',
    tags: [],
    profileImage: null,
  });

  const router = useRouter();

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Lógica de envio do formulário
    router.push('/Home');
  };

  return (
    <div className="min-h-screen">
      {currentStep === 1 && (
        <Step1 
          formData={formData}
          setFormData={setFormData}
          handleNextStep={handleNextStep}
        />
      )}

      {currentStep === 2 && (
        <Step2
          formData={formData}
          setFormData={setFormData}
          handlePreviousStep={handlePreviousStep}
          handleNextStep={handleNextStep}
        />
      )}

      {currentStep === 3 && (
        <Step3
          formData={formData}
          setFormData={setFormData}
          handlePreviousStep={handlePreviousStep}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Register;