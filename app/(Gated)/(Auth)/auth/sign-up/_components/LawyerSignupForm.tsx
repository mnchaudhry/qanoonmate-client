"use client"

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { validate } from 'email-validator';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import { useStateContext } from '@/context/useStateContext';
import Link from 'next/link';
import { OtpVerificationType, UserRole, BarCouncils } from '@/lib/enums';
import { lawyerSignupStep } from '@/store/reducers/authSlice';
import { LawyerFormData } from './types';

// Validation rules
const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

// Formatting functions
const formatCNIC = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Apply formatting based on length
  if (digits.length <= 5) {
    return digits;
  } else if (digits.length <= 12) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  } else {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  }
};

const validateLicenseNumber = (licenseNumber: string) => {
  if (!licenseNumber.trim()) return 'License number is required';

  // Basic validation - can be enhanced with specific bar council formats
  if (licenseNumber.length < 3) return 'License number must be at least 3 characters';
  if (licenseNumber.length > 20) return 'License number must be less than 20 characters';

  return '';
};

const LawyerSignupForm = () => {
  ////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { setOTPType } = useStateContext();

  ////////////////////////////////////////////////// STATES //////////////////////////////////////////////////
  const [formData, setFormData] = useState<LawyerFormData>({
    firstname: '',
    lastname: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    cnic: '',
    licenseNumber: '',
    barCouncil: '',
    barAssociation: '',
    barCouncilEnrollmentDate: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  ////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////
  const updateForm = (field: keyof LawyerFormData, value: any) => {
    let formattedValue = value;

    // Apply automatic formatting
    if (field === 'cnic') {
      formattedValue = formatCNIC(value);
    }

    setFormData((prev: LawyerFormData) => ({ ...prev, [field]: formattedValue }));
    setErrors((prev: any) => ({ ...prev, [field]: '' }));
  };

  const validateBasicInfo = () => {
    const newErrors: any = {};

    // Personal Information Validation
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    else if (formData.firstname.trim().length < 2) newErrors.firstname = 'First name must be at least 2 characters';
    else if (formData.firstname.trim().length > 50) newErrors.firstname = 'First name must be less than 50 characters';

    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    else if (formData.lastname.trim().length < 2) newErrors.lastname = 'Last name must be at least 2 characters';
    else if (formData.lastname.trim().length > 50) newErrors.lastname = 'Last name must be less than 50 characters';

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 5) newErrors.fullName = 'Full name must be at least 5 characters';
    else if (formData.fullName.trim().length > 100) newErrors.fullName = 'Full name must be less than 100 characters';

    // Contact Information Validation
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validate(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.phone.startsWith('03')) newErrors.phone = 'Phone number must start with 03';
    else if (formData.phone.length < 11) newErrors.phone = 'Phone number must be at least 11 characters';

    // Security Validation
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (formData.password.length > 128) newErrors.password = 'Password must be less than 128 characters';
    else if (!/(?=.*[a-z])/.test(formData.password)) newErrors.password = 'Password must contain at least one lowercase letter';
    else if (!/(?=.*[A-Z])/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/(?=.*\d)/.test(formData.password)) newErrors.password = 'Password must contain at least one number';

    // CNIC Validation
    if (!formData.cnic.trim()) newErrors.cnic = 'CNIC is required';
    else if (!cnicRegex.test(formData.cnic)) newErrors.cnic = 'Please enter a valid CNIC format (12345-1234567-1)';

    // Professional Information Validation
    const licenseError = validateLicenseNumber(formData.licenseNumber);
    if (licenseError) newErrors.licenseNumber = licenseError;

    if (!formData.barCouncil) newErrors.barCouncil = 'Bar council is required';

    if (!formData.barAssociation.trim()) newErrors.barAssociation = 'Bar association is required';
    else if (formData.barAssociation.trim().length < 3) newErrors.barAssociation = 'Bar association must be at least 3 characters';
    else if (formData.barAssociation.trim().length > 100) newErrors.barAssociation = 'Bar association must be less than 100 characters';

    if (!formData.barCouncilEnrollmentDate) newErrors.barCouncilEnrollmentDate = 'Enrollment date is required';
    else {
      const enrollmentDate = new Date(formData.barCouncilEnrollmentDate);
      const currentDate = new Date();
      const minDate = new Date(currentDate.getFullYear() - 50, 0, 1); // 50 years ago

      if (enrollmentDate > currentDate) newErrors.barCouncilEnrollmentDate = 'Enrollment date cannot be in the future';
      if (enrollmentDate < minDate) newErrors.barCouncilEnrollmentDate = 'Enrollment date cannot be more than 50 years ago';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitBasicInfo = async () => {
    if (!validateBasicInfo()) return;

    setLoading(true);
    try {
      const result = await dispatch(lawyerSignupStep({
        firstname: formData.firstname,
        lastname: formData.lastname,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        cnic: formData.cnic,
        licenseNumber: formData.licenseNumber,
        barCouncil: formData.barCouncil,
        barAssociation: formData.barAssociation,
        barCouncilEnrollmentDate: formData.barCouncilEnrollmentDate,
      }));

      if (result.meta.requestStatus === 'fulfilled') {
        setOTPType(OtpVerificationType.SIGNUP);
        router.push(`/auth/verify-otp?role=${UserRole.LAWYER}`);
      }
    } catch (error) {
      console.error('Lawyer signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////
  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); submitBasicInfo(); }} className='space-y-4' >
        {/* Personal Information */}
        <div>
          <label className="mb-2.5 block font-medium text-foreground">First Name</label>
          <input
            type="text"
            value={formData.firstname}
            onChange={(e) => updateForm('firstname', e.target.value)}
            placeholder="e.g., Muhammad"
            maxLength={50}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
        </div>

        <div>
          <label className="mb-2.5 block font-medium text-foreground">Last Name</label>
          <input
            type="text"
            value={formData.lastname}
            onChange={(e) => updateForm('lastname', e.target.value)}
            placeholder="e.g., Ahmed"
            maxLength={50}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
        </div>

        <div>
          <label className="mb-2.5 block font-medium text-foreground">Full Name (as per CNIC)</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateForm('fullName', e.target.value)}
            placeholder="e.g., Muhammad Ahmed Khan"
            maxLength={100}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="mb-2.5 block font-medium text-foreground">CNIC</label>
          <input
            type="text"
            value={formData.cnic}
            onChange={(e) => updateForm('cnic', e.target.value)}
            placeholder="12345-1234567-1"
            maxLength={15}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
        </div>

        {/* Contact Information */}
        <div>
          <label className="mb-2.5 block font-medium text-foreground">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateForm('email', e.target.value)}
            placeholder="e.g., muhammad.ahmed@example.com"
            maxLength={100}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-2.5 block font-medium text-foreground">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateForm('phone', e.target.value)}
            placeholder="03001234567"
            maxLength={11}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Professional Information */}
        <div>
          <label className="mb-2.5 block font-medium text-foreground">License Number</label>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => updateForm('licenseNumber', e.target.value)}
            placeholder="e.g., LHR-2023-001234"
            maxLength={20}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
        </div>

        <div>
          <label className="mb-2.5 block font-medium text-foreground">Bar Council</label>
          <select
            value={formData.barCouncil}
            onChange={(e) => updateForm('barCouncil', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select your Bar Council</option>
            {Object.values(BarCouncils).map((council) => (
              <option key={council} value={council}>
                {council}
              </option>
            ))}
          </select>
          {errors.barCouncil && <p className="text-red-500 text-sm mt-1">{errors.barCouncil}</p>}
        </div>

        <div>
          <label className="mb-2.5 block font-medium text-foreground">Bar Association</label>
          <input
            type="text"
            value={formData.barAssociation}
            onChange={(e) => updateForm('barAssociation', e.target.value)}
            placeholder="e.g., Lahore High Court Bar Association"
            maxLength={100}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.barAssociation && <p className="text-red-500 text-sm mt-1">{errors.barAssociation}</p>}
        </div>

        <div>
          <label className="mb-2.5 block font-medium text-foreground">Enrollment Date</label>
          <input
            type="date"
            min={new Date('1970-01-01').toISOString().split('T')[0]}
            max={new Date().toISOString().split('T')[0]}
            value={formData.barCouncilEnrollmentDate}
            onChange={(e) => updateForm('barCouncilEnrollmentDate', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.barCouncilEnrollmentDate && <p className="text-red-500 text-sm mt-1">{errors.barCouncilEnrollmentDate}</p>}
        </div>

        {/* Security */}
        <div className="relative">
          <label className="mb-2.5 block font-medium text-foreground">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateForm('password', e.target.value)}
            placeholder="At least 8 characters with uppercase, lowercase & number"
            maxLength={128}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="flex justify-between items-center">
          <Link
            href="/auth/sign-in"
            className="text-primary hover:text-primary/80 text-sm"
          >
            Already have an account? Sign in
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-primary/75"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LawyerSignupForm;