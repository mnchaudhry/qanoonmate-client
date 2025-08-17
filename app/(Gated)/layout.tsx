"use client";

import React, { ReactNode, useEffect } from 'react'
import ComingSoonWrapper from '@/wrappers/ComingSoonWrapper';
import localStorageManager from '@/utils/localStorage';
import { useStateContext } from '@/context/useStateContext';

const LandingPageLayout = ({ children }: { children: ReactNode }) => {

    const { isBetaUser, setIsBetaUser } = useStateContext();

    useEffect(() => {
        const isIt = localStorageManager.getItem('beta_user') as boolean;
        if (isIt) {
            setIsBetaUser(isIt);
        }
    }, [setIsBetaUser]);

    return (
        isBetaUser
            ?
            children
            :
            <ComingSoonWrapper
                title="Your AI-Powered Legal Companion is Arriving"
                description="Law made accessible. Insights made simple."
                estimatedDate="Launching August 20, 2025"
            >
                <></>
            </ComingSoonWrapper>
    )
}

export default LandingPageLayout