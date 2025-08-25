"use client"

import React, { useEffect, useState } from 'react';
import ProfileInformation from './_components/ProfileInformation';
import PasswordManagement from './_components/PasswordManagement';
import Preferences from './_components/Preferences';
import Verifications from './_components/Verifications';
import DangerZone from './_components/DangerZone';
import { User, Lock, FileText, AlertTriangle, Settings, Shield, CreditCard, Bell, Palette } from 'lucide-react';
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
    { key: 'profile', label: 'Profile', icon: User, description: 'Personal information and contact details' },
    { key: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, and account protection' },
    { key: 'preferences', label: 'Preferences', icon: Bell, description: 'Notifications and app settings' },
    { key: 'verifications', label: 'Verifications', icon: FileText, description: 'Identity and document verification' },
    { key: 'billing', label: 'Billing', icon: CreditCard, description: 'Payment methods and subscriptions' },
    { key: 'danger', label: 'Danger Zone', icon: AlertTriangle, description: 'Account deletion and reset options' },
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
            case 'security':
                return <Security />;
            case 'preferences':
                return <Preferences />;
            case 'verifications':
                return <Verifications />;
            case 'billing':
                return <Billing />;
            case 'danger':
                return <DangerZone />;
            default:
                return <ProfileInformation />;
        }
    };

    const getSectionIcon = (key: string) => {
        const section = SECTIONS.find(s => s.key === key);
        return section ? section.icon : Settings;
    };

    const getSectionTitle = (key: string) => {
        const section = SECTIONS.find(s => s.key === key);
        return section ? section.label : 'Settings';
    };

    const getSectionDescription = (key: string) => {
        const section = SECTIONS.find(s => s.key === key);
        return section ? section.description : 'Manage your account settings';
    };

    //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
    return (
        <div className="w-full space-y-6">
            <PageHeader
                title="Account Settings"
                description="Manage your account preferences, security, and personal information."
            />
            
            <div className="flex gap-8 items-start">
                {/* Sidebar */}
                <Card className="w-80 p-0 overflow-hidden sticky top-24 self-start">
                    <div className="p-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-900">Settings</h3>
                        <p className="text-sm text-slate-600">Choose a category to manage</p>
                    </div>
                    <div className="flex flex-col gap-1 p-2">
                        {SECTIONS.map(({ key, label, icon: Icon, description }) => (
                            <Button
                                key={key}
                                variant={selected === key ? 'default' : 'ghost'}
                                className={`justify-start px-4 py-3 text-sm font-medium gap-3 h-auto min-h-[60px] ${
                                    selected === key 
                                        ? 'bg-primary text-primary-foreground shadow-sm' 
                                        : 'hover:bg-slate-100 text-slate-700'
                                }`}
                                onClick={() => {
                                    setSelected(key);
                                    router.push(`/client/settings?section=${key}`);
                                }}
                            >
                                <Icon className={`w-5 h-5 ${selected === key ? 'text-primary-foreground' : 'text-slate-600'}`} />
                                <div className="flex flex-col items-start text-left">
                                    <span className="font-medium">{label}</span>
                                    <span className={`text-xs ${selected === key ? 'text-primary-foreground/80' : 'text-slate-500'}`}>
                                        {description}
                                    </span>
                                </div>
                            </Button>
                        ))}
                    </div>
                </Card>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <Card className="p-8">
                            <div className="flex items-center justify-center h-64">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    <span>Loading settings...</span>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {/* Section Header */}
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                    {React.createElement(getSectionIcon(selected), { 
                                        className: "w-5 h-5 text-slate-600" 
                                    })}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        {getSectionTitle(selected)}
                                    </h2>
                                    <p className="text-slate-600">
                                        {getSectionDescription(selected)}
                                    </p>
                                </div>
                            </div>

                            {/* Section Content */}
                            {renderContent()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
