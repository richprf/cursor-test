import { type ReactNode } from 'react';
import '../wwake.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="wwake auth-root" dir="rtl" lang="fa">
      {children}
    </div>
  );
}
