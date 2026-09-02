import { AuthFrame } from '@/components/auth/auth-frame';
import { RegisterForm } from './register-form';

export const metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <AuthFrame title="Create account">
      <RegisterForm />
    </AuthFrame>
  );
}
