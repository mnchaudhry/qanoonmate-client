"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { validate } from 'email-validator';
import { useRouter, useSearchParams } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/store';
import { useStateContext } from '@/context/useStateContext';
import Link from 'next/link';
import { OtpVerificationType, UserRole } from '@/lib/enums';
import { signup } from '@/store/reducers/authSlice';

const SignUp: React.FC = () => {

  //////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { error } = useSelector((state: RootState) => state.auth)
  const { setOTPType } = useStateContext()
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const role = Object.values(UserRole).includes(roleParam as UserRole) ? roleParam as UserRole : UserRole.CLIENT;
  const initialInputError = { email: '', firstname: '', lastname: '', phone: "", password: { uppercase: true, lowercase: true, number: true, special: true, length: true }, confirmPassword: '' }
  const initialData = { password: '', email: '', firstname: '', lastname: '', phone: "", }

  //////////////////////////////////////////////// STATES ///////////////////////////////////////////////////
  const [formData, setFormData] = useState<typeof initialData>(initialData)
  const [inputError, setInputError] = useState<typeof initialInputError>(initialInputError)
  const [showPassword, setShowPassword] = useState<{ password: boolean, confirmPassword: boolean }>({ password: false, confirmPassword: false })
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////////
  useEffect(() => {
    if (error)
      toast.error(error)
  }, [error])

  //////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(pre => ({ ...pre, [e.target.name]: e.target.value }))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  };

  const submitForm = async () => {
    setLoading(true)
    dispatch(signup({ role, data: formData }))
      .then(({ meta }) => {
        if (meta.requestStatus === 'fulfilled') {
          setOTPType(OtpVerificationType.SIGNUP)
          router.push(`/auth/verify-otp?role=${role}`)
          setFormData(initialData);
        }
        else {
          setLoading(false)
          return;
        }
      })
      .finally(() => {
        setInputError(initialInputError)
        setLoading(false)
      })
  };

  const validateForm = (field?: string) => {
    const numberRegex = /\d/;
    const specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;

    const hasNumber = numberRegex.test(formData?.password);
    const hasSpecialChar = specialCharacterRegex.test(formData?.password);
    const hasUppercase = uppercaseRegex.test(formData?.password);
    const hasLowercase = lowercaseRegex.test(formData?.password);

    if (!field || field === 'firstname') {
      if (!formData?.firstname || formData?.firstname.trim() === "") {
        setInputError(pre => ({ ...pre, firstname: 'Please enter a valid first name.' }));
        return false;
      }
      else {
        setInputError(pre => ({ ...pre, firstname: '' }));
      }
    }

    if (!field || field === 'lastname') {
      if (!formData?.lastname || formData?.lastname.trim() === "") {
        setInputError(pre => ({ ...pre, lastname: 'Please enter a valid last name.' }));
        return false;
      }
      else {
        setInputError(pre => ({ ...pre, lastname: '' }));
      }
    }

    if (!field || field === 'phone') {
      if (!formData?.phone || formData?.phone.trim() === "") {
        setInputError(pre => ({ ...pre, phone: 'Please enter a valid phone.' }));
        return false;
      }
      else {
        setInputError(pre => ({ ...pre, phone: '' }));
      }
    }

    if (!field || field === 'email') {
      if (!formData?.email || !validate(formData?.email) || formData?.email.trim() === "") {
        setInputError(pre => ({ ...pre, email: 'Please enter a valid email address.' }));
        return false;
      }
      else {
        setInputError(pre => ({ ...pre, email: '' }));
      }
    }

    if (!field || field === 'password') {
      if (!hasUppercase) {
        setInputError(pre => ({ ...pre, password: { uppercase: true, lowercase: false, number: false, special: false, length: false } }));
      }
      else if (!hasLowercase) {
        setInputError(pre => ({ ...pre, password: { uppercase: false, lowercase: true, number: false, special: false, length: false } }));
      }
      else if (!hasNumber) {
        setInputError(pre => ({ ...pre, password: { uppercase: false, lowercase: false, number: true, special: false, length: false } }));
      }
      else if (!hasSpecialChar) {
        setInputError(pre => ({ ...pre, password: { uppercase: false, lowercase: false, number: false, special: true, length: false } }));
      }
      else if (formData?.password.length < 8) {
        setInputError(pre => ({ ...pre, password: { uppercase: false, lowercase: false, number: false, special: false, length: true } }));
      }
      else {
        setInputError(pre => ({ ...pre, password: { uppercase: false, lowercase: false, number: false, special: false, length: false } }));
      }
    }


    return true;
  };


  //////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////
  return (
    <div className="w-full border-stroke xl:border-l-2 lg:pl-12 ">

      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-neutral sm:text-title-xl2">
          Sign up as a <span className="capitalize">{role}</span>
        </h2>

        <form onSubmit={onSubmit} >

          {/* firstname */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-neutral">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                name='firstname'
                onBlur={() => validateForm('firstname')}
                onKeyUp={() => validateForm('firstname')}
                value={formData?.firstname}
                onChange={onChange}
                placeholder="Enter your first name"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />
              {(inputError.firstname.length > 0) && <span className='text-destructive text-sm' >{inputError.firstname}</span>}
            </div>
          </div>

          {/* lastname */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-neutral">
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                name='lastname'
                onBlur={() => validateForm('lastname')}
                onKeyUp={() => validateForm('lastname')}
                value={formData?.lastname}
                onChange={onChange}
                placeholder="Enter your last name"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />
              {(inputError.lastname.length > 0) && <span className='text-destructive text-sm' >{inputError.lastname}</span>}
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-neutral">
              Phone
            </label>
            <div className="relative">
              <input
                type="number"
                name='phone'
                value={formData?.phone}
                onBlur={() => validateForm('phone')}
                onKeyUp={() => validateForm('phone')}
                onChange={onChange}
                placeholder="Enter your phone"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />
            </div>
            {(inputError.phone.length > 0) && <span className='text-destructive text-sm' >{inputError.phone}</span>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-neutral">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name='email'
                value={formData?.email}
                onBlur={() => validateForm('email')}
                onKeyUp={() => validateForm('email')}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />
            </div>
            {(inputError.email.length > 0) && <span className='text-destructive text-sm' >{inputError.email}</span>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-neutral">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword.password ? "text" : "password"}
                name='password'
                value={formData?.password}
                onBlur={() => validateForm('password')}
                onKeyUp={() => validateForm('password')}
                onChange={onChange}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-neutral dark:focus:border-primary"
              />

              <button onClick={(e) => { e.preventDefault(); setShowPassword(pre => ({ ...pre, password: !pre.password })) }} className="absolute right-4 top-4">
                {
                  showPassword.password
                    ?
                    <EyeOff className='text-gray-icon' />
                    :
                    <Eye className='text-gray-icon' />
                }
              </button>

            </div>

            <div className="flex flex-col gap-2 mt-2 ">
              {
                inputError.password.length && !inputError.password.uppercase && !inputError.password.lowercase && !inputError.password.special && !inputError.password.number &&
                <div className={`flex items-center gap-1.5 ${inputError.password.length ? 'text-destructive' : 'text-success'} text-sm`}  >
                  <span className='rounded-full border border-inherit p-[1px] '  ><Check className='w-4 h-4' /></span>
                  <span>Password must be atleast 8 character</span>
                </div>
              }
              {
                inputError.password.uppercase && !inputError.password.length && !inputError.password.lowercase && !inputError.password.special && !inputError.password.number &&
                <div className={`flex items-center gap-1.5 ${inputError.password.uppercase ? 'text-destructive' : 'text-success'} text-sm`}  >
                  <span className='rounded-full border border-inherit p-[1px] '  ><Check className='w-4 h-4' /></span>
                  <span>Password must have atleast one upper case character</span>
                </div>
              }
              {
                inputError.password.lowercase && !inputError.password.length && !inputError.password.uppercase && !inputError.password.special && !inputError.password.number &&
                <div className={`flex items-center gap-1.5 ${inputError.password.lowercase ? 'text-destructive' : 'text-success'} text-sm`}  >
                  <span className='rounded-full border border-inherit p-[1px] '  ><Check className='w-4 h-4' /></span>
                  <span>Password must have atleast one lower case character</span>
                </div>
              }
              {
                inputError.password.special && !inputError.password.length && !inputError.password.uppercase && !inputError.password.lowercase && !inputError.password.number &&
                <div className={`flex items-center gap-1.5 ${inputError.password.special ? 'text-destructive' : 'text-success'} text-sm`}  >
                  <span className='rounded-full border border-inherit p-[1px] '  ><Check className='w-4 h-4' /></span>
                  <span>Password must have atleast one special character</span>
                </div>
              }
              {
                inputError.password.number && !inputError.password.length && !inputError.password.uppercase && !inputError.password.lowercase && !inputError.password.special &&
                <div className={`flex items-center gap-1.5 ${inputError.password.number ? 'text-destructive' : 'text-success'} text-sm`}  >
                  <span className='rounded-full border border-inherit p-[1px] '  ><Check className='w-4 h-4' /></span>
                  <span>Password must have atleast one number</span>
                </div>
              }
            </div>

          </div>

          {/* Submit Button */}
          <div className="mb-5">
            <input
              type="submit"
              value={loading ? "Processing..." : "Create account"}
              disabled={loading}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary disabled:bg-primary/75 disabled:cursor-default p-4 text-neutral transition hover:bg-opacity-90"
            />
          </div>

          {/* Have Account? */}
          <div className="mt-6 text-center">
            <p>
              Already have an account?{' '}
              <Link href={`/auth/sign-in?`} className="text-primary">
                Sign in
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignUp;
