// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { useToast } from '@/context/ToastContext';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { Car, Eye, EyeOff } from 'lucide-react';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const { login } = useAuth();
//   const { addToast } = useToast();
//   const router = useRouter();

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setErrors({});

//   //   if (!email) return setErrors({ email: 'Email is required' });
//   //   if (!password) return setErrors({ password: 'Password is required' });

//   //   setLoading(true);
//   //   try {
//   //     await login(email, password);
//   //     addToast('Welcome back!', 'success');
//   //     router.push('/');
//   //   } catch (err: any) {
//   //     const msg = err.response?.data?.error || 'Login failed';
//   //     addToast(msg, 'error');
//   //     setErrors({ form: msg });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // handle submit new
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     if (!email) return setErrors({ email: 'Email is required' });
//     if (!password) return setErrors({ password: 'Password is required' });

//     setLoading(true);
//     try {
//       await login(email, password);
//       addToast('Welcome back!', 'success');

//       // ✅ RBAC redirect — send each role to their own area
//       const stored = localStorage.getItem('accessToken');
//       if (stored) {
//         // user state is set inside login(), read it from a fresh getMe call
//         // We decode the role from the response instead — see AuthContext fix below
//       }
//       // Role-based redirect is handled in AuthContext (see next file)
//       // This fallback handles any edge case
//       router.push('/');
//     } catch (err: any) {
//       const msg = err.response?.data?.error || 'Login failed';
//       addToast(msg, 'error');
//       setErrors({ form: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center gap-2 mb-4">
//             <Car className="w-10 h-10 text-primary-600" />
//             <span className="text-2xl font-bold text-gray-900">DriveHub</span>
//           </Link>
//           <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
//           <p className="text-gray-600 mt-1">Sign in to your account</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               label="Email"
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               error={errors.email}
//             />
//             <div className="relative">
//               <Input
//                 label="Password"
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={errors.password}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             {errors.form && (
//               <p className="text-sm text-red-600">{errors.form}</p>
//             )}

//             <Button
//               type="submit"
//               loading={loading}
//               className="w-full"
//               size="lg"
//             >
//               Sign In
//             </Button>
//           </form>

//           <div className="mt-6 text-center text-sm text-gray-600">
//             Don&apos;t have an account?{' '}
//             <Link
//               href="/register"
//               className="text-primary-600 font-medium hover:underline"
//             >
//               Create one
//             </Link>
//           </div>

//           {/* Demo credentials */}
//           <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
//             <p className="font-medium mb-1">Demo Credentials:</p>
//             <p>Admin: admin@drivehub.com / Admin123!</p>
//             <p>User: khalidhasan@mail.com / User123!</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Car, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';

type RoleTab = 'CUSTOMER' | 'ADMIN';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<RoleTab>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  // Pre-fill demo credentials when switching tabs
  const handleTabSwitch = (role: RoleTab) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) return setErrors({ email: 'Email is required' });
    if (!password) return setErrors({ password: 'Password is required' });

    setLoading(true);
    try {
      const loggedInUser = await login(email, password);

      // Guard: make sure they logged in with the right role tab
      if (loggedInUser.role !== selectedRole) {
        addToast(
          `This account is not a ${selectedRole === 'ADMIN' ? 'Admin' : 'Customer'} account. Redirecting...`,
          'error',
        );
        // Still redirect them to the correct area for their actual role
        if (loggedInUser.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }

      addToast(`Welcome back, ${loggedInUser.name}!`, 'success');

      // Role-based redirect
      if (loggedInUser.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Login failed';
      addToast(msg, 'error');
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = selectedRole === 'ADMIN';

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-500 ${
        isAdmin
          ? 'bg-gradient-to-br from-slate-900 to-slate-700'
          : 'bg-gradient-to-br from-primary-50 to-blue-100'
      }`}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Car
              className={`w-10 h-10 ${isAdmin ? 'text-white' : 'text-primary-600'}`}
            />
            <span
              className={`text-2xl font-bold ${isAdmin ? 'text-white' : 'text-gray-900'}`}
            >
              DriveHub
            </span>
          </Link>
          <h1
            className={`text-2xl font-bold ${isAdmin ? 'text-white' : 'text-gray-900'}`}
          >
            Welcome Back
          </h1>
          <p
            className={`mt-1 text-sm ${isAdmin ? 'text-slate-300' : 'text-gray-500'}`}
          >
            Sign in to your account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* ── Role Tab Switcher ── */}
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => handleTabSwitch('CUSTOMER')}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <User className="w-4 h-4" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('ADMIN')}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 ${
                selectedRole === 'ADMIN'
                  ? 'bg-slate-800 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          {/* ── Role Badge ── */}
          <div
            className={`px-8 pt-5 pb-1 flex items-center gap-2 ${
              isAdmin ? 'text-slate-700' : 'text-primary-700'
            }`}
          >
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                isAdmin
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-primary-50 text-primary-700'
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              {isAdmin ? 'Admin Login' : 'Customer Login'}
            </div>
          </div>

          {/* ── Form ── */}
          <div className="px-8 pb-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder={isAdmin ? 'admin@drivehub.com' : 'you@example.com'}
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
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {errors.form}
                </p>
              )}

              <Button
                type="submit"
                loading={loading}
                className={`w-full ${
                  isAdmin ? '!bg-slate-800 hover:!bg-slate-900' : ''
                }`}
                size="lg"
              >
                {isAdmin ? 'Sign In as Admin' : 'Sign In'}
              </Button>
            </form>

            {/* Register link — only for customers */}
            {!isAdmin && (
              <div className="mt-5 text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-primary-600 font-medium hover:underline"
                >
                  Create one
                </Link>
              </div>
            )}

            {/* Demo credentials */}
            <div className="mt-5 p-3 rounded-xl text-xs border border-dashed">
              {isAdmin ? (
                <div className="text-slate-600">
                  <p className="font-semibold mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Demo
                  </p>
                  <p>
                    Email: <span className="font-mono">admin@drivehub.com</span>
                  </p>
                  <p>
                    Password: <span className="font-mono">Admin123!</span>
                  </p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <p className="font-semibold mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Customer Demo
                  </p>
                  <p>
                    Email:{' '}
                    <span className="font-mono">khalidhasan@mail.com</span>
                  </p>
                  <p>
                    Password: <span className="font-mono">User123!</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
