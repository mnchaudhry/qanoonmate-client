"use client"

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, KeyRound } from 'lucide-react';
import { validate } from 'email-validator';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import Link from 'next/link';
import { login } from '@/store/reducers/authSlice';
import { UserRole } from '@/lib/enums';
import { LoginRequest } from '@/store/types/auth.types';
import localStorageManager from '@/utils/localStorage';

const BetaSignin: React.FC = () => {

  ////////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as UserRole;
  const redirect = searchParams.get('redirect') as string || '/';
  const initialData = { email: '', password: '' } as LoginRequest;

  ////////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////////////
  const [formData, setFormData] = useState<typeof initialData>(initialData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputError, setInputError] = useState(initialData);
  const [loading, setLoading] = useState(false);

  ////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((pre: typeof initialData) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData?.email) return toast.error('Email is required');
    if (!formData?.password) return toast.error('Password is required');

    setLoading(true);

    dispatch(login({ role, data: formData }))
      .then(({ meta }) => {
        if (meta.requestStatus === 'fulfilled') {
          router.push(redirect);
          localStorageManager.setItem('beta_user', true);
          setFormData(initialData);
        }
      })
      .finally(() => {
        setLoading(false);
        setInputError(initialData);
      });
  };

  const validateFields = (field?: string) => {
    const isEmailCorrect = !!formData.email && validate(formData.email);
    const hasPassword = !!formData.password;

    if (!field || field === 'email') {
      if (!isEmailCorrect) {
        setInputError((pre) => ({ ...pre, email: 'Please enter a valid email.' }));
        return false;
      } else {
        setInputError((pre) => ({ ...pre, email: '' }));
      }
    }

    if (!field || field === 'password') {
      if (!hasPassword) {
        setInputError((pre) => ({ ...pre, password: 'Please enter your password.' }));
        return false;
      } else {
        setInputError((pre) => ({ ...pre, password: '' }));
      }
    }

    return true;
  };

  const onForgetPassword = () => {
    router.push(`/auth/forgot-password`);
  };

  ////////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////////////
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/70 backdrop-blur-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Beta Access Sign In
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure sign in for invited <span className="font-semibold">beta users</span> only.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onBlur={() => validateFields('email')}
                onKeyUp={() => validateFields('email')}
                onChange={onChange}
                placeholder="betauser@example.com"
                className="w-full rounded-lg border border-input bg-background/60 py-3 pl-10 pr-3 text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
              <Mail className="absolute left-3 top-3.5 text-muted-foreground w-5 h-5" />
            </div>
            {inputError.email.length > 0 && (
              <span className="text-xs text-destructive">{inputError.email}</span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <button
                type="button"
                onClick={onForgetPassword}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onBlur={() => validateFields('password')}
                onKeyUp={() => validateFields('password')}
                onChange={onChange}
                placeholder="Your password"
                className="w-full rounded-lg border border-input bg-background/60 py-3 pl-10 pr-10 text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword((pre) => !pre);
                }}
                className="absolute right-3 top-3.5"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {inputError.password.length > 0 && (
              <span className="text-xs text-destructive">{inputError.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-white font-medium hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don’t have access?{' '}
              <Link href={`/auth/sign-up?role=${role}`} className="text-primary font-medium">
                Request Beta Access
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BetaSignin;
