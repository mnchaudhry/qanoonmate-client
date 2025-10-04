"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Upload, X, Check } from 'lucide-react';
import { validate } from 'email-validator';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import { useStateContext } from '@/context/useStateContext';
import Link from 'next/link';
import { OtpVerificationType, UserRole, BarCouncils, LawCategory } from '@/lib/enums';
import { lawyerSignupStep1, lawyerSignupStep2, lawyerSignupStep3, lawyerSignupStep4, lawyerSignupStep5, getLawyerSignupProgress } from '@/store/reducers/authSlice';

// Validation rules
const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
const licenseRegex = /^[A-Z0-9-]{3,15}$/;
const phoneRegex = /^(\+92|0)?[0-9]{10}$/;

interface LawyerFormData {
  // Step 1
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  cnic: string;
  // Step 2
  licenseNumber: string;
  barCouncil: string;
  barAssociation: string;
  barCouncilEnrollmentDate: string;
  // Step 3
  primarySpecialization: string;
  specializations: string[];
  jurisdictions: Array<{
    geography: {
      province: string;
      district?: string;
      tehsil?: string;
    };
    courts: string[];
  }>;
  // Step 4
  preLicensedYearsOfExperience: number;
  education: string[];
  certifications: string[];
  // Step 5
  documents: {
    cnicFront: File[];
    cnicBack: File[];
    barCardFront: File[];
    barCardBack: File[];
    selfie: File[];
  };
}


const LawyerSignupForm = () => {

  ////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { setOTPType } = useStateContext();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const currentStep = parseInt(stepParam || '1');

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
    primarySpecialization: '',
    specializations: [],
    jurisdictions: [],
    preLicensedYearsOfExperience: 0,
    education: [],
    certifications: [],
    documents: {
      cnicFront: [],
      cnicBack: [],
      barCardFront: [],
      barCardBack: [],
      selfie: []
    }
  });

  ////////////////////////////////////////////////// STATES //////////////////////////////////////////////////
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check signup progress from server
  const checkSignupProgress = useCallback(async (email: string) => {
    try {
      const result = await dispatch(getLawyerSignupProgress(email));
      if (result.meta.requestStatus === 'fulfilled' && result.payload) {
        const payload = result.payload as any;
        const { signupStatus } = payload;
        
        // Determine which step to redirect to based on signup status
        let targetStep = 1;
        switch (signupStatus) {
          case 'step_1_completed':
            targetStep = 2;
            break;
          case 'step_2_completed':
            targetStep = 3;
            break;
          case 'step_3_completed':
            targetStep = 4;
            break;
          case 'step_4_completed':
            targetStep = 5;
            break;
          case 'step_5_completed':
            // All steps completed, redirect to OTP verification
            setOTPType(OtpVerificationType.SIGNUP);
            router.push(`/auth/verify-otp?role=${UserRole.LAWYER}`);
            return;
          default:
            targetStep = 1;
        }
        
        // Redirect to the appropriate step
        if (targetStep !== currentStep) {
          router.push(`/auth/sign-up?type=lawyer&step=${targetStep}`);
        }
      }
    } catch (error) {
      console.error('Failed to check signup progress:', error);
    }
  }, [dispatch, currentStep, router, setOTPType]);

  // Load saved draft and check signup progress
  useEffect(() => {
    const savedDraft = localStorage.getItem('lawyer-signup-draft');
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft);
      setFormData(draftData);
      
      // If we have an email, check signup progress
      if (draftData.email) {
        checkSignupProgress(draftData.email);
      }
    }
  }, [checkSignupProgress]);

  // Save draft
  useEffect(() => {
    localStorage.setItem('lawyer-signup-draft', JSON.stringify(formData));
  }, [formData]);

  ////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////
  const updateForm = (field: keyof LawyerFormData, value: any) => {
    setFormData((prev: LawyerFormData) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  // Validate step
  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    if (step === 1) {
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

      // Full name validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 5) {
        newErrors.fullName = 'Full name must be at least 5 characters';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
        newErrors.fullName = 'Full name can only contain letters and spaces';
      }

      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validate(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid Pakistani phone number (e.g., +92 300 1234567 or 0300 1234567)';
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }

      // CNIC validation
      if (!formData.cnic.trim()) {
        newErrors.cnic = 'CNIC is required';
      } else if (!cnicRegex.test(formData.cnic.trim())) {
        newErrors.cnic = 'Please enter a valid CNIC format (12345-1234567-1)';
      }

    } else if (step === 2) {
      // License number validation
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'License number is required';
      } else if (!licenseRegex.test(formData.licenseNumber.trim())) {
        newErrors.licenseNumber = 'Please enter a valid license number (3-15 alphanumeric characters)';
      }

      // Bar council validation
      if (!formData.barCouncil.trim()) {
        newErrors.barCouncil = 'Bar council is required';
      }

      // Bar association validation
      if (!formData.barAssociation.trim()) {
        newErrors.barAssociation = 'Bar association is required';
      } else if (formData.barAssociation.trim().length < 3) {
        newErrors.barAssociation = 'Bar association must be at least 3 characters';
      }

      // Enrollment date validation
      if (!formData.barCouncilEnrollmentDate.trim()) {
        newErrors.barCouncilEnrollmentDate = 'Enrollment date is required';
      } else {
        const enrollmentDate = new Date(formData.barCouncilEnrollmentDate);
        const currentDate = new Date();
        if (enrollmentDate > currentDate) {
          newErrors.barCouncilEnrollmentDate = 'Enrollment date cannot be in the future';
        } else if (enrollmentDate < new Date('1950-01-01')) {
          newErrors.barCouncilEnrollmentDate = 'Please enter a valid enrollment date';
        }
      }

    } else if (step === 3) {
      if (!formData.primarySpecialization.trim()) newErrors.primarySpecialization = 'Primary specialization is required';
      if (formData.specializations.length === 0) newErrors.specializations = 'At least one specialization is required';
      if (formData.jurisdictions.length === 0) newErrors.jurisdictions = 'At least one jurisdiction is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit step
  const submitStep = async (step: number) => {
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      let result;
      
      switch (step) {
        case 1:
          result = await dispatch(lawyerSignupStep1({
            firstname: formData.firstname,
            lastname: formData.lastname,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            cnic: formData.cnic
          }));
          break;
          
        case 2:
          result = await dispatch(lawyerSignupStep2({
            email: formData.email,
            licenseNumber: formData.licenseNumber,
            barCouncil: formData.barCouncil,
            barAssociation: formData.barAssociation,
            barCouncilEnrollmentDate: formData.barCouncilEnrollmentDate
          }));
          break;
          
        case 3:
          result = await dispatch(lawyerSignupStep3({
            email: formData.email,
            primarySpecialization: formData.primarySpecialization,
            specializations: formData.specializations,
            jurisdictions: formData.jurisdictions
          }));
          break;
          
        case 4:
          result = await dispatch(lawyerSignupStep4({
            email: formData.email,
            preLicensedYearsOfExperience: formData.preLicensedYearsOfExperience,
            education: formData.education,
            certifications: formData.certifications
          }));
          break;
          
        case 5:
          result = await dispatch(lawyerSignupStep5({
            email: formData.email,
            documents: formData.documents
          }));
          break;
          
        default:
          throw new Error('Invalid step');
      }

      if (result.meta.requestStatus === 'fulfilled') {
        if (step < 5) {
          // Move to next step
          router.push(`/auth/sign-up?type=lawyer&step=${step + 1}`);
        } else {
          // All steps completed, go to OTP verification
          localStorage.removeItem('lawyer-signup-draft');
          setOTPType(OtpVerificationType.SIGNUP);
          router.push(`/auth/verify-otp?role=${UserRole.LAWYER}`);
        }
      }
    } catch (error) {
      console.error('Lawyer signup step error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Skip verification step
  const skipVerificationStep = () => {
    router.push(`/auth/sign-up?type=lawyer&step=5`);
  };

  ////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  const renderStep1 = () => (
    <div>
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Basic Information
        </h3>
        <p className="text-sm text-muted-foreground">Step 1 of 5</p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submitStep(1); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
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

          <div>
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
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Full Name (as per CNIC)</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateForm('fullName', e.target.value)}
            placeholder="Enter your full name as it appears on CNIC"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.fullName && <span className="text-destructive text-sm">{errors.fullName}</span>}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateForm('email', e.target.value)}
            placeholder="lawyer@example.com"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.email && <span className="text-destructive text-sm">{errors.email}</span>}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateForm('phone', e.target.value)}
            placeholder="+92 300 1234567 or 0300 1234567"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.phone && <span className="text-destructive text-sm">{errors.phone}</span>}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">CNIC</label>
          <input
            type="text"
            value={formData.cnic}
            onChange={(e) => updateForm('cnic', e.target.value)}
            placeholder="12345-1234567-1"
            maxLength={15}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <p className="text-xs text-gray-500 mt-1">Format: 12345-1234567-1 (Pakistani CNIC format)</p>
          {errors.cnic && <span className="text-destructive text-sm">{errors.cnic}</span>}
        </div>

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
          {errors.password && <span className="text-destructive text-sm">{errors.password}</span>}
        </div>

        <div className="flex justify-between items-center">
          <Link href="/auth/sign-in" className="text-primary">
            Already have an account? Sign in
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-primary/75"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Professional Information
        </h3>
        <p className="text-sm text-muted-foreground">Step 2 of 5</p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submitStep(2); }}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">License Number</label>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => updateForm('licenseNumber', e.target.value)}
            placeholder="e.g., LHR-2023-001 or 12345"
            maxLength={15}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <p className="text-xs text-gray-500 mt-1">3-15 alphanumeric characters (letters, numbers, and hyphens allowed)</p>
          {errors.licenseNumber && <span className="text-destructive text-sm">{errors.licenseNumber}</span>}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Bar Council</label>
          <select
            value={formData.barCouncil}
            onChange={(e) => updateForm('barCouncil', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select Bar Council</option>
            {Object.values(BarCouncils).map(council => (
              <option key={council} value={council}>{council}</option>
            ))}
          </select>
          {errors.barCouncil && <span className="text-destructive text-sm">{errors.barCouncil}</span>}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Bar Association</label>
          <input
            type="text"
            value={formData.barAssociation}
            onChange={(e) => updateForm('barAssociation', e.target.value)}
            placeholder="e.g., Lahore Bar Association"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.barAssociation && <span className="text-destructive text-sm">{errors.barAssociation}</span>}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Enrollment Date</label>
          <input
            type="date"
            min={new Date('1950-01-01').toISOString().split('T')[0]}
            max={new Date().toISOString().split('T')[0]}
            value={formData.barCouncilEnrollmentDate}
            onChange={(e) => updateForm('barCouncilEnrollmentDate', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.barCouncilEnrollmentDate && <span className="text-destructive text-sm">{errors.barCouncilEnrollmentDate}</span>}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push(`/auth/sign-up?type=lawyer&step=1`)}
            className="flex items-center gap-2 px-6 py-3 border border-stroke text-foreground rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-primary/75"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Legal Expertise
        </h3>
        <p className="text-sm text-muted-foreground">Step 3 of 5</p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submitStep(3); }}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Primary Specialization</label>
          <select
            value={formData.primarySpecialization}
            onChange={(e) => updateForm('primarySpecialization', e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select Primary Specialization</option>
            {Object.values(LawCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.primarySpecialization && <span className="text-destructive text-sm">{errors.primarySpecialization}</span>}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Additional Specializations</label>
          <p className="text-xs text-gray-500 mb-2">Select all areas of law you practice</p>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-stroke rounded-lg p-3">
            {Object.values(LawCategory).map(category => (
              <label key={category} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.specializations.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateForm('specializations', [...formData.specializations, category]);
                    } else {
                      updateForm('specializations', formData.specializations.filter(s => s !== category));
                    }
                  }}
                  className="rounded"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
          {errors.specializations && <span className="text-destructive text-sm">{errors.specializations}</span>}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Jurisdictions</label>
          <p className="text-xs text-gray-500 mb-2">Add the areas where you can practice law</p>
          <div className="space-y-3">
            {formData.jurisdictions.map((jurisdiction, index) => (
              <div key={index} className="border border-stroke rounded-lg p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Province</label>
                    <input
                      type="text"
                      value={jurisdiction.geography.province}
                      onChange={(e) => {
                        const newJurisdictions = [...formData.jurisdictions];
                        newJurisdictions[index].geography.province = e.target.value;
                        updateForm('jurisdictions', newJurisdictions);
                      }}
                      placeholder="e.g., Punjab"
                      className="w-full rounded border border-stroke bg-transparent py-2 px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">District (Optional)</label>
                    <input
                      type="text"
                      value={jurisdiction.geography.district || ''}
                      onChange={(e) => {
                        const newJurisdictions = [...formData.jurisdictions];
                        newJurisdictions[index].geography.district = e.target.value;
                        updateForm('jurisdictions', newJurisdictions);
                      }}
                      placeholder="e.g., Lahore"
                      className="w-full rounded border border-stroke bg-transparent py-2 px-3 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Courts: {jurisdiction.courts.length} selected</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newJurisdictions = formData.jurisdictions.filter((_, i) => i !== index);
                      updateForm('jurisdictions', newJurisdictions);
                    }}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                updateForm('jurisdictions', [...formData.jurisdictions, {
                  geography: { province: '', district: '', tehsil: '' },
                  courts: []
                }]);
              }}
              className="w-full border-2 border-dashed border-stroke rounded-lg py-3 text-sm text-gray-600 hover:border-primary hover:text-primary"
            >
              + Add Jurisdiction
            </button>
          </div>
          {errors.jurisdictions && <span className="text-destructive text-sm">{errors.jurisdictions}</span>}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push(`/auth/sign-up?type=lawyer&step=2`)}
            className="flex items-center gap-2 px-6 py-3 border border-stroke text-foreground rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-primary/75"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Experience & Education
        </h3>
        <p className="text-sm text-muted-foreground">Step 4 of 5</p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submitStep(4); }}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Pre-Licensed Experience (Years)</label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.preLicensedYearsOfExperience}
            onChange={(e) => updateForm('preLicensedYearsOfExperience', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-foreground outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <p className="text-xs text-gray-500 mt-1">Years of legal experience before getting your license</p>
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Education</label>
          <p className="text-xs text-gray-500 mb-2">Add your educational qualifications</p>
          <div className="space-y-2">
            {formData.education.map((edu, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={edu}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index] = e.target.value;
                    updateForm('education', newEducation);
                  }}
                  placeholder="e.g., LLB from University of Punjab"
                  className="flex-1 rounded border border-stroke bg-transparent py-2 px-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newEducation = formData.education.filter((_, i) => i !== index);
                    updateForm('education', newEducation);
                  }}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateForm('education', [...formData.education, ''])}
              className="text-primary text-sm hover:text-primary/80"
            >
              + Add Education
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-foreground">Certifications</label>
          <p className="text-xs text-gray-500 mb-2">Add any professional certifications</p>
          <div className="space-y-2">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={cert}
                  onChange={(e) => {
                    const newCertifications = [...formData.certifications];
                    newCertifications[index] = e.target.value;
                    updateForm('certifications', newCertifications);
                  }}
                  placeholder="e.g., Certified Mediator"
                  className="flex-1 rounded border border-stroke bg-transparent py-2 px-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newCertifications = formData.certifications.filter((_, i) => i !== index);
                    updateForm('certifications', newCertifications);
                  }}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateForm('certifications', [...formData.certifications, ''])}
              className="text-primary text-sm hover:text-primary/80"
            >
              + Add Certification
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push(`/auth/sign-up?type=lawyer&step=3`)}
            className="flex items-center gap-2 px-6 py-3 border border-stroke text-foreground rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-primary/75"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep5 = () => (
    <div>
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Identity Verification
        </h3>
        <p className="text-sm text-muted-foreground">Step 5 of 5 - Document Upload (Optional)</p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Document Checklist</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>CNIC Front</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-600" />
            <span>CNIC Back (Required)</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-600" />
            <span>Bar Card Front (Required)</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-600" />
            <span>Bar Card Back (Required)</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-600" />
            <span>Selfie (Required)</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Upload your verification documents</p>
          <p className="text-sm text-gray-500 mb-6">
            You can complete this step later in your profile settings
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push(`/auth/sign-up?type=lawyer&step=4`)}
            className="flex items-center gap-2 px-6 py-3 border border-stroke text-foreground rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={skipVerificationStep}
              className="px-6 py-3 border border-stroke text-foreground rounded-lg hover:bg-gray-50"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={() => submitStep(5)}
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-primary/75"
            >
              {loading ? "Creating Account..." : "Complete Signup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
};

export default LawyerSignupForm;
