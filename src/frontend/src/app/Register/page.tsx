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

  /*const handleSubmit = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Senhas não coincidem");
        return;
      }
      console.log('Form submitted:', formData);
  
      const userData = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        tags: formData.tags,
      };
  
      const response = await fetch('http://localhost:8000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar usuário');
      }
  
      const data = await response.json();
  
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      router.push('/Home');

    } catch (error) {
      console.error('Error during registration:', error);
      alert('Erro ao criar conta. Tente novamente.');
    }
  };*/


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