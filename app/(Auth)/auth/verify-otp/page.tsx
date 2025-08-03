"use client"

import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import OTPInput from "react-otp-input";
import { useRouter, useSearchParams } from 'next/navigation';
import { useStateContext } from '@/context/useStateContext';
import { OtpVerificationType, UserRole } from '@/lib/enums';
import { AppDispatch } from '@/store/store';
import { verifyOTP } from '@/store/reducers/authSlice';
import { forgetPasswordRequest } from '@/store/reducers/authSlice';
import localStorageManager from '@/utils/localStorage';


const VerifyOTP: React.FC = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  const { OTPType, setOTPType } = useStateContext()
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const role = Object.values(UserRole).includes(roleParam as UserRole) ? roleParam as UserRole : UserRole.CLIENT;

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////////

  //////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpEmail = localStorageManager.getItem('OTP_EMAIL') as string

    if (!otp) return toast.error('OTP is required')
    if (!otpEmail) return toast.error("We've lost your email. Pleaes go back and signup again.")

    setLoading(true)

    dispatch(verifyOTP({ role, data: { otp, email: JSON.parse(otpEmail), type: OTPType } }))
      .then(({ meta }: any) => {
        if (meta.requestStatus === 'fulfilled') {

          if (OTPType == OtpVerificationType.SIGNUP) {
            router.push(`/auth/sign-in?role=${role}`)
            localStorageManager.removeItem('OTP_EMAIL')
          }
          else {
            router.push(`/auth/new-password?role=${role}`)
          }
          setOtp('')
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

  const onResend = () => {

    const otpEmail = localStorageManager.getItem('OTP_EMAIL') as string
    if (!otpEmail) return toast.error("We've lost your email. Pleaes go back and signup again.")

    setLoading(true)

    dispatch(forgetPasswordRequest({ role, data: { email: JSON.parse(otpEmail) } }))
      .then(({ meta }) => {
        if (meta.requestStatus === 'fulfilled') {
          setOTPType(OtpVerificationType.FORGETPASSWORD)
          router.push(`/auth/verify-otp?role=${role}`)
          setOtp('')
        }
        else {
          setLoading(false)
          return;
        }
      })
      .finally(() => {
        setLoading(false)
      })

  }

  return (
    <div className="w-full border-stroke xl:border-l-2 lg:pl-12 py-20 ">

      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">

        <h2 className="mb-3 text-2xl font-bold text-black dark:text-neutral sm:text-title-xl2">
          Verify Your Account to {OTPType === OtpVerificationType.SIGNUP ? "Complete Signup" : "Reset Password"}
        </h2>

        <p className="mb-9">
          Enter the 6 digit code sent to the registered email id.
        </p>

        <form onSubmit={onSubmit} >
          <div className="flex justify-start items-center gap-4.5">
            <OTPInput
              value={otp}
              onChange={(o) => setOtp(o)}
              numInputs={6}
              inputType="number"
              renderSeparator={<span className="mx-1"> </span>}
              renderInput={(props) => (
                <div className="md:w-16 md:h-16 w-12 h-12">
                  <input
                    {...props}
                    style={{}}
                    className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-neutral focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                  />
                </div>
              )}
            />
          </div>

          <p className="mb-5 mt-4 text-left text-black dark:text-neutral">
            Did not receive a code?
            <button type='button' onClick={onResend} className="font-medium text-primary ml-1"> Resend</button>
          </p>

          <div>
            <input
              type="submit"
              disabled={loading}
              value={loading ? "Verifying..." : "Verify"}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-neutral transition hover:bg-opacity-90"
            />
          </div>

          <span className="mt-5 block text-destructive">
            Don’t share the verification code with anyone!
          </span>

          <div className="mt-2">
            <span onClick={() => router.back()} className="hover:underline text-sm mt-4 cursor-pointer">Go Back</span>
          </div>

        </form>
      </div>

    </div>
  );
};

export default VerifyOTP;
