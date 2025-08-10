"use client"

import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { validate } from 'email-validator';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { OtpVerificationType, UserRole } from '@/lib/enums';
import { useStateContext } from '@/context/useStateContext';
import { AppDispatch } from '@/store/store';
import { forgetPasswordRequest } from '@/store/reducers/authSlice';


const ForgotPassword: React.FC = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { setOTPType } = useStateContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role');
  const role = Object.values(UserRole).includes(roleParam as UserRole) ? roleParam as UserRole : UserRole.CLIENT;

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////////

  //////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return toast.error('Please enter email')
    if (!validate(email)) return toast.error('Please enter a valid email')

    setLoading(true)

    dispatch(forgetPasswordRequest({ role, data: { email } }))
      .then(({ meta }) => {
        if (meta.requestStatus === 'fulfilled') {
          setOTPType(OtpVerificationType.FORGETPASSWORD)
          router.push(`/auth/verify-otp?role=${role || ''}`)
        }
      })
      .finally(() => {
        setLoading(false)
      })

  }

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////
  return (
    <div className="w-full border-stroke xl:border-l-2 lg:pl-12 py-20 ">

      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">

        <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-title-xl2">
          Forgot Password?
        </h2>

        <p className="mb-9">
          Enter your email address to receive a password reset OTP.
        </p>

        <form onSubmit={onSubmit} >
          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none"
              />
            </div>
          </div>

          <div>
            <input
              type="submit"
              disabled={loading}
              value={loading ? "Sending..." : "Send OTP"}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-neutral transition hover:bg-opacity-90"
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
