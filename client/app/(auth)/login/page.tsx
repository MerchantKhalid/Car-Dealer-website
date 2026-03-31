'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Car, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) return setErrors({ email: 'Email is required' });
    if (!password) return setErrors({ password: 'Password is required' });

    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      router.push('/');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Login failed';
      addToast(msg, 'error');
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Car className="w-10 h-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">DriveHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.form && (
              <p className="text-sm text-red-600">{errors.form}</p>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Admin: admin@drivehub.com / Admin123!</p>
            <p>User: khalidhasan@mail.com / User123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
