'use client';

import React, { useState } from 'react';
import {  Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  LogIn, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CreditCard,
  Coins,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { login } from '@/store/reducers/authSlice';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/enums';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
  showBenefits?: boolean;
  redirectAfterLogin?: string;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Sign In Required",
  description = "Please sign in to continue with your request",
  showBenefits = true,
  redirectAfterLogin
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(login({
        role: UserRole.CLIENT, // Default to client role for modal
        data: {
          email: formData.email,
          password: formData.password
        }
      })).unwrap();

      toast.success('Welcome back!');
      
      // Close modal and execute success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }

      // Redirect if specified
      if (redirectAfterLogin) {
        router.push(redirectAfterLogin);
      }
    } catch (error: any) {
      toast.error(error || 'Failed to sign in');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignUpRedirect = () => {
    onClose();
    router.push('/auth/sign-up');
  };

  const handleForgotPassword = () => {
    onClose();
    router.push('/auth/forgot-password');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LogIn className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Section */}
          {showBenefits && (
            <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Unlock Premium Features</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Sign in to access all QanoonMate features
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Coins className="h-3 w-3 text-yellow-500" />
                    <span>Purchase Credits</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="h-3 w-3 text-green-500" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-blue-500" />
                    <span>Personal Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowRight className="h-3 w-3 text-purple-500" />
                    <span>Transaction History</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Email Address</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{formErrors.email}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-1">
                <Lock className="h-3 w-3" />
                <span>Password</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={formErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{formErrors.password}</span>
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Additional Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <Button
                variant="link"
                onClick={handleForgotPassword}
                className="p-0 h-auto text-xs"
              >
                Forgot your password?
              </Button>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Don&apos;t have an account?
              </p>
              <Button
                variant="outline"
                onClick={handleSignUpRedirect}
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
