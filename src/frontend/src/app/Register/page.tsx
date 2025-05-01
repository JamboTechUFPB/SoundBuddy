'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import type { FormData } from './components/types';

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

  const handleSubmit = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Senhas não coincidem");
        return;
      }
      console.log('Form submitted:', formData);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('userType', formData.userType);
      formDataToSend.append('about', formData.about);
      formDataToSend.append('tags', JSON.stringify(formData.tags));

      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/create`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
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