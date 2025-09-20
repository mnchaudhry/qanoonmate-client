"use client";

import React from 'react';
import { WalletPage } from '@/components/wallet/WalletPage';
import PageHeader from '../_components/PageHeader';

const Wallet = () => {
  return (
    <div className="w-full space-y-4">
      <PageHeader
        title="Qanoon Credits Wallet"
        description="Manage your credits and purchase more to access premium features."
      />
      <WalletPage />
    </div>
  );
};

export default Wallet;
