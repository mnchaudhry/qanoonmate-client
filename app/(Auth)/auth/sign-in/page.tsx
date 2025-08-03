"use client"

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { validate } from 'email-validator';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import Link from 'next/link';
import { login } from '@/store/reducers/authSlice';
import { UserRole } from '@/lib/enums';
import { LoginRequest } from '@/store/types/auth.types';

const SignIn: React.FC = () => {

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

  ////////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((pre: typeof initialData) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData?.email) return toast.error('Email is required')
    if (!formData?.password) return toast.error('Password is required')

    setLoading(true)

    dispatch(login({ role, data: formData }))
      .then(({ meta }) => {
        if (meta.requestStatus === 'fulfilled') {
          router.push(redirect);
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
        setInputError((pre) => ({ ...pre, password: 'Please enter a valid password.' }));
        return false;
      } else {
        setInputError((pre) => ({ ...pre, password: '' }));
      }
    }

    return true;
  };

  const onForgetPassword = () => {
    router.push(`/auth/forgot-password`)
  }

  ////////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////////////
  return (
    <div className="w-full border-stroke xl:border-l-2 lg:pl-12 py-20 ">

      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">

        <h2 className="mb-9 text-2xl font-bold text-black dark:text-neutral sm:text-title-xl2">
          Sign in{role in Object.values(UserRole) ? <> as a <span className="capitalize">{role}</span></> : ' to VerdictAI'}
        </h2>

        <form onSubmit={onSubmit}>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-neutral">
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
                placeholder="Enter your email"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />
              <span className="absolute right-4 top-4">
                <Mail />
              </span>
            </div>
            {inputError.email.length > 0 && (
              <span className="text-sm text-destructive">{inputError.email}</span>
            )}
          </div>

          <div className="mb-6">
            <div className="w flex items-center justify-between">
              <label className="mb-2.5 block font-medium text-black dark:text-neutral">
                Password
              </label>
              <button type="button" onClick={onForgetPassword} className="cursor-pointer font-normal text-primary hover:underline " >
                Forget Password?
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
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setShowPassword((pre) => !pre); }}
                className="absolute right-4 top-4"
              >
                {showPassword ? (<EyeOff className="text-gray-icon" />) : (<Eye className="text-gray-icon" />)}
              </button>
            </div>
            {inputError.password.length > 0 && <span className="text-sm text-destructive">{inputError.password}</span>}
          </div>

          <div className="mb-5">
            <input
              type="submit"
              disabled={loading}
              value={loading ? 'Processing...' : 'Sign In'}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-neutral transition hover:bg-opacity-90"
            />
          </div>

          <div className="mt-6 text-center">
            <p>
              Don&apos;t have any account?{' '}
              <Link href={`/auth/sign-up?role=${role}`} className="text-primary">
                Sign Up
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignIn;
