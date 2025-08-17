"use client"

import React, { useEffect, useState } from 'react';
import Preferences from './_components/Preferences';
import Verifications from './_components/Verifications';
import DangerZone from './_components/DangerZone';
import { User, FileText, AlertTriangle, Settings, Shield, CreditCard, Calendar, PhoneCall } from 'lucide-react';
import PageHeader from '../_components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Billing from './_components/Billing';
import Security from './_components/Security';
import { useRouter, useSearchParams } from 'next/navigation';
import Availability from './_components/Availability';
import ConsultationSettings from './_components/ConsultationSettings';
import LawyerProfile from './_components/LawyerProfile';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getLawyerSettings } from '@/store/reducers/lawyerSettingsSlice';


const SECTIONS = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'verifications', label: 'Verifications', icon: FileText },
    { key: 'availability', label: 'Availability', icon: Calendar },
    { key: 'consultation', label: 'Consultation Settings', icon: PhoneCall },
    { key: 'preferences', label: 'Preferences', icon: Settings },
    { key: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];


const SettingsPage = () => {

    //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedSettings } = useSelector((state: RootState) => state.lawyerSettings);

    //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
    const [selected, setSelected] = useState(searchParams.get('section') || 'profile');

    //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
    useEffect(() => {
        if (selectedSettings) return;
        dispatch(getLawyerSettings());
    }, [searchParams, dispatch, selectedSettings]);

    //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
    const renderContent = () => {
        switch (selected) {
            case 'profile':
                return <LawyerProfile />;
            case 'preferences':
                return <Preferences />;
            case 'availability':
                return <Availability />;
            case 'consultation':
                return <ConsultationSettings />;
            case 'verifications':
                return <Verifications />;
            case 'billing':
                return <Billing />;
            case 'security':
                return <Security />;
            case 'danger':
                return <DangerZone />;
            default:
                return null;
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
                <Card className="w-1/4 min-w-[180px] max-w-xs p-0 overflow-hidden sticky top-4 self-start">
                    <div className="flex flex-col gap-1 p-2 ">
                        {SECTIONS.map(({ key, label, icon: Icon }) => (
                            <Button
                                key={key}
                                variant={selected === key ? 'default' : 'ghost'}
                                className={`justify-start px-6 py-4 text-base font-medium gap-3`}
                                onClick={() => {
                                    setSelected(key);
                                    router.push(`/lawyer/settings?section=${key}`);
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
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
