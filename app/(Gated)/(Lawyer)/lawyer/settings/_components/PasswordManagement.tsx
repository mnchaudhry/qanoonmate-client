"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react'
import { changePassword } from '@/store/reducers/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import toast from 'react-hot-toast'

const PasswordManagement = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [inputError, setInputError] = useState({ password: { length: false, uppercase: false, lowercase: false, special: false, number: false }, confirmPassword: false })

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }))
  }

  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!')
      return
    }

    if (!user?._id) return;

    setLoading(true)
    dispatch(changePassword({ oldPassword: formData.currentPassword, newPassword: formData.newPassword }))
      .then(() => {
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setInputError({ password: { length: false, uppercase: false, lowercase: false, special: false, number: false }, confirmPassword: false })
        setShowPasswords({ current: false, new: false, confirm: false })
      })
      .finally(() => setLoading(false))
  }

  const validateForm = (field?: string) => {
    const numberRegex = /\d/;
    const specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;

    const hasNumber = numberRegex.test(formData?.newPassword);
    const hasSpecialChar = specialCharacterRegex.test(formData?.newPassword);
    const hasUppercase = uppercaseRegex.test(formData?.newPassword);
    const hasLowercase = lowercaseRegex.test(formData?.newPassword);


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
      else if (formData?.newPassword.length < 8) {
        setInputError(pre => ({ ...pre, password: { uppercase: false, lowercase: false, number: false, special: false, length: true } }));
      }
      else {
        setInputError(pre => ({ ...pre, password: { uppercase: false, lowercase: false, number: false, special: false, length: false } }));
      }
    }

    if (!field || field === 'confirmPassword') {
      if (formData.newPassword !== formData.confirmPassword) {
        setInputError(pre => ({ ...pre, confirmPassword: true }));
      }
      else {
        setInputError(pre => ({ ...pre, confirmPassword: false }));
      }
    }
    return true;
  };


  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl ">
          <Lock className="h-5 w-5 text-primary" />
          Password Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              placeholder="Enter your current password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                onBlur={() => validateForm('password')}
                placeholder="Enter your new password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2 ">
            {
              inputError.password.length && !inputError.password.uppercase && !inputError.password.lowercase && !inputError.password.special && !inputError.password.number &&
              <div className={`flex items-center gap-1.5 ${inputError.password.length ? 'text-destructive' : 'text-success'} text-sm`}  >
                <Check className='w-4 h-4' />
                <span>Password must be atleast 8 character</span>
              </div>
            }
            {
              inputError.password.uppercase && !inputError.password.length && !inputError.password.lowercase && !inputError.password.special && !inputError.password.number &&
              <div className={`flex items-center gap-1.5 ${inputError.password.uppercase ? 'text-destructive' : 'text-success'} text-sm`}  >
                <Check className='w-4 h-4' />
                <span>Password must have atleast one upper case character</span>
              </div>
            }
            {
              inputError.password.lowercase && !inputError.password.length && !inputError.password.uppercase && !inputError.password.special && !inputError.password.number &&
              <div className={`flex items-center gap-1.5 ${inputError.password.lowercase ? 'text-destructive' : 'text-success'} text-sm`}  >
                <Check className='w-4 h-4' />
                <span>Password must have atleast one lower case character</span>
              </div>
            }
            {
              inputError.password.special && !inputError.password.length && !inputError.password.uppercase && !inputError.password.lowercase && !inputError.password.number &&
              <div className={`flex items-center gap-1.5 ${inputError.password.special ? 'text-destructive' : 'text-success'} text-sm`}  >
                <Check className='w-4 h-4' />
                <span>Password must have atleast one special character</span>
              </div>
            }
            {
              inputError.password.number && !inputError.password.length && !inputError.password.uppercase && !inputError.password.lowercase && !inputError.password.special &&
              <div className={`flex items-center gap-1.5 ${inputError.password.number ? 'text-destructive' : 'text-success'} text-sm`}  >
                <Check className='w-4 h-4' />
                <span>Password must have atleast one number</span>
              </div>
            }
          </div>
        </div>

        <div className="space-y-1">
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => validateForm('confirmPassword')}
                placeholder="Confirm your new password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2 ">
            {
              inputError.confirmPassword &&
              <div className={`flex items-center gap-1.5 text-destructive text-sm`}  >
                <X className='w-4 h-4' />
                <span>New passwords do not match!</span>
              </div>
            }
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading} >
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PasswordManagement
