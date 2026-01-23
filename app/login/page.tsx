// app/login/page.tsx

import LoginScreen from '@/components/LoginScreen';

export default function LoginPage() {
  // Этот div центрирует форму входа на странице
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <LoginScreen />
    </div>
  );
}
