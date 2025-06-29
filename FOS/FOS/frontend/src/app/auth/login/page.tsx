// src/app/auth/login/page.tsx
import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - FoodOrder',
  description: 'Sign in to your FoodOrder account to start ordering delicious food.',
};

export default function LoginPage() {
  return <LoginForm />;
}