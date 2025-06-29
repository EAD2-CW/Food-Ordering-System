// src/app/auth/register/page.tsx
import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up - FoodOrder',
  description: 'Create a new FoodOrder account and start ordering your favorite food.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}