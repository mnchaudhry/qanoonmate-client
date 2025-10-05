"use client"

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/lib/enums';
import ClientSignupForm from './_components/ClientSignupForm';
import LawyerSignupForm from './_components/LawyerSignupForm';
import AuthFlowGuard from '@/components/auth/AuthFlowGuard';

const SignUp: React.FC = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const typeParam = searchParams.get('type');

  // Use role from URL query, fallback to type, then default to client
  const role = Object.values(UserRole).includes(roleParam as UserRole) ? roleParam as UserRole :
    (typeParam === 'lawyer' ? UserRole.LAWYER : UserRole.CLIENT);

  const [activeTab, setActiveTab] = useState(role === UserRole.LAWYER ? 'lawyer' : 'client');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'client') {
      router.push('/auth/sign-up?role=client');
    } else {
      router.push('/auth/sign-up?role=lawyer');
    }
  };

  return (
    <AuthFlowGuard allowedRoles={[UserRole.CLIENT, UserRole.LAWYER]}>
      <div className="w-full border-stroke xl:border-l-2 lg:pl-12">
        <div className="w-full p-4 sm:py-12.5 xl:py-17.5">
          <h2 className="mb-9 text-2xl font-bold text-foreground sm:text-title-xl2">
            Create Your Account
          </h2>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="client" className="flex items-center gap-2">
                User
              </TabsTrigger>
              <TabsTrigger value="lawyer" className="flex items-center gap-2">
                Lawyer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="mt-0">
              <ClientSignupForm />
            </TabsContent>

            <TabsContent value="lawyer" className="mt-0">
              <LawyerSignupForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthFlowGuard>
  );
};

export default SignUp;
