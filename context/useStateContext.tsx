"use client"

import { OtpVerificationType } from '@/lib/enums';
import { Summary } from '@/store/types/api';
import { Lawyer } from '@/store/types/lawyer.types';
import { User } from '@/store/types/user.types';
import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';

interface StateContextType {
    isBetaUser: boolean, setIsBetaUser: Dispatch<SetStateAction<boolean>>,
    OTPType: OtpVerificationType, setOTPType: (value: OtpVerificationType) => void
    selectedUser: User | null, setSelectedUser: Dispatch<SetStateAction<User | null>>,
    selectedLawyer: Lawyer | null, setSelectedLawyer: Dispatch<SetStateAction<Lawyer | null>>,
    selectedSummary: Summary | null, setSelectedSummary: Dispatch<SetStateAction<Summary | null>>,
    isScrolled: boolean, setIsScrolled: Dispatch<SetStateAction<boolean>>,
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    ///////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////////
    const [isBetaUser, setIsBetaUser] = useState<boolean>(false);

    const [isScrolled, setIsScrolled] = useState(false);

    // For Auth Screens
    const [OTPType, setOTPType] = useState<OtpVerificationType>(OtpVerificationType.SIGNUP)
    // For Admin Screens
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // For Admin Screens
    const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)
    const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)

    ///////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////////////
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    ///////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////////
    return (
        <StateContext.Provider
            value={{
                isBetaUser, setIsBetaUser,
                OTPType, setOTPType,
                selectedUser, setSelectedUser,
                selectedLawyer, setSelectedLawyer,
                selectedSummary, setSelectedSummary,
                isScrolled, setIsScrolled,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = (): StateContextType => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('useStateContext must be used within a StateProvider');
    }
    return context;
};
