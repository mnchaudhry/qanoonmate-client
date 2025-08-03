"use client"

import React, { useEffect, useState } from 'react';
import ProfileInformation from './_components/ProfileInformation';
import PasswordManagement from './_components/PasswordManagement';
import Preferences from './_components/Preferences';
import Verifications from './_components/Verifications';
import DangerZone from './_components/DangerZone';
import { User, Lock, FileText, AlertTriangle, Settings, Shield, CreditCard } from 'lucide-react';
import PageHeader from '../_components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Billing from './_components/Billing';
import Security from './_components/Security';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getClientSettings } from '@/store/reducers/clientSettingsSlice';

const SECTIONS = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'password', label: 'Password', icon: Lock },
    { key: 'preferences', label: 'Preferences', icon: Settings },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'verifications', label: 'Verifications', icon: FileText },
    { key: 'billing', label: 'Billing', icon: CreditCard },
    { key: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

const SettingsPage = () => {

    //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
    const searchParams = useSearchParams();
    const { loading } = useSelector((state: RootState) => state.clientSettings)
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
    const [selected, setSelected] = useState(searchParams.get('section') || 'profile');

    //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
    useEffect(() => {
        dispatch(getClientSettings());
    }, [dispatch]);

    //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
    const renderContent = () => {
        switch (selected) {
            case 'profile':
                return <ProfileInformation />;
            case 'password':
                return <PasswordManagement />;
            case 'preferences':
                return <Preferences />;
            case 'verifications':
                return <Verifications />;
            case 'billing':
                return <Billing />;
            case 'security':
                return <Security />;
            case 'danger':
                return <DangerZone />;
            default:
                return <ProfileInformation />;
        }
    };

    //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
    return (
        <div className="w-full space-y-4">
            <PageHeader
                title="Settings"
                description="Manage your account settings and preferences."
            />
            <div className="flex gap-6 items-start">
                {/* Sidebar */}
                <Card className="w-1/4 min-w-[180px] max-w-xs p-0 overflow-hidden sticky top-24 self-start">
                    <div className="flex flex-col gap-1 p-2 ">
                        {SECTIONS.map(({ key, label, icon: Icon }) => (
                            <Button
                                key={key}
                                variant={selected === key ? 'default' : 'ghost'}
                                className={`justify-start px-6 py-4 text-base font-medium gap-3`}
                                onClick={() => {
                                    setSelected(key);
                                    router.push(`/client/settings?section=${key}`);
                                }}
                            >
                                <Icon className="w-5 h-5" />
                                {label}
                            </Button>
                        ))}
                    </div>
                </Card>
                {/* Content */}
                <div className="w-3/4 flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
