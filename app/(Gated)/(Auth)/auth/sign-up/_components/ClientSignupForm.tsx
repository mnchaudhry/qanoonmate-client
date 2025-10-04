"use client"

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { validate } from 'email-validator';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import { useStateContext } from '@/context/useStateContext';
import Link from 'next/link';
import { OtpVerificationType, UserRole } from '@/lib/enums';
import { clientSignup } from '@/store/reducers/authSlice';

// Validation rules
const phoneRegex = /^(\+92|0)?[0-9]{10}$/;

interface ClientFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
}


const ClientSignupForm = () => {

  ////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { setOTPType } = useStateContext();

  ////////////////////////////////////////////////// STATES //////////////////////////////////////////////////
  const [formData, setFormData] = useState<ClientFormData>({ firstname: '', lastname: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  ////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////
  // Update form data
  const updateForm = (field: keyof ClientFormData, value: string) => {
    setFormData((prev: ClientFormData) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: any = {};

    // First name validation
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    } else if (formData.firstname.trim().length < 2) {
      newErrors.firstname = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstname.trim())) {
      newErrors.firstname = 'First name can only contain letters and spaces';
    }

    // Last name validation
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    } else if (formData.lastname.trim().length < 2) {
      newErrors.lastname = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastname.trim())) {
      newErrors.lastname = 'Last name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validate(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid Pakistani phone number (e.g., +92 300 1234567 or 0300 1234567)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const submitForm = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await dispatch(clientSignup({
        ...formData,
        phone: formData.phone || ''
      }));

      if (result.meta.requestStatus === 'fulfilled') {
        setOTPType(OtpVerificationType.SIGNUP);
        router.push(`/auth/verify-otp?role=${UserRole.CLIENT}`);
      }
    } catch (error) {
      console.error('Client signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////
  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
        {/* First Name */}
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">First Name</label>
          <input
            type="text"
            value={formData.firstname}
            onChange={(e) => updateForm('firstname', e.target.value)}
            placeholder="Enter your first name"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.firstname && <span className="text-destructive text-sm">{errors.firstname}</span>}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Last Name</label>
          <input
            type="text"
            value={formData.lastname}
            onChange={(e) => updateForm('lastname', e.target.value)}
            placeholder="Enter your last name"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.lastname && <span className="text-destructive text-sm">{errors.lastname}</span>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateForm('email', e.target.value)}
            placeholder="example@email.com"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.email && <span className="text-destructive text-sm">{errors.email}</span>}
        </div>

        {/* Phone (Optional) */}
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Phone (Optional)</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateForm('phone', e.target.value)}
            placeholder="+92 300 1234567 or 0300 1234567"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.phone && <span className="text-destructive text-sm">{errors.phone}</span>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => updateForm('password', e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              {showPassword ? <EyeOff className="text-gray-icon" /> : <Eye className="text-gray-icon" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with uppercase, lowercase, and number</p>
          {errors.password && <span className="text-destructive text-sm">{errors.password}</span>}
        </div>

        {/* Submit Button */}
        <div className="mb-5">
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary text-primary-foreground disabled:bg-primary/75 disabled:cursor-default p-4 transition hover:bg-opacity-90"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        {/* Have Account? */}
        <div className="mt-6 text-center">
          <p>
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ClientSignupForm;
