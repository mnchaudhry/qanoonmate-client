"use client"

import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/store/reducers/authSlice';
import { AppDispatch } from '@/store/store';
import { UserRole } from '@/lib/enums';
import localStorageManager from '@/utils/localStorage';


const NewPassword: React.FC = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const role = Object.values(UserRole).includes(roleParam as UserRole) ? roleParam as UserRole : UserRole.CLIENT;

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////////


  //////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) return toast.error('Please enter password')
    if (password !== confirmPassword) return toast.error('Password does not match')
    const otpEmail = localStorageManager.getItem('OTP_EMAIL') as string
    if (!otpEmail) return toast.error("We've lost your email. Pleaes go back and signup again.")

    setLoading(true)

    dispatch(resetPassword({ role, data: { newPassword: password, email: JSON.parse(otpEmail) } }))
      .then(({ meta }) => {
        if (meta.requestStatus === 'fulfilled') {
          router.push(`/auth/sign-in`)
          localStorageManager.removeItem('OTP_EMAIL')
          setPassword('');
          setConfirmPassword('');
        }
        else {
          setLoading(false)
          return;
        }
      })
      .finally(() => {
        setLoading(false)
      })

  };

  return (
    <div className="w-full border-stroke xl:border-l-2 lg:pl-12 py-20 ">

      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">

        <h2 className="mb-3 text-2xl font-bold text-black dark:text-neutral sm:text-title-xl2">
          New Password
        </h2>

        <p className="mb-9">
          Enter your email address to receive a password reset link.
        </p>

        <form onSubmit={onSubmit} >
          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-neutral">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-neutral">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />
            </div>
          </div>

          <div>
            <input
              type="submit"
              disabled={loading}
              value={loading ? "Updating..." : "Update Password"}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-neutral transition hover:bg-opacity-90"
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewPassword;
